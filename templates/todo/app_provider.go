package todo

import (
	"math/rand"
	"net/http"
	"strconv"
)

var (
	categoryOptions = []string{
		"General",
		"House",
		"Car",
		"Shopping",
	}

	todos = []Todo{
		{ID: 1, Todo: "Buy milk", Category: "House", Done: false},
		{ID: 2, Todo: "Buy bread", Category: "General", Done: false},
		{ID: 3, Todo: "Buy eggs", Category: "Shopping", Done: false},
		{ID: 4, Todo: "Buy cheese", Category: "General", Done: false},
		{ID: 5, Todo: "Buy apples", Category: "General", Done: false},
		{ID: 6, Todo: "Buy oranges", Category: "Car", Done: true},
		{ID: 7, Todo: "Buy bananas", Category: "General", Done: false},
		{ID: 8, Todo: "Buy potatoes", Category: "General", Done: true},
		{ID: 9, Todo: "Buy tomatoes", Category: "Shopping", Done: false},
		{ID: 10, Todo: "Buy avocados", Category: "General", Done: false},
	}
)

func GetCurrentModel() TodoModel {
	return TodoModel{
		Todos:           todos,
		CategoryOptions: categoryOptions,
	}
}

type Provider interface {
	GetTodoProvider() TodoModel
	GetCategoriesCount() CategoriesCountModel
	AddTodo(todo Todo) TodoModel
	UpdateTodo(todo Todo) TodoModel
	PostTodo(r *http.Request) Todo
	PatchTodo(r *http.Request) Todo
}

func NewDummyProvider() Provider {
	return &dummy{}
}

type dummy struct{}


func (p *dummy) GetTodoProvider() TodoModel {
	return TodoModel{
		Todos: todos,
		CategoryOptions: categoryOptions,
	}
}

func (p *dummy) PostTodo(r *http.Request) Todo {
	todo := r.FormValue("todo")
	category := r.FormValue("category")
  id := rand.Intn(100)
	done := false
	newTodo := Todo{
		ID:        id,
		Todo:      todo,
		Category:  category,
		Done:      done,
	}
	return newTodo
}

func (p *dummy) AddTodo(todo Todo) TodoModel {
	todos = append(todos, todo)
	return GetCurrentModel()
}

func (p *dummy) PatchTodo(r *http.Request) Todo {
	id, _ := strconv.Atoi(r.FormValue("id"))
	
	for i, t := range todos {
		if t.ID == id {
			todos[i].Todo = r.FormValue("todo")
			todos[i].Category = r.FormValue("category")
			return todos[i]
		}
	}
	return Todo{}
}

func (p *dummy) UpdateTodo(todo Todo) TodoModel {
	for i, t := range todos {
		if t.ID == todo.ID {
			todos[i] = todo
			break
		}
	}
	return GetCurrentModel()
}

func (p *dummy) GetCategoriesCount() CategoriesCountModel {
	countMap := make(map[string]int)

	for _, todo := range todos {
		countMap[todo.Category]++
	}

	var categoriesWithCount []CategoryWithCount

	for _, category := range categoryOptions {
		categoriesWithCount = append(categoriesWithCount, CategoryWithCount{
			Category: category,
			Count:    countMap[category],
		})
	}

	return CategoriesCountModel{
		CategoriesWithCount: categoriesWithCount,
	}
}