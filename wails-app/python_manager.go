package main

import (
	"fmt"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"syscall"
	"time"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

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

	// Create command without context so we can manually kill the process tree via taskkill
	// If we use CommandContext, Wails might kill the parent bootloader instantly before taskkill runs.
	cmd := exec.Command(pythonPath)

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
		pid := a.pythonCmd.Process.Pid
		runtime.LogInfo(a.ctx, fmt.Sprintf("Stopping Python backend (PID: %d)...", pid))

		// On Windows, use taskkill to forcefully terminate the process tree
		killCmd := exec.Command("taskkill", "/F", "/T", "/PID", fmt.Sprintf("%d", pid))
		killCmd.SysProcAttr = &syscall.SysProcAttr{
			HideWindow:    true,
			CreationFlags: 0x08000000,
		}

		out, err := killCmd.CombinedOutput()
		if err != nil {
			runtime.LogWarning(a.ctx, fmt.Sprintf("taskkill failed: %s, output: %s", err.Error(), string(out)))
			// Fallback to direct kill
			a.pythonCmd.Process.Kill()
		} else {
			runtime.LogInfo(a.ctx, "Python backend terminated via taskkill: "+string(out))
		}

		// Wait for process to fully exit
		a.pythonCmd.Wait()
		runtime.LogInfo(a.ctx, "Python backend stopped")
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
