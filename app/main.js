// Daruma Desk for macOS. The page runs in one transparent window that covers the whole screen, so the dolls
// rest on its bottom edge, and floats over other windows, full-screen ones too. Clicks pass through to whatever is underneath, except
// over the dolls, the gate and whatever is open; the page tells us which (see preload.js).
const { app, BrowserWindow, Tray, Menu, nativeImage, screen, ipcMain, protocol } = require('electron');
const path = require('node:path');
const fs = require('node:fs');
const os = require('node:os');

const ROOT = path.join(__dirname, '..');
const CDN = 'https://cdn.jsdelivr.net/npm/three@0.170.0/';
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.json': 'application/json' };
const SNAPSHOT = process.env.DARUMA_SNAPSHOT;   // a test run: render, save a capture there and quit

// Its own scheme gives the page a stable origin, so pledges saved in local storage stay put
protocol.registerSchemesAsPrivileged([{ scheme: 'app', privileges: { standard: true, secure: true, supportFetchAPI: true } }]);
if (SNAPSHOT) app.setPath('userData', fs.mkdtempSync(path.join(os.tmpdir(), 'daruma-')));

let win = null, tray = null;

function serve() {
  protocol.handle('app', req => {
    const rel = decodeURIComponent(new URL(req.url).pathname);
    const file = path.normalize(path.join(ROOT, rel));
    if (!file.startsWith(ROOT + path.sep) || !fs.existsSync(file)) return new Response('Not found', { status: 404 });
    let body = fs.readFileSync(file);
    // three.js comes from the copy bundled with the app rather than the CDN the browser prototype uses
    if (rel === '/index.html') body = body.toString('utf8').replaceAll(CDN, 'app://daruma/vendor/three@0.170.0/');
    return new Response(body, { headers: { 'content-type': TYPES[path.extname(file)] || 'application/octet-stream' } });
  });
}

const area = () => screen.getPrimaryDisplay().bounds;
function createWindow() {
  win = new BrowserWindow({
    ...area(), frame: false, transparent: true, backgroundColor: '#00000000', hasShadow: false, roundedCorners: false,
    resizable: false, movable: false, minimizable: false, maximizable: false, fullscreenable: false,
    skipTaskbar: true, alwaysOnTop: true, acceptFirstMouse: true, show: false,
    webPreferences: { preload: path.join(__dirname, 'preload.js'), contextIsolation: true, nodeIntegration: false, sandbox: true },
  });
  win.setAlwaysOnTop(true, 'status');   // above the Dock, which would otherwise cover the dolls on the bottom edge
  win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  win.setIgnoreMouseEvents(true, { forward: true });
  win.loadURL('app://daruma/index.html');
  win.once('ready-to-show', () => win.showInactive());
  const refit = () => win && !win.isDestroyed() && win.setBounds(area());
  for (const ev of ['display-metrics-changed', 'display-added', 'display-removed']) screen.on(ev, refit);
  win.on('closed', () => { win = null; });
  if (SNAPSHOT) snapshot();
}

// For the tests: put a few dolls on the desk, capture the window and quit
function snapshot() {
  win.webContents.on('console-message', e => console.log(`[page ${e.level}] ${e.message}`));
  win.webContents.once('did-finish-load', async () => {
    await new Promise(r => setTimeout(r, 1500));
    await win.webContents.executeJavaScript(`[['Send the portfolio', 'red'], ['Renew passport', 'blue'], ['Call mom', 'pink']]
      .forEach(([t, c], i) => setTimeout(() => window.__daruma.addTask(t, c), i * 150))`);
    await new Promise(r => setTimeout(r, 2500));
    console.log('page state:', await win.webContents.executeJavaScript(`new Promise(r => { let n = 0; const t0 = performance.now();
      (function f() { n++; performance.now() - t0 < 1000 ? requestAnimationFrame(f) : r(JSON.stringify({ fps: n,
        visibility: document.visibilityState, focused: document.hasFocus(), active: document.activeElement && document.activeElement.id })); })(); })`));
    fs.writeFileSync(SNAPSHOT, (await win.webContents.capturePage()).toPNG());
    app.quit();
  });
}

function command(name) {
  if (!win) return;
  app.focus({ steal: true });
  win.focus();
  win.webContents.send('command', name);
}
function makeTray() {
  const icon = nativeImage.createFromPath(path.join(__dirname, 'trayTemplate.png'));
  icon.setTemplateImage(true);
  tray = new Tray(icon);
  tray.setToolTip('Daruma Desk');
  tray.setContextMenu(Menu.buildFromTemplate([
    { label: 'New Doll…', click: () => command('new') },
    { label: 'View Hall of Dolls', click: () => command('hall') },
    { type: 'separator' },
    { label: 'Open at Login', type: 'checkbox', checked: app.getLoginItemSettings().openAtLogin,
      click: item => app.setLoginItemSettings({ openAtLogin: item.checked }) },
    { type: 'separator' },
    { label: 'Quit Daruma Desk', role: 'quit' },
  ]));
}

ipcMain.on('click-through', (e, on) => { if (win) win.setIgnoreMouseEvents(!!on, { forward: true }); });

if (!app.requestSingleInstanceLock()) app.quit();
else {
  app.on('second-instance', () => command('new'));
  app.whenReady().then(() => {
    app.dock?.hide();   // it lives in the menu bar, not the Dock
    // no menu bar shows, but the Edit menu is what makes copy and paste work in the pledge field
    Menu.setApplicationMenu(Menu.buildFromTemplate([{ role: 'appMenu' }, { role: 'editMenu' }]));
    serve();
    createWindow();
    if (!SNAPSHOT) makeTray();
  });
  app.on('window-all-closed', () => app.quit());
}
