package main

import (
	"context"
	"encoding/json"
	"github.com/ppaanngggg/PipBot/ent"
	"github.com/sashabaranov/go-openai"
	"github.com/wailsapp/wails/v2/pkg/runtime"
	"net/http"
	"net/url"

	"github.com/kirsle/configdir"

	_ "github.com/mattn/go-sqlite3"
)

type App struct {
	ctx  context.Context
	data *ent.Client
	ai   *openai.Client
}

func NewApp() *App {
	userConfigDir := configdir.LocalConfig("PipBot")
	if err := configdir.MakePath(userConfigDir); err != nil {
		panic(err)
	}

	client, err := ent.Open(
		"sqlite3",
		"file:"+userConfigDir+"/db?mode=rwc&cache=shared&_fk=1",
	)
	if err != nil {
		panic(err)
	}
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
	app.setAI(settings)

	return app
}

func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

/*
Settings
*/

const (
	SettingsApiKey = "api_key"
	SettingsProxy  = "proxy"
)

type Settings struct {
	ApiKey string `json:"apiKey"`
	Proxy  string `json:"proxy"`
}

func (a *App) setAI(settings *Settings) {
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
}

func (a *App) GetSettings() (*Settings, error) {
	records, err := a.data.Settings.Query().All(context.Background())
	if err != nil {
		return nil, err
	}
	settings := &Settings{}
	for _, r := range records {
		if r.Key == SettingsApiKey && len(r.Values) > 0 {
			settings.ApiKey = r.Values[0]
		}
		if r.Key == SettingsProxy && len(r.Values) > 0 {
			settings.Proxy = r.Values[0]
		}
	}
	return settings, nil
}

func (a *App) SaveSettings(settings *Settings) error {
	if err := a.data.Settings.
		CreateBulk(
			a.data.Settings.Create().SetKey(SettingsApiKey).SetValues([]string{settings.ApiKey}),
			a.data.Settings.Create().SetKey(SettingsProxy).SetValues([]string{settings.Proxy}),
		).
		OnConflict().
		UpdateNewValues().
		Exec(context.Background()); err != nil {
		return err
	}

	a.setAI(settings)
	return nil
}

/*
Conversation
*/

func (a *App) Chat(conversation *ent.Conversation) (*ent.Conversation, error) {
	{
		tmp, err := json.MarshalIndent(conversation.Messages, "", "  ")
		if err != nil {
			runtime.LogWarningf(a.ctx, "chat req marshal err: %v+", err)
		}
		runtime.LogDebug(a.ctx, "chat req:\n"+string(tmp))
	}
	resp, err := a.ai.CreateChatCompletion(
		context.Background(),
		openai.ChatCompletionRequest{
			Model:    openai.GPT3Dot5Turbo,
			Messages: conversation.Messages,
		},
	)
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

func (a *App) Save(conversation *ent.Conversation) error {
	if conversation.ID > 0 {
		return a.data.Conversation.UpdateOneID(conversation.ID).
			SetMessages(conversation.Messages).
			Exec(a.ctx)
	} else {
		return a.data.Conversation.Create().
			SetTitle("").
			SetMessages(conversation.Messages).
			Exec(a.ctx)
	}
}

func (a *App) One(id int) (*ent.Conversation, error) {
	return a.data.Conversation.Get(a.ctx, id)
}

func (a *App) List() ([]*ent.Conversation, error) {
	return a.data.Conversation.Query().Order(ent.Desc("update_time")).All(a.ctx)
}
