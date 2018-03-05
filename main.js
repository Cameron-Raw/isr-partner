const electron = require('electron');
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const url = require('url');
const ipc = require('electron').ipcMain;


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600})

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'src/index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// Here we specify the current focused li item in the todo list
// which is selected by clicking on the li itself

var liIndex;
var currentList;
let todoWindow;

ipc.on('openItem', function(event, arg, data) {

  // Receive index of li
  liIndex = arg;

  // Receive current todo.JSON
  currentList = data;

  // Open new window
  var modalPath = path.join('file://', __dirname, 'src/todoitem.html');
  todoWindow = new BrowserWindow({ width: 600, height: 400 });
  todoWindow.on('close', function(){ win = null });
  todoWindow.loadURL(modalPath);
  console.log(modalPath);
  todoWindow.show();

  // TODO: Send index to new window

  // todoWindow.webContents.send('openItem', liIndex);
});

// Send index to todoWindow upon receiving requestLiIndex,
// confirming the window is rendered

ipc.on('requestLiIndex', function(event, arg) {
  if (arg === true) {
    todoWindow.webContents.send('responseLiIndex', liIndex, currentList);
  }
});

// Receives addNewTask from new-task.js
ipc.on('addNewTask', function(event, arg) {
  mainWindow.webContents.send('addNewTask', arg);
});
