const { app, clipboard, nativeImage, Tray, BrowserWindow, ipcMain } = require('electron');
const clipboardListener = require('clipboard-event');
const path = require('path');

let tray;
let win;
const entries = [];

const LIMIT = 10;
const DEV = !app.isPackaged;

const createWindow = () => {
  const {x: posX, y: posY, width: trayWidth, height: trayHeight} = tray.getBounds();

  const winHeight = 600;
  const winWidth = 450;

  const x = posX - (winWidth - ((winWidth / trayWidth) / 2 * trayWidth));
  const y = posY - (winHeight + trayHeight);

  win = new BrowserWindow({
    height: winHeight,
    width: winWidth,
    show: false,
    resizable: false,
    hasShadow: true,
    frame: false,
    x,
    y,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.webContents.openDevTools()

  if (DEV) {
    win.loadURL('http://localhost:5173/');
  } else {
    win.loadFile('dist/index.html');
  }
};

const createTray = () => {
  const icon = nativeImage.createFromPath('icons/footprint.png');

  tray = new Tray(icon);

  tray.setToolTip('Copycat');
};

const addEntry = () => {
  const entry = clipboard.readText();
  if (entries.length === LIMIT) return;

  entries.push(entry);

  win.webContents.send('cl:new-entry', entries);
}

app.whenReady().then(() => {
  clipboardListener.startListening();
  ipcMain.handle('cl:get-entries', () => entries);

  createTray();
  createWindow();

  tray.on("click", () => {
    if (win.isVisible()) {
      win.hide();
    } else {
      win.show();
    }
  });

  clipboardListener.on("change", () => {
    addEntry();
  })
});


app.on("quit", () => clipboardListener.stopListening());
