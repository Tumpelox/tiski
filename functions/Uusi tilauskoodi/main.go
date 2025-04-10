package handler

import (
	"os"

	"github.com/appwrite/sdk-for-go/appwrite"
	"github.com/appwrite/sdk-for-go/id"
	"github.com/open-runtimes/types-for-go/v4/openruntimes"
)

type Response struct {
	Result string      `json:"result"`
	Error  interface{} `json:"error"`
}

// This Appwrite function will be executed every time your function is triggered
func Main(Context openruntimes.Context) openruntimes.Response {
	// You can use the Appwrite SDK to interact with other services
	// For this example, we're using the Users service
	client := appwrite.NewClient(
		appwrite.WithEndpoint(os.Getenv("APPWRITE_FUNCTION_API_ENDPOINT")),
		appwrite.WithProject(os.Getenv("APPWRITE_FUNCTION_PROJECT_ID")),
		appwrite.WithKey(Context.Req.Headers["x-appwrite-key"]),
	)

	databases := appwrite.NewDatabases(client)

	result, err := databases.CreateDocument("tarratiski", "tilauskoodit", id.Custom("asdasd"), map[string]interface{}{
		"tilauskoodi": "123456",
	})

	if err != nil {
		Context.Error("Could not list users: " + err.Error())
	} else {
		// Log messages and errors to the Appwrite Console
		// These logs won't be seen by your end users
		Context.Log("Total users: ")
	}

	// The req object contains the request data
	if Context.Req.Path == "/ping" {
		// Use res object to respond with text(), json(), or binary()
		// Don't forget to return a response!
		return Context.Res.Text("Pong")
	}

	return Context.Res.Json(Response{
		Motto:       "Build like a team of hundreds_",
		Learn:       "https://appwrite.io/docs",
		Connect:     "https://appwrite.io/discord",
		GetInspired: "https://builtwith.appwrite.io",
	})
}
