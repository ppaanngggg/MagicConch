package schema

import (
	"entgo.io/ent"
	"entgo.io/ent/schema/field"
	"entgo.io/ent/schema/mixin"
	"github.com/sashabaranov/go-openai"
)

// Conversation holds the schema definition for the Conversation entity.
type Conversation struct {
	ent.Schema
}

func (Conversation) Mixins() []ent.Mixin {
	return []ent.Mixin{mixin.Time{}}
}

// Fields of the Conversation.
func (Conversation) Fields() []ent.Field {
	return []ent.Field{
		field.String("title").Optional(),
		field.JSON("messages", []openai.ChatCompletionMessage{}),
	}
}

// Edges of the Conversation.
func (Conversation) Edges() []ent.Edge {
	return nil
}
