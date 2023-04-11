package schema

import (
	"entgo.io/ent"
	"entgo.io/ent/schema/field"
	"entgo.io/ent/schema/mixin"
	"time"
)

// System holds the schema definition for the System entity.
type System struct {
	ent.Schema
}

func (System) Mixin() []ent.Mixin {
	return []ent.Mixin{mixin.Time{}}
}

// Fields of the System.
func (System) Fields() []ent.Field {
	return []ent.Field{
		field.String("system").Unique(),
		field.Time("click_time").Default(time.Now),
	}
}

// Edges of the System.
func (System) Edges() []ent.Edge {
	return nil
}
