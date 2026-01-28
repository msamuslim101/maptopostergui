const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');

let mainWindow;
let backendProcess = null;
const isDev = !app.isPackaged;

// Backend configuration
const BACKEND_PORT = 8000;
const BACKEND_URL = `http://127.0.0.1:${BACKEND_PORT}`;

/**
 * Start the Python backend server
 */
function startBackend() {
    const backendPath = isDev
        ? path.join(__dirname, '..', 'backend-dist', 'server.exe')
        : path.join(process.resourcesPath, 'backend', 'server.exe');

    console.log('Starting backend from:', backendPath);

    if (!fs.existsSync(backendPath)) {
        console.error('Backend executable not found:', backendPath);
        return;
    }

    backendProcess = spawn(backendPath, [], {
        cwd: path.dirname(backendPath),
        stdio: 'pipe'
    });

    backendProcess.stdout.on('data', (data) => {
        console.log(`Backend: ${data}`);
    });

    backendProcess.stderr.on('data', (data) => {
        console.error(`Backend Error: ${data}`);
    });

    backendProcess.on('close', (code) => {
        console.log(`Backend exited with code ${code}`);
        backendProcess = null;
    });
}

/**
 * Stop the backend server
 */
function stopBackend() {
    if (backendProcess) {
        backendProcess.kill();
        backendProcess = null;
    }
}

/**
 * Create the main application window
 */
function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1400,
        height: 900,
        minWidth: 1200,
        minHeight: 700,
        frame: false, // Custom title bar
        backgroundColor: '#1a1a1a',
        nodeIntegration: false,
        contextIsolation: true,
        webSecurity: false, // Allow local connections
        preload: path.join(__dirname, 'preload.js')
    },
        icon: path.join(__dirname, 'icon.ico')
    });

// Load the React app
if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
} else {
    mainWindow.loadFile(path.join(__dirname, 'renderer', 'index.html'));
}

mainWindow.on('closed', () => {
    mainWindow = null;
});
}

/**
 * Setup logger
 */
const logFile = path.join(app.getPath('userData'), 'backend.log');
function log(msg) {
    fs.appendFileSync(logFile, `[${new Date().toISOString()}] ${msg}\n`);
}

/**
 * Start the Python backend server
 */
function startBackend() {
    const backendPath = isDev
        ? path.join(__dirname, '..', 'backend-dist', 'server.exe')
        : path.join(process.resourcesPath, 'backend', 'server.exe');

    log(`Starting backend from: ${backendPath}`);
    console.log('Starting backend from:', backendPath);

    if (!fs.existsSync(backendPath)) {
        log(`ERROR: Backend executable not found at ${backendPath}`);
        console.error('Backend executable not found:', backendPath);
        return;
    }

    backendProcess = spawn(backendPath, [], {
        cwd: path.dirname(backendPath),
        stdio: 'pipe'
    });

    backendProcess.stdout.on('data', (data) => {
        const msg = data.toString();
        console.log(`Backend: ${msg}`);
        log(`STDOUT: ${msg}`);
    });

    backendProcess.stderr.on('data', (data) => {
        const msg = data.toString();
        console.error(`Backend Error: ${msg}`);
        log(`STDERR: ${msg}`);
    });

    backendProcess.on('close', (code) => {
        log(`Backend exited with code ${code}`);
        console.log(`Backend exited with code ${code}`);
        backendProcess = null;
    });
}

// Wait for backend to start
setTimeout(createWindow, 2000);

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
});

app.on('window-all-closed', () => {
    stopBackend();
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('before-quit', () => {
    stopBackend();
});

// ================== IPC HANDLERS ==================

// Window controls
ipcMain.on('window-minimize', () => mainWindow?.minimize());
ipcMain.on('window-maximize', () => {
    if (mainWindow?.isMaximized()) {
        mainWindow.unmaximize();
    } else {
        mainWindow?.maximize();
    }
});
ipcMain.on('window-close', () => mainWindow?.close());

// Native save dialog
ipcMain.handle('show-save-dialog', async (event, defaultName) => {
    const result = await dialog.showSaveDialog(mainWindow, {
        title: 'Save Map Poster',
        defaultPath: path.join(app.getPath('pictures'), defaultName || 'map_poster.png'),
        filters: [
            { name: 'PNG Image', extensions: ['png'] },
            { name: 'All Files', extensions: ['*'] }
        ]
    });

    return result.canceled ? null : result.filePath;
});

// Save file to chosen location
ipcMain.handle('save-file', async (event, { sourceUrl, destPath }) => {
    try {
        const response = await fetch(sourceUrl);
        const buffer = await response.arrayBuffer();
        fs.writeFileSync(destPath, Buffer.from(buffer));
        return { success: true, path: destPath };
    } catch (error) {
        return { success: false, error: error.message };
    }
});

// Open folder in explorer
ipcMain.handle('open-folder', async (event, filePath) => {
    if (fs.existsSync(filePath)) {
        shell.showItemInFolder(filePath);
        return true;
    }
    return false;
});

// Get app info
ipcMain.handle('get-app-info', () => ({
    version: app.getVersion(),
    isDev: isDev,
    platform: process.platform
}));
