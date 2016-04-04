// References
// https://github.com/atom/electron-quick-start/blob/master/main.js
// https://github.com/bojzi/sound-machine-electron-guide/blob/master/main.js
// https://medium.com/developers-writing/building-a-desktop-application-with-electron-204203eeb658
// https://github.com/bojzi/sound-machine-electron-guide
// https://github.com/atom/electron/blob/master/docs/api/tray.md
// https://github.com/atom/electron/blob/master/docs/api/frameless-window.md
// https://github.com/atom/electron/blob/master/docs/api/menu.md
// https://pracucci.com/atom-electron-enable-copy-and-paste.html
// http://electron.atom.io/docs/v0.37.2/faq/electron-faq/#how-to-share-data-between-web-pages

'use strict';

const electron = require('electron');

const app = electron.app;
const Menu = electron.Menu;
const Tray = electron.Tray;

global.sharedObject = {
  targetPath : '/'
};

// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

var ipcMain = require('electron').ipcMain;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let preferenceWindow;

function createPreference() {
  preferenceWindow = new BrowserWindow({
    //frame: false,
    //resizable: false,
    width: 450,
    height: 200});

  preferenceWindow.setMenu(null);

  // and load the index.html of the app.
  preferenceWindow.loadURL('file://' + __dirname + '/preference.html');

  // Emitted when the window is closed.
  preferenceWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    preferenceWindow = null;
  });
}

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    //      frame: false,
    //      resizable: false,
    icon: __dirname + '/resources/bananas-icon.png',
    width: 800,
    height: 600});

  mainWindow.loadURL('file://' + __dirname + '/index.html');

  //mainWindow.webContents.openDevTools();

  mainWindow.on('closed', function() {
    mainWindow = null;
  });
}

// https://pracucci.com/atom-electron-enable-copy-and-paste.html
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
        },
        {
          label: 'Close',
          accelerator: 'CmdOrCtrl+W',
          role: 'close'
        },
      ]},  {
        label: 'Help',
        role: 'help',
        submenu: [
          {
            label: 'Learn More',
            click: function() { require('electron').shell.openExternal('http://electron.atom.io') }
          },
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

ipcMain.on('listDir', function(event, arg) {
  var fs = require('fs');

  console.log('list dir sharedObject.targetPath=' + global.sharedObject.targetPath);

  fs.readdir(arg, function(err, files) {

    // not applicable becuase event.sender == preferencewindow.webContents here
    //event.sender.send('listDirCallback', files)

    if (mainWindow) {
      mainWindow.webContents.send('listDirCallback', files);
    }
  })
});

ipcMain.on('close-main-window', function() {
  app.quit();
});

