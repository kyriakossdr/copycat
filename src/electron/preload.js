const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld('cl', {
  getEntries: () => ipcRenderer.invoke('cl:get-entries'),
  onNewEntry: (callback) => {
    ipcRenderer.on('cl:new-entry', (_, entries) => callback(entries));
    return () => ipcRenderer.removeAllListeners('cl:new-entry');
  }
});
