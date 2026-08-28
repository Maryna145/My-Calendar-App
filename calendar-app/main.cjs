const { app, BrowserWindow } = require('electron');
const path = require('path');
const { fork } = require('child_process');
let backendProcess;
function createWindow () {
    const win = new BrowserWindow({
        width: 450,
        height: 750,
        frame: false,
        transparent: true,
        skipTaskbar: false,
        webPreferences: {
            nodeIntegration: true,
        }
    });


    win.loadFile(path.join(__dirname, 'dist', 'index.html'));
}

app.whenReady().then(() => {
    app.setAppUserModelId("com.maryna.calendar");
    let backendDir;

    if (app.isPackaged) {
        backendDir = path.join(process.resourcesPath, 'calendar-backend');
    } else {
        backendDir = path.join(__dirname, '../calendar-backend');
    }

    const serverPath = path.join(backendDir, 'server.js');

    backendProcess = fork(serverPath, {
        cwd: backendDir
    });

    createWindow();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});