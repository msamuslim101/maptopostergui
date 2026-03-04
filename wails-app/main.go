package main

import (
	"embed"
	"os"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	// Create an instance of the app structure
	app := NewApp()
	legacyMode := os.Getenv("MTP_LEGACY_WIN7") == "1"

	windowOptions := &options.App{
		Title:     "MapToPoster",
		Width:     1400,
		Height:    900,
		MinWidth:  1024,
		MinHeight: 768,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		BackgroundColour: &options.RGBA{R: 10, G: 10, B: 10, A: 1}, // Dark background
		OnStartup:        app.startup,
		OnShutdown:       app.shutdown, // CRITICAL: Kills Python backend on exit
		Frameless:        true,         // Enable custom titlebar by default
		Bind: []interface{}{
			app,
		},
	}

	if legacyMode {
		windowOptions.Width = 1200
		windowOptions.Height = 760
		windowOptions.MinWidth = 960
		windowOptions.MinHeight = 640
		windowOptions.Frameless = false // Native titlebar is more reliable on Windows 7
	}

	// Create application with options
	err := wails.Run(windowOptions)

	if err != nil {
		println("Error:", err.Error())
	}
}
