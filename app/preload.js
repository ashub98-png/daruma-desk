// The page decides when the window should take clicks; the menu bar icon sends it commands
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('darumaApp', {
  clickThrough: on => ipcRenderer.send('click-through', on),
  onCommand: fn => ipcRenderer.on('command', (e, name) => fn(name)),
});
