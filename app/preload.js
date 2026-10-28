// The page decides when the window should take clicks; the menu bar icon sends it commands
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('darumaApp', {
  clickThrough: on => ipcRenderer.send('click-through', on),
  plate: rect => ipcRenderer.send('plate', rect),   // where the frosted patch behind the gate goes
  onCommand: fn => ipcRenderer.on('command', (e, name) => fn(name)),
  inset: ipcRenderer.sendSync('inset'),   // the room the Dock takes at the screen's edges, at start
  onInset: fn => ipcRenderer.on('inset', (e, v) => fn(v)),
});
