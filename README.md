# Daruma Desk

A to-do reminder that lives on your desktop as daruma dolls.

Write a task and a doll comes down to rest at the bottom of your screen with one eye painted. Hover it to see the task and mark it as done: the second eye is painted, fireworks go off, and the doll flies through the little gate into the Hall of Dolls, where every finished task stays on display.

- Realistic 3D lacquer dolls rendered with three.js
- Drag a doll anywhere; drop it from high up and a parachute opens
- The dolls always stand in one row beside the gate
- The Hall of Dolls: walnut ledges with falling petals; open a doll to read its task, when you added it and how long it took
- Give up on a task and its doll sheds a tear, cracks in two, and a little soul goes free

## Install (macOS)

1. Download the `.dmg` from the [latest release](https://github.com/ashub98-png/daruma-desk/releases/latest).
2. Open it and drag **Daruma Desk** to **Applications**.
3. Open Daruma Desk from Applications. The first time, macOS stops it, because the app isn't notarized by Apple. To let it open:
   - **macOS 15 Sequoia and later:** click **Done** on the warning, then open **System Settings › Privacy & Security**, scroll down to the message about Daruma Desk, click **Open Anyway** and confirm.
   - **macOS 13 Ventura and 14 Sonoma:** right-click the app in Applications, choose **Open**, then **Open** again.

   After that it opens normally.

It runs on macOS 13 Ventura or later, on Apple Silicon and Intel Macs. It needs no account and no internet: your tasks stay on your Mac.

The dolls float on the bottom edge of your screen, over other windows and full-screen apps, and clicks pass through everywhere else. The app lives in the menu bar (New Doll, View Hall of Dolls, Open at Login, Quit), not the Dock. Drag the gate to the bottom-left or bottom-right corner and the row follows it.

To uninstall, choose **Quit** from the menu bar icon and move the app to the Bin.

## Build from source

Needs Node.js and Apple's command line tools (`xcode-select --install`).

```bash
npm install
npm start          # run it
npm run dist       # build dist/Daruma Desk-<version>-universal.dmg, for Apple Silicon and Intel
```

The build is ad-hoc signed, not notarized, so other Macs show the warning above the first time.

## Run the prototype

Open `index.html` in Chrome or Safari. Tasks are saved in the browser's local storage.
Shortcuts: <kbd>N</kbd> new doll, <kbd>H</kbd> the hall.
