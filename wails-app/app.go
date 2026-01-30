package main

import (
	"context"
	"fmt"
	"io"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"syscall"
	"time"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct holds the application context and state
type App struct {
	ctx       context.Context
	pythonCmd *exec.Cmd // Reference to managed Python process
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
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

// ============ PYTHON SIDECAR MANAGEMENT ============

// startPythonBackend launches the Python server as a managed subprocess
func (a *App) startPythonBackend() {
	// Get the path to the Python server executable
	exePath, err := os.Executable()
	if err != nil {
		runtime.LogError(a.ctx, "Failed to get executable path: "+err.Error())
		return
	}

	appDir := filepath.Dir(exePath)
	pythonPath := filepath.Join(appDir, "python", "server.exe")

	// Check if Python server exists
	if _, err := os.Stat(pythonPath); os.IsNotExist(err) {
		// Development mode: try relative path from source
		pythonPath = filepath.Join(".", "python", "server.exe")
		if _, err := os.Stat(pythonPath); os.IsNotExist(err) {
			runtime.LogWarning(a.ctx, "Python backend not found at: "+pythonPath)
			runtime.LogWarning(a.ctx, "Map generation will not work until backend is available")
			return
		}
	}

	runtime.LogInfo(a.ctx, "Starting Python backend from: "+pythonPath)

	// Create command with context - CRITICAL: ties process to parent lifecycle
	cmd := exec.CommandContext(a.ctx, pythonPath)

	// HIDE THE CONSOLE WINDOW (Windows-specific)
	cmd.SysProcAttr = &syscall.SysProcAttr{
		HideWindow:    true,
		CreationFlags: 0x08000000, // CREATE_NO_WINDOW
	}

	// Start the process
	if err := cmd.Start(); err != nil {
		runtime.LogError(a.ctx, "Failed to start Python backend: "+err.Error())
		return
	}

	a.pythonCmd = cmd
	runtime.LogInfo(a.ctx, fmt.Sprintf("Python backend started with PID: %d", cmd.Process.Pid))

	// Wait for backend to be ready (health check)
	a.waitForBackend()

	// Wait for process to exit (this will block until process ends)
	go func() {
		err := cmd.Wait()
		if err != nil {
			runtime.LogInfo(a.ctx, "Python backend exited: "+err.Error())
		} else {
			runtime.LogInfo(a.ctx, "Python backend exited cleanly")
		}
	}()
}

// waitForBackend polls the backend until it's ready
func (a *App) waitForBackend() {
	maxRetries := 30
	for i := 0; i < maxRetries; i++ {
		resp, err := http.Get("http://127.0.0.1:8000/")
		if err == nil && resp.StatusCode == 200 {
			resp.Body.Close()
			runtime.LogInfo(a.ctx, "Python backend is ready!")
			return
		}
		if resp != nil {
			resp.Body.Close()
		}
		time.Sleep(500 * time.Millisecond)
	}
	runtime.LogWarning(a.ctx, "Python backend did not respond within timeout")
}

// stopPythonBackend kills the Python process
func (a *App) stopPythonBackend() {
	if a.pythonCmd != nil && a.pythonCmd.Process != nil {
		runtime.LogInfo(a.ctx, "Stopping Python backend...")
		// Try graceful shutdown first
		a.pythonCmd.Process.Signal(os.Interrupt)

		// Give it 2 seconds to shutdown gracefully
		done := make(chan error, 1)
		go func() {
			done <- a.pythonCmd.Wait()
		}()

		select {
		case <-done:
			runtime.LogInfo(a.ctx, "Python backend stopped gracefully")
		case <-time.After(2 * time.Second):
			// Force kill if it didn't stop
			runtime.LogInfo(a.ctx, "Force killing Python backend...")
			a.pythonCmd.Process.Kill()
		}
	}
}

// GetBackendStatus returns the current status of the Python backend
func (a *App) GetBackendStatus() string {
	resp, err := http.Get("http://127.0.0.1:8000/")
	if err != nil {
		return "offline"
	}
	defer resp.Body.Close()
	if resp.StatusCode == 200 {
		return "online"
	}
	return "error"
}

// ============ WINDOW CONTROLS ============

// Minimize minimizes the application window
func (a *App) Minimize() {
	runtime.WindowMinimise(a.ctx)
}

// Maximize toggles the window between maximized and normal state
func (a *App) Maximize() {
	runtime.WindowToggleMaximise(a.ctx)
}

// Close closes the application window
func (a *App) Close() {
	runtime.Quit(a.ctx)
}

// ============ FILE DIALOGS ============

// ShowSaveDialog opens a native save file dialog
// Returns the selected path or empty string if cancelled
func (a *App) ShowSaveDialog(defaultFilename string) (string, error) {
	path, err := runtime.SaveFileDialog(a.ctx, runtime.SaveDialogOptions{
		DefaultFilename: defaultFilename,
		Title:           "Save Poster",
		Filters: []runtime.FileFilter{
			{DisplayName: "PNG Images", Pattern: "*.png"},
			{DisplayName: "All Files", Pattern: "*.*"},
		},
	})
	return path, err
}

// SaveFile downloads an image from URL and saves it to the specified path
func (a *App) SaveFile(imageURL string, savePath string) (bool, error) {
	// Download the image
	resp, err := http.Get(imageURL)
	if err != nil {
		return false, err
	}
	defer resp.Body.Close()

	// Create the output file
	out, err := os.Create(savePath)
	if err != nil {
		return false, err
	}
	defer out.Close()

	// Write the content
	_, err = io.Copy(out, resp.Body)
	if err != nil {
		return false, err
	}

	return true, nil
}

// OpenFolder opens the folder containing the specified file in the system file explorer
func (a *App) OpenFolder(filePath string) error {
	dir := filepath.Dir(filePath)
	cmd := exec.Command("explorer", dir)
	return cmd.Start()
}

// ============ UTILITY ============

// IsWails returns true to indicate we're running in Wails environment
func (a *App) IsWails() bool {
	return true
}
