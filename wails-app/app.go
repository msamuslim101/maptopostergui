package main

import (
	"context"
	"os"
	"os/exec"
)

// App struct holds the application context and state
type App struct {
	ctx        context.Context
	pythonCmd  *exec.Cmd // Reference to managed Python process
	legacyMode bool
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{
		legacyMode: os.Getenv("MTP_LEGACY_WIN7") == "1",
	}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx

	// Start the Python backend server
	go a.startPythonBackend()
}

// shutdown is called when the app is closing
func (a *App) shutdown(ctx context.Context) {
	// Kill the Python backend process
	a.stopPythonBackend()
}

// ============ UTILITY ============

// IsLegacyMode returns true when Windows 7 compatibility mode is enabled
func (a *App) IsLegacyMode() bool {
	return a.legacyMode
}

// IsWails returns true to indicate we're running in Wails environment
func (a *App) IsWails() bool {
	return true
}
