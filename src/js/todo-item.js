const electron = require('electron');
const path = require('path');
const BrowserWindow = electron.remote.BrowserWindow;
const remote = electron.remote;
const fs = require('fs');
const ipc = electron.ipcRenderer;



var itemHeader = document.getElementById("itemHeader");
var itemBody = document.getElementById("itemBody");

var indexOfLi = "";

// Tell main process that window has rendered
ipc.send('requestLiIndex', true);

// Request index of todo item to load
ipc.on('responseLiIndex', function(event, arg, data) {
  indexOfLi = arg;
  var todoList = data;
  var itemObj = todoList[arg];
  console.log("index of todo item is " + arg);

  // Display contents in window
  itemHeader.innerHTML = itemObj.taskTitle;

  if(itemObj.taskBody == ""){
    itemBody.innerHTML = "(No body added to to-do item)"
  } else {
    itemBody.innerHTML = itemObj.taskBody;
  }
});
