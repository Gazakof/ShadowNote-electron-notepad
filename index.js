const { app, BrowserWindow, dialog, ipcMain } = require("electron");
const fs = require("fs");

let mainWindow;

app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: __dirname + "./preload.js",
      nodeIntegration: false,
      enableRemoteModule: false,
      contextIsolation: true,
    },
  });

  mainWindow.loadFile("index.html");

  mainWindow.on("close", (e) => {
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
      mainWindow.webContents.send("save-before-quit");
    } else if (choice === 1) {
      app.exit();
    }
  });
});

ipcMain.on("save-file", async (e, content) => {
  const { filePath } = await dialog.showSaveDialog({
    title: "Save File",
    defaultPath: "note.txt",
    filters: [{ name: "Text Files", extensions: ["txt"] }],
  });
  if (filePath) {
    fs.watchFile(filePath, content, (err) => {
      if (!err) {
        e.reply("file-saved", filePath);
      }
    });
  }
});

ipcMain.on("exit-app", () => {
  app.exit();
});
