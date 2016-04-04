'use strict';

const electron = require('electron');

const app = electron.app;
const Menu = electron.Menu;
const Tray = electron.Tray;

const BrowserWindow = electron.BrowserWindow;

var ipcMain = require('electron').ipcMain;

let mainWindow;
let preferenceWindow;

function createPreference() {
  preferenceWindow = new BrowserWindow({
    frame: false,
    resizable: false,
    width: 450,
    height: 200});

  preferenceWindow.setMenu(null);

  preferenceWindow.loadURL('file://' + __dirname + '/preference.html');

  preferenceWindow.on('closed', function() {
    preferenceWindow = null;
  });
}

function createWindow () {
  mainWindow = new BrowserWindow({
    frame: false,
    resizable: false,
    icon: __dirname + '/resources/bananas-icon.png',
    width: 800,
    height: 600});

  mainWindow.loadURL('file://' + __dirname + '/index.html');

  mainWindow.webContents.openDevTools();

  mainWindow.on('closed', function() {
    mainWindow = null;
  });
}

var template = [{
  label: "Application",
  submenu: [
    { label: "About Application", selector: "orderFrontStandardAboutPanel:" },
    { type: "separator" },
    { label: "Quit", accelerator: "Command+Q", click: function() { app.quit(); }}
  ]}, {
    label: "Edit",
    submenu: [
      { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
      { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
      { type: "separator" },
      { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
      { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
      { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
      { label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
    ]}, {
      label: 'View',
      submenu: [
        {
          label: 'Reload',
          accelerator: 'CmdOrCtrl+R',
          click: function(item, focusedWindow) {
            if (focusedWindow)
              focusedWindow.reload();
          }
        },
        {
          label: 'Toggle Full Screen',
          accelerator: (function() {
            if (process.platform == 'darwin')
              return 'Ctrl+Command+F';
            else
              return 'F11';
          })(),
          click: function(item, focusedWindow) {
            if (focusedWindow)
              focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
          }
        },
        {
          label: 'Toggle Developer Tools',
          accelerator: (function() {
            if (process.platform == 'darwin')
              return 'Alt+Command+I';
            else
              return 'Ctrl+Shift+I';
          })(),
          click: function(item, focusedWindow) {
            if (focusedWindow)
              focusedWindow.toggleDevTools();
          }
        },
      ]
    }, {
      label: 'Window',
      role: 'window',
      submenu: [
        {
          label: 'Minimize',
          accelerator: 'CmdOrCtrl+M',
          role: 'minimize'
        }, {
          label: 'Close',
          accelerator: 'CmdOrCtrl+W',
          role: 'close'
        },]}, {
          label: 'Help',
          role: 'help',
          submenu: [
            {
              label: 'Learn More',
              click: function() { require('electron').shell.openExternal('http://electron.atom.io') }},
          ]}, ];

var appIcon = null;

//app.on('ready', createWindow);
app.on('ready', function() {

  createWindow();

  appIcon = new Tray(__dirname + '/resources/strawberry-icon.png');

  var contextMenu = Menu.buildFromTemplate([
    { label: 'Item1', type: 'radio' },
    { label: 'Item2', type: 'radio' },
    { label: 'Item3', type: 'radio', checked: true },
    { label: 'Item4', type: 'radio' }
  ]);

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));

  appIcon.setToolTip('This is my application.');
  appIcon.setContextMenu(contextMenu);
});

app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on('openPreference', function() {
  createPreference();
});

ipcMain.on('close-main-window', function() {
  app.quit();
});

