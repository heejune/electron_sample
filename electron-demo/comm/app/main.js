'use strict';

const electron = require('electron');
const app = electron.app;

// In the main process.
global.sharedObject = {
  targetPath : '/'
};

// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

var ipcMain = require('electron').ipcMain;

var fs = require('fs'); // To read the directory listing

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let preferenceWindow;

function createPreference() {
  preferenceWindow = new BrowserWindow({
    width: 450,
    height: 200});

  preferenceWindow.loadURL('file://' + __dirname + '/preference.html');

  preferenceWindow.on('closed', function() {
    preferenceWindow = null;
  });
}

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600});

  mainWindow.loadURL('file://' + __dirname + '/index.html');

  //mainWindow.webContents.openDevTools();

  mainWindow.on('closed', function() {
    mainWindow = null;
  });
}

//app.on('ready', createWindow);
app.on('ready', function() {
  createWindow();
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

ipcMain.on('setNameRequest', function(event, arg){
  console.log('main.js - Browser IPC handler: param = ' + arg);
  if (mainWindow) {
    mainWindow.webContents.send('setNameRequestCallback', arg);
  }
});

ipcMain.on('close-main-window', function() {
  app.quit();
});

