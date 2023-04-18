package main

import (
	"context"
	dbsql "database/sql"
	"encoding/json"
	"entgo.io/ent/dialect/sql"
	"github.com/ppaanngggg/MagicConch/ent/conversation"
	"net/http"
	"net/url"
	"strconv"
	"strings"

	"github.com/ppaanngggg/MagicConch/ent"
	"github.com/sashabaranov/go-openai"
	"github.com/wailsapp/wails/v2/pkg/runtime"

	"github.com/kirsle/configdir"

	_ "modernc.org/sqlite"
)

type App struct {
	ctx  context.Context
	data *ent.Client
	ai   *openai.Client

	temperature float32
}

func NewApp() *App {
	userConfigDir := configdir.LocalConfig("MagicConch")
	if err := configdir.MakePath(userConfigDir); err != nil {
		panic(err)
	}

	db, err := dbsql.Open("sqlite", userConfigDir+"/db?_pragma=foreign_keys(1)")
	if err != nil {
		panic(err)
	}
	client := ent.NewClient(ent.Driver(sql.NewDriver("sqlite3", sql.Conn{ExecQuerier: db})))
	if err = client.Schema.Create(context.Background()); err != nil {
		panic(err)
	}
	app := &App{
		data: client,
	}

	settings, err := app.GetSettings()
	if err != nil {
		panic(err)
	}
	app.setting(settings)

	return app
}

func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

func (a *App) shutdown(ctx context.Context) {
	err := a.data.Close()
	if err != nil {
		runtime.LogWarningf(ctx, "db close err: %v+", err)
	}
}

/*
Settings
*/

const (
	SettingsApiKey     = "api_key"
	SettingsProxy      = "proxy"
	SettingTemperature = "temperature"
)

type Settings struct {
	ApiKey      string  `json:"apiKey"`
	Proxy       string  `json:"proxy"`
	Temperature float32 `json:"temperature"`
}

func (a *App) setting(settings *Settings) {
	config := openai.DefaultConfig(settings.ApiKey)
	// transport
	clone := http.DefaultTransport.(*http.Transport).Clone()
	if settings.Proxy == "" {
		clone.Proxy = http.ProxyFromEnvironment
	} else {
		proxyUrl, err := url.Parse(settings.Proxy)
		if err == nil {
			clone.Proxy = http.ProxyURL(proxyUrl)
		}
	}
	config.HTTPClient.Transport = clone

	a.ai = openai.NewClientWithConfig(config)
	a.temperature = settings.Temperature
}

func (a *App) GetSettings() (*Settings, error) {
	records, err := a.data.Settings.Query().All(context.Background())
	if err != nil {
		return nil, err
	}
	settings := &Settings{Temperature: 1.0}
	for _, r := range records {
		if r.Key == SettingsApiKey && len(r.Values) > 0 {
			settings.ApiKey = r.Values[0]
		}
		if r.Key == SettingsProxy && len(r.Values) > 0 {
			settings.Proxy = r.Values[0]
		}
		if r.Key == SettingTemperature && len(r.Values) > 0 {
			t, err := strconv.ParseFloat(r.Values[0], 64)
			if err != nil {
				runtime.LogWarningf(a.ctx, "temperature parse err: %v+", err)
			} else {
				settings.Temperature = float32(t)
			}
		}
	}
	return settings, nil
}

func (a *App) SaveSettings(settings *Settings) error {
	if err := a.data.Settings.
		CreateBulk(
			a.data.Settings.Create().SetKey(SettingsApiKey).SetValues([]string{settings.ApiKey}),
			a.data.Settings.Create().SetKey(SettingsProxy).SetValues([]string{settings.Proxy}),
			a.data.Settings.Create().SetKey(SettingTemperature).SetValues([]string{
				strconv.FormatFloat(float64(settings.Temperature), 'f', 6, 32),
			}),
		).
		OnConflict().
		UpdateNewValues().
		Exec(context.Background()); err != nil {
		return err
	}

	a.setting(settings)
	return nil
}

/*
Conversation
*/

func (a *App) Chat(conversation *ent.Conversation) (*ent.Conversation, error) {
	req := openai.ChatCompletionRequest{
		Model:       openai.GPT3Dot5Turbo,
		Messages:    conversation.Messages,
		Temperature: a.temperature,
	}
	{
		tmp, err := json.MarshalIndent(req, "", "  ")
		if err != nil {
			runtime.LogWarningf(a.ctx, "chat req marshal err: %v+", err)
		}
		runtime.LogDebug(a.ctx, "chat req:\n"+string(tmp))
	}
	resp, err := a.ai.CreateChatCompletion(context.Background(), req)
	if err != nil {
		runtime.LogWarningf(a.ctx, "chat request err: %v+", err)
		return nil, err
	}
	if len(resp.Choices) > 0 {
		message := resp.Choices[0].Message
		{
			tmp, err := json.MarshalIndent(message, "", "  ")
			if err != nil {
				runtime.LogWarningf(a.ctx, "chat resp marshal err: %v+", err)
			}
			runtime.LogDebug(a.ctx, "chat resp:\n"+string(tmp))
		}
		conversation.Messages = append(conversation.Messages, message)
	}
	return conversation, nil
}

func (a *App) SaveConversation(conversation *ent.Conversation) (*ent.Conversation, error) {
	{
		tmp, err := json.MarshalIndent(conversation.Messages, "", "  ")
		if err != nil {
			runtime.LogWarningf(a.ctx, "save req marshal err: %v+", err)
		}
		runtime.LogDebug(a.ctx, "save req:\n"+string(tmp))
	}
	if conversation.ID > 0 {
		return a.data.Conversation.UpdateOneID(conversation.ID).
			SetMessages(conversation.Messages).
			Save(a.ctx)
	} else {
		title := ""
		for _, c := range conversation.Messages {
			if c.Role == openai.ChatMessageRoleUser {
				title = strings.Split(c.Content, "\n")[0]
				break
			}
		}
		return a.data.Conversation.Create().
			SetTitle(title).
			SetMessages(conversation.Messages).
			Save(a.ctx)
	}
}

func (a *App) GetConversation(id int) (*ent.Conversation, error) {
	return a.data.Conversation.Get(a.ctx, id)
}

func (a *App) DeleteConversation(id int) error {
	return a.data.Conversation.DeleteOneID(id).Exec(a.ctx)
}

func (a *App) ListConversations(query string) ([]*ent.Conversation, error) {
	runtime.LogDebug(a.ctx, "list query: "+query)
	q := a.data.Conversation.Query()
	if query != "" {
		q = q.Where(
			func(s *sql.Selector) {
				s.Where(sql.Like(conversation.FieldTitle, "%"+query+"%"))
			},
		)
	}
	return q.Order(ent.Desc(conversation.FieldUpdateTime)).All(a.ctx)
}
