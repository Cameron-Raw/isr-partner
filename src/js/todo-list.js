const electron = require('electron');
const path = require('path');
const BrowserWindow = electron.remote.BrowserWindow;
const ipc = electron.ipcRenderer;
const fs = require('fs');
var savedTodoList = require('./json/todo.json');

var taskInput = document.getElementById('task-input');
var noTaskWarning = document.getElementById('noTaskWarning');
var newTaskButton = document.getElementById('task-button');
var todoListUl = document.getElementById('todo-ul');
var todoArray = [];

console.log("savedTodoList is " + savedTodoList);

function refreshTodoList() {
  // Clear previous todoList
  todoListUl.innerHTML = "";
  // Load existing to do items
  for( var i = 0; i < savedTodoList.length; i++ ){
    var li = document.createElement("li");
    li.appendChild(document.createTextNode(savedTodoList[i].taskTitle));
    todoListUl.appendChild(li);
    todoArray.push(li.innerHTML);
    li.addEventListener("click", function(event) {
      // Should open full entry with option to delete
      var indexToOpen = todoArray.indexOf(this.innerHTML);

      // TODO: Open new window
      const modalPath = path.join('file://', __dirname, '../todoitem.html');
      let todoWindow = new BrowserWindow({ width: 400, height: 200 });
      todoWindow.on('close', function(){ win = null });
      todoWindow.loadURL(modalPath);
      console.log(modalPath);
      todoWindow.show();

      // TODO: Pass index of selection to ipc
      ipc.send('sendTodoIndex', indexToOpen);

    });
  }

  if(todoListUl.getElementsByTagName("li").length > 0){
    noTaskWarning.style.display = "none";
  } else {
    noTaskWarning.style.display = "block";
  }
}

 function openTodoItem(){
   const modalPath = path.join('file://', __dirname, '../newtask.html');
   let win = new BrowserWindow({ width: 400, height: 200 });
   win.on('close', function(){ win = null });
   win.loadURL(modalPath);
   console.log(modalPath);
   win.show();
 }

refreshTodoList();

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
  newTodoList.push(arg);
  var newTodoListStr = JSON.stringify(newTodoList);

  fs.writeFile('src/js/json/todo.json', newTodoListStr, function(err) {
    if (err) {
      console.log("An error ocurred updating JSON file " + err.message);
    }
  });
  refreshTodoList();
});
