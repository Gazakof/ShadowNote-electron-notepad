const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInIsolatedWorld("electron", {
  saveFile: (content) => ipcRenderer.send("save-file", content),
  onFileSaved: (callback) =>
    ipcRenderer.on("file-saved", (e, path) => callback(path)),
  onSaveBeforeExit: (callback) => ipcRenderer.on("save-before-exit", callback),
  exitApp: () => ipcRenderer.send("exit-app"),
});
