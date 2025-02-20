const { app, BrowserWindow, dialog } = require("electron");

let mainWindow;

app.on("ready", () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  mainWindow.loadFile("index.html");

  mainWindow.on("close", (e) => {
    e.preventDefault();

    const choice = dialog.showMessageBoxSync(mainWindow, {
      type: "question",
      buttons: ["Enregistre", "Ne pas enregistrer", "Annuler"],
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
