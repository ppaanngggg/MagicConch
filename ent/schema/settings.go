package schema

import (
	"entgo.io/ent"
	"entgo.io/ent/schema/field"
)

type Settings struct {
	ent.Schema
}

func (Settings) Fields() []ent.Field {
	return []ent.Field{
		field.String("key").Unique(),
		field.Strings("values"),
	}
}

func (Settings) Edges() []ent.Edge {
	return []ent.Edge{}
}

func (Settings) Indexes() []ent.Index {
	return []ent.Index{}
}
