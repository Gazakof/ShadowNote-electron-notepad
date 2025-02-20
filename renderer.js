const { dialog } = require("electron").remote;
const fs = require("fs");

const { ipcRenderer } = require("electron");

const toggleThemeBtn = document.getElementById("toggleTheme");
const body = document.body;

let filePath = null;

document.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.key === "s") {
    e.preventDefault();
    saveFile();
  }
});

function saveFile() {
  const content = document.getElementById("editor").innerText;
  if (!filePath) {
    dialog
      .showSaveDialog({
        title: "Save File",
        defaultPath: "note.txt",
        filters: [{ name: "Text Files", extensions: ["txt"] }],
      })
      .then((file) => {
        if (!file.canceled) {
          filePath = file.filePath.toString();
          writeFile(filePath, content);
        }
      });
  } else {
    writeFile(filePath, content);
  }
}

function writeFile(path, content) {
  fs.writeFile(path, content, (err) => {
    if (err) {
      console.log("Error saving file: ", err);
    } else {
      alert("File saved!\nPath: " + path);
      console.log("File saved: ", path);
    }
  });
}

ipcRenderer.on("save-before-quit", () => {
  saveFile();
  setTimeout(() => {
    ipcRenderer.send("file-saved");
  }, 600);
});

toggleThemeBtn.addEventListener("click", () => {
  body.classList.toggle("dark-mode");
});
