const { app, BrowserWindow, dialog, ipcMain } = require("electron");
const fs = require("fs");
const path = require("path");

let mainWindow;
let isFileModified = false;

app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      enableRemoteModule: false,
    },
    icon: path.join(__dirname, "assets", "icon", "logo.ico"),
  });

  mainWindow.loadFile("index.html");

  ipcMain.on("set-file-modified", (e, isModified) => {
    isFileModified = isModified;
  });

  mainWindow.on("close", (e) => {
    if (isFileModified) {
      e.preventDefault();

      const choice = dialog.showMessageBoxSync(mainWindow, {
        type: "question",
        buttons: ["Enregistre", "Ne pas enregistrer", "Annuler"],
        defaultId: 0,
        cancelId: 2,
        title: "Quitter Shadow Note",
        message: "Voulez-vous enregistrer les modifications avant de quitter?",
      });

      if (choice === 0) {
        mainWindow.webContents.send("save-before-exit");
      } else if (choice === 1) {
        app.exit();
      }
    }
  });
});

ipcMain.on("save-file", async (e, content) => {
  const result = await dialog.showSaveDialog({
    title: "Save File",
    defaultPath: "note.txt",
    filters: [{ name: "Text Files", extensions: ["txt"] }],
  });

  if (result.canceled) return;

  const filePath = result.filePath;

  if (filePath) {
    fs.writeFile(filePath, content, (err) => {
      if (!err) {
        e.reply("file-saved", filePath);
      }
    });
  }
});

ipcMain.on("exit-app", () => {
  app.exit();
});
