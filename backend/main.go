package main

import (
	"log"

	"github.com/gin-gonic/gin"
	"github.com/todo/templates/shared"
	"github.com/todo/templates/todo"
)

func main() {
	router := gin.Default()

	registerApps(router)

	const addr = ":8080"
	log.Printf("listening on %s", addr)
	if err := router.Run(addr); err != nil {
		log.Fatal(err)
	}
}

func registerApps(engine *gin.Engine) {
	// register(engine, browser.NewHandler(), browser.NewProvider(browser.ResolveDistRoot()))
	// register(engine, padelbaza.NewHandler(), padelbaza.NewDummyProvider())
	// register(engine, helloworld.NewHandler(), helloworld.NewDummyProvider())
	register(engine, todo.NewHandler(), todo.NewDummyProvider())
}

func register[P any](engine *gin.Engine, handler shared.Handler[P], provider P) {
	// setup provider
	handler.SetProvider(provider)

	// setup routes
	routes := handler.GetRoutes()
	groupName := handler.GetName()

	group := engine.Group("/" + groupName)

	if staticHandler, ok := handler.(shared.StaticHandler); ok {
		for _, route := range staticHandler.GetStaticRoutes() {
			group.StaticFS(route.Path, gin.Dir(route.Root, route.ListDirectory))
		}
	}

	// register routes within current Gin engine and wrap it using gin.WrapF
	for _, route := range routes {
		group.Handle(route.Method, route.Path, func(ctx *gin.Context) {
			response := route.Handle(ctx.Request)
			ctx.Status(response.StatusCode())
			ctx.Header("Content-Type", "text/html; charset=utf-8")
			if err := response.ComponentOrEmpty().Render(ctx.Request.Context(), ctx.Writer); err != nil {
				_ = ctx.Error(err)
			}
		})
	}
}
