package todo

type Todo struct {
	ID        int
	Todo      string
	Category  string
	Done      bool
}

type TodoModel struct {
	Todos []Todo
	CategoryOptions []string
}

type CategoriesCountModel struct {
	CategoriesWithCount []CategoryWithCount
}

type CategoryWithCount struct {
	Category string
	Count int
}