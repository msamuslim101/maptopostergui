const { contextBridge, ipcRenderer } = require('electron');

/**
 * Expose Electron APIs to the renderer process
 * These are accessible via window.electronAPI
 */
contextBridge.exposeInMainWorld('electronAPI', {
    // Window controls
    minimize: () => ipcRenderer.send('window-minimize'),
    maximize: () => ipcRenderer.send('window-maximize'),
    close: () => ipcRenderer.send('window-close'),

    // Native save dialog - returns chosen path or null
    showSaveDialog: (defaultName) => ipcRenderer.invoke('show-save-dialog', defaultName),

    // Save file to chosen location
    saveFile: (sourceUrl, destPath) => ipcRenderer.invoke('save-file', { sourceUrl, destPath }),

    // Open folder in file explorer
    openFolder: (filePath) => ipcRenderer.invoke('open-folder', filePath),

    // Get app information
    getAppInfo: () => ipcRenderer.invoke('get-app-info'),

    // Check if running in Electron
    isElectron: true
});
