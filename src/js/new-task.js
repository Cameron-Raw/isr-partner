const electron = require('electron');
const path = require('path');
const BrowserWindow = electron.remote.BrowserWindow;
const remote = electron.remote;
const ipc = electron.ipcRenderer;



var newTaskTitle = document.getElementById('newTaskTitle');
var newTaskNotes = document.getElementById('newTaskNotes');

var addTask = document.getElementById('addTask');
var closeTask = document.getElementById('taskClose');

addTask.addEventListener("click", function(event) {
  var newTask = {
    taskTitle: newTaskTitle.value,
    taskBody: newTaskNotes.value
  };
  console.log("DEBUG: newTask title is " + newTask.taskTitle);
  console.log("DEBUG: newTask body is " + newTask.taskBody);

  // Sends new task to main.js
  ipc.send('addNewTask', newTask);

  var window = remote.getCurrentWindow();
  window.close();

});

closeTask.addEventListener("click", function(event) {
  var window = remote.getCurrentWindow();
  window.close();
});
