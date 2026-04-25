package todo

import (
	"net/http"

	"github.com/todo/templates/shared"
)

type handler struct {
	provider Provider
}

func NewHandler() shared.Handler[Provider]{
	return &handler{}
}

func (h *handler) SetProvider(provider Provider) {
	h.provider = provider
}

func (h *handler) GetName() string {
	return "todo"
}

func (h *handler) GetRoutes() []shared.Route {
	p := h.provider
	return []shared.Route{
		{
			Method: http.MethodGet,
			Path:   "/",
			Func:   shared.BuildWithoutRequest(Index, p.GetTodoProvider),
		},
		{
			Method: http.MethodPost,
			Path:   "/add_todo",
			Func:   shared.Build(Index, p.AddTodo, p.PostTodo),
		},
		{
			Method: http.MethodPost,
			Path:   "/update_todo",
			Func:   shared.Build(Index, p.UpdateTodo, p.PatchTodo),
		},
		{
			Method: http.MethodGet,
			Path:   "/get_categories_count",
			Func:   shared.BuildWithoutRequest(Categories, p.GetCategoriesCount),
		},
	}
}