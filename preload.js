const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  saveFile: (content) => ipcRenderer.send("save-file", content),
  onSaveBeforeExit: (callback) => ipcRenderer.on("save-before-exit", callback),
  exitApp: () => ipcRenderer.send("exit-app"),
});
