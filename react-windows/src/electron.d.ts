/**
 * Electron API TypeScript definitions
 * Declare the electronAPI on the window object
 */

interface ElectronAPI {
    // Window controls
    minimize: () => void;
    maximize: () => void;
    close: () => void;

    // Native save dialog - returns chosen path or null
    showSaveDialog: (defaultName: string) => Promise<string | null>;

    // Save file to chosen location
    saveFile: (sourceUrl: string, destPath: string) => Promise<{ success: boolean; path?: string; error?: string }>;

    // Open folder in file explorer
    openFolder: (filePath: string) => Promise<boolean>;

    // Get app information
    getAppInfo: () => Promise<{ version: string; isDev: boolean; platform: string }>;

    // Check if running in Electron
    isElectron: boolean;
}

declare global {
    interface Window {
        electronAPI?: ElectronAPI;
    }
}

export { };
