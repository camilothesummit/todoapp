package shared

import (
	"net/http"

	"github.com/a-h/templ"
)

type Handler[P any] interface {
	GetName() string
	SetProvider(provider P)
	GetRoutes() []Route
}

type StaticHandler interface {
	GetStaticRoutes() []StaticRoute
}

type StaticRoute struct {
	Path          string
	Root          string
	ListDirectory bool
}

// CF = Component Function
type CF[T any] func(data T) templ.Component

// MF = Model Function
type MF[I any, T any] func(input I) T

// RF = Request Function
type RF[I any] func(*http.Request) I

// Build is a helper function to create a route handler from a component function, a model function, and a request function.
// It takes care of extracting the necessary data from the request, building the model, and rendering the component.
	func Build[I any, T any](component CF[T], modelFunc MF[I, T], requestFunc RF[I]) func(*http.Request) templ.Component {
		return func(r *http.Request) templ.Component {
			return component(modelFunc(requestFunc(r)))
		}
	}

	// BuildWithoutRequest is a helper function to create a route handler from a component function and a model function that does not require any input.
	func BuildWithoutRequest[T any](component CF[T], modelFunc func() T) func(*http.Request) templ.Component {
		return func(_ *http.Request) templ.Component {
			return component(modelFunc())
		}
	}

type Route struct {
	Method       string
	Path         string
	Func         func(*http.Request) templ.Component
	ResponseFunc func(*http.Request) Response
}

func (route Route) Handle(request *http.Request) Response {
	if route.ResponseFunc != nil {
		return route.ResponseFunc(request)
	}
	if route.Func != nil {
		return Response{Component: route.Func(request)}
	}

	return Response{Status: http.StatusNotFound}
}

type Response struct {
	Status    int
	Component templ.Component
}

func (response Response) StatusCode() int {
	if response.Status == 0 {
		return http.StatusOK
	}

	return response.Status
}

func (response Response) ComponentOrEmpty() templ.Component {
	if response.Component == nil {
		return templ.NopComponent
	}

	return response.Component
}
