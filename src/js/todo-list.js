const electron = require('electron');
const path = require('path');
const BrowserWindow = electron.remote.BrowserWindow;
const ipc = electron.ipcRenderer;
const fs = require('fs');
var savedTodoList = require('./json/todo.json');

var taskInput = document.getElementById('task-input');
var noTaskWarning = document.getElementById('noTaskWarning');
var newTaskButton = document.getElementById('task-button');

console.log("savedTodoList is " + savedTodoList);

newTaskButton.addEventListener("click",function(event){
  const modalPath = path.join('file://', __dirname, '../newtask.html');
  let win = new BrowserWindow({ width: 400, height: 200 });
  win.on('close', function(){ win = null });
  win.loadURL(modalPath);
  console.log(modalPath);
  win.show();
});

ipc.on('addNewTask', function(event, arg){

  var newTodoList = savedTodoList;
  console.log(arg);
  newTodoList.push(arg);
  console.log(newTodoList);
  var newTodoListStr = JSON.stringify(newTodoList);

  fs.writeFile('src/js/json/todo.json', newTodoListStr, function(err) {
    if (err) {
      console.log("An error ocurred updating JSON file " + err.message);
    }
  });

});
