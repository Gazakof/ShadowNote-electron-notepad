const { dialogue } = require("electron").remote;
const fs = require("fs");

const toggleThemeBtn = document.getElementById("toggleTheme");
const body = document.body;

let filePath = null;

document.addEventListener("keydown", (event) => {
  if (event.ctrlKey && event.key === "s") {
    event.preventDefault();
    saveFile();
  }
});

const saveFile = () => {
  const content = document.getElementById("editor").innerText;
  if (!filePath) {
    dialogue
      .showSaveDialog({
        title: "Save File",
        defaultPath: "note.txt",
        filters: [{ name: "ShadowNote Files", extensions: ["txt"] }],
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
};

const writeFile = (path, content) => {
  fs.writeFile(path, content, (err) => {
    if (err) {
      console.log("Error saving file: ", err);
    } else {
      console.log("File saved: ", path);
    }
  });
};

toggleThemeBtn.addEventListener("click", () => {
  body.classList.toggle("dark-mode");
});
