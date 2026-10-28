# Daruma Desk

A to-do reminder that lives on your desktop as daruma dolls.

Write a pledge and a doll comes down to rest at the bottom of your screen with one eye painted. Hover it to see the pledge and mark it as done: the second eye is painted, fireworks go off, and the doll flies through the little gate into the Hall of Dolls, where every kept pledge stays on display.

- Realistic 3D lacquer dolls rendered with three.js
- Drag a doll anywhere; drop it from high up and a parachute opens
- The dolls always stand in one row beside the gate
- The Hall of Dolls: walnut ledges with falling petals; pick a doll to read its pledge

## Desktop app (macOS)

The app floats the dolls on the bottom edge of your screen, over other windows and full-screen apps, and lets clicks pass through everywhere else. It lives in the menu bar (New Doll, View Hall of Dolls, Open at Login, Quit). Drag the gate to the bottom-left or bottom-right corner and the row follows it.

```bash
npm install
npm start          # run it
npm run dist       # build dist/Daruma Desk-<version>-arm64.dmg
```

The build is ad-hoc signed, not notarized: it opens normally on the Mac that built it; on another Mac, right-click the app and choose Open the first time.

## Run the prototype

Open `index.html` in Chrome or Safari. Pledges are saved in the browser's local storage.
Shortcuts: <kbd>N</kbd> new doll, <kbd>H</kbd> the hall.
