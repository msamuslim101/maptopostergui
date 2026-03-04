package main

import (
	"io"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

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
	runtime.LogInfo(a.ctx, "Attempting to save image from URL: "+imageURL+" to "+savePath)

	// Download the image
	resp, err := http.Get(imageURL)
	if err != nil {
		runtime.LogError(a.ctx, "SaveFile Download Failed: "+err.Error())
		return false, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		runtime.LogError(a.ctx, "SaveFile Download returned non-200 status")
		return false, nil
	}

	// Create the output file
	out, err := os.Create(savePath)
	if err != nil {
		runtime.LogError(a.ctx, "SaveFile OS Create Failed: "+err.Error())
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
