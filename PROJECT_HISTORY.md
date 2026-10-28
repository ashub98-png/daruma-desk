# Daruma Desk: project history and handbook

A to-do reminder that lives on your desktop as daruma dolls. You write a task and a doll with one painted eye comes down to rest at the bottom of your screen. Hover it to see the task and mark it as done: the second eye is painted, fireworks go off, and the doll flies through a little torii gate into the Hall of Dolls, where every finished task stays on display.

This file records how the project came to be, conversation by conversation, what it does now, how it is built, and what is still open. It was written on 28 October 2026.

**At a glance**

| | |
|---|---|
| Repository | https://github.com/ashub98-png/daruma-desk (private), branch `main` |
| Browser prototype | `index.html`, opened directly in Chrome or Safari |
| Desktop app | macOS menu bar app, Electron 45.1, version 1.0.0 |
| Installer | `dist/Daruma Desk-1.0.0-arm64.dmg` (Apple Silicon, ad-hoc signed, not notarized) |
| Installed copy | `/Applications/Daruma Desk.app` |
| Main code | `index.html` (about 2,600 lines: page, styles and three.js scenes) |
| App shell | `app/main.js`, `app/preload.js`, `app/helper.swift` |

---

## 1. The conversation, in order

### The idea
> "I am thinking to make a daruma doll todo reminder character which will stay on your desktop until you complete that task. It will ask you to write the task and save it, then the daruma doll will rest at the bottom end of your desktop. If you hover on it then it will show you that task and a CTA to mark it as done. When you complete it its second eye will be marked and the doll will go to the daruma hall of dolls where all the dolls will be kept (basically a characterised version of your completed to-do lists). You can see the task if you click on it."

Decisions: build a browser prototype first and make a desktop app later; give each task a random doll colour.

### Realistic 3D dolls that match a reference pin
The user shared an enamel pin of a daruma as the reference and asked for:
- dolls in 3D with three.js, as realistic as possible, following the pin;
- the eye painted and fireworks bursting near the doll when a task is done;
- smaller dolls;
- the Hall's entry placed right next to the dolls, with two options on hover: New doll and View hall;
- a Hall of Dolls in a Japanese aesthetic, "as intricate and accurate as possible".

The dolls were traced from the pin: an egg-shaped lacquer body, gold teardrop ornaments, the face window, dark moustache blades, mirror-dark feathers with gold rims, and a sakura on the belly. The painted eye is on the viewer's right: a white eye, a black pupil, a fine gold ring and a tiny gold centre ring. A sticker-sheet style was also shared mid-way.

### "This is too much"
The first Hall was a full 3D shrine courtyard with a camera you could move around in. The user said:
> "This is too much. I don't want a full-on 3D world and interactive experience. I just wanted you to make those dolls realistic. And that sticker type theme is not good. I just wanted a clean Apple-like style which is Swiss-inspired and minimal with a subtle Japanese aesthetic. Don't use Japanese language, it is not required."

They then added:
> "Keep fireworks and remove that lucky / health / wealth naming of daruma. Also don't give it a wish angle because it is a to-do list or a pledge, not a wish."

So: no Japanese text, no colour meanings, no "wish" wording, keep the fireworks.

### "Very plain and bland"
The minimal rebuild went too far the other way:
> "You made it look very plain and bland. In that hall of doll on desktop make that Japanese gate logo/illustration but in 3D, also remove that make-your-first-pledge button. While opening the list, instead of simple line icons use illustration. The eye of the daruma doll is not correct… make the design as perfect as possible. Give drag and drop feature to daruma dolls resting on my desktop… when I drop it from height it should open a parachute and smoothly land back to the bottom. The hall of fame looks so boring."

This gave the 3D torii launcher, the illustrated menu, the corrected eye, drag and drop, and the parachute. Mid-way the user asked for a tiny doll and tiny cherry blossoms in the gate, more detail, and better contrast.

### Polish of the desk
> "Parachute design can be improved. If it lands far from gate then roll the doll towards the gate. In the hover list add both the eyes. Instead of red pill CTAs make black smooth corner-radius CTAs of 6px radius. Make that gate UI non-rotated and non-changeable while hovering."

Result: a 12-panel parachute with vent and lines; dolls tumble back towards the gate; the menu illustration shows both eyes painted; black 6 px buttons; a still, front-facing gate.

### Always packed beside the gate, a calmer glow, a premium Hall
> "Always auto align/arrange dolls near the gate, even if any doll is marked as completed from the middle. That blur effect behind the gate is too contrasty, make it blend in and smudge it. The hall of dolls looks cluttered, make the gate go away and just make wooden racks with subtle cherry blossoms. Also give an add-new-doll option so that the user can add dolls from inside the hall of dolls. Make the overall design of the hall look premium."

Result:
- the dolls always stand in one packed row beside the gate. The others slide over to close a gap, and they part to leave a space under a doll being carried, like the macOS Dock;
- a softer, blended glow behind the gate;
- a Hall with no gate;
- a New doll button inside the Hall;
- a "focus" view where the chosen doll steps forward and the rack blurs behind it.

### "Rack is not good"
> "Rack is not good, improve design. Also that click-to-view CTA is not necessary." Then: "That cherry blossom branch looks ugly. Just make petals dropping beautifully."

Four rack directions were explored in parallel and compared: floating walnut ledges, a modern Japanese display shelf, a refined cabinet, and a grid of lit niches. Floating walnut ledges won, being the calmest and least cluttered. The branch was removed in favour of a dedicated falling-petal system, and the "Click a doll" pill was removed. To stay within the user's usage limit, the exploration was stopped early and the winner picked directly.

> "When a doll is open, don't let the background dolls hover or be interactive."

The dolls behind an open doll are now inert. Clicking them just closes the open doll.

### GitHub and the desktop app
> "Make it into an installable desktop app now." / "Make GitHub of it first."

A private GitHub repository was created and the prototype pushed. The app followed: a transparent window that floats over other windows and lets clicks pass through, except over the dolls. It lives in the menu bar, bundles three.js so it runs offline, and has its own icon.

### Living on a real desktop
- "When I full screen, make it rest at the bottom. Also let me drag and put it on either side of the bottom edge… right now it is overlapping my background content. Also make the dolls a little bit smaller." The dolls now rest on the bottom edge. The gate can be dragged to either bottom corner and the row follows it there. Dolls and gate are about 15% smaller.
- "I can't drag the gate to the other side." The app on screen was an old build, started before gate dragging existed and run from the `dist` folder. The current build was installed into Applications.
- "Sort this multiple dolls overlapping issue." The dolls were sitting on top of the Dock icons. They now stand just above a visible Dock.
- "When the Dock is not there then it should be at the bottom." macOS keeps the Dock's space reserved even in full-screen apps, so a small native helper now checks whether the Dock and menu bar are actually on screen. The dolls drop to the bottom edge whenever the Dock is hidden.

### The blur behind the gate
- "Add a background blur so that I can't see content behind the gate." This first became a frosted glass tile.
- "No, I don't want this container-like UI." It became a feathered blur that fades to nothing at an oval edge.
- "If the background is dark, let the gate blur take on the dark background; if it is light, make it light." The system blur's tint was stripped, leaving a plain blur that keeps the background's own colours.

### Words and long text
- "Instead of pledge write the text task." The app now says task everywhere: New task, Add task, N tasks done, and Added / Done dates.
- "Handle the long text here… if it is more then it kind of hides the doll. Maybe we can open it on the side… Also the text in hover is overflowing, truncate it." In a wide Hall the caption is now a label beside the open doll; in a narrow one it stops at three lines and scrolls. The hover label is cut short with an ellipsis, and the desk card stops at four lines.

---

## 2. What the user's taste turned out to be

These rules came out of the back-and-forth above and should guide future changes:

- **Apple-like, Swiss-inspired, minimal, warm, with a subtle Japanese feel.** Not sticker or kawaii. Not bland either: a near-white version was rejected as "plain and bland".
- **Spend craft on the objects and interactions**: the lacquer dolls, the torii, the parachute, the rolling, the fireworks. Keep the interface chrome typographic and quiet.
- **Build only what was asked.** "Realistic" means the named object, not an immersive scene. The courtyard Hall was "too much"; the torii, sun and stepped-stand Hall was "cluttered"; the oak rack was "not good"; the branch was "ugly". What lasted is walnut ledges with falling petals.
- **No containers or boxes** around things on the desktop. The frosted tile behind the gate was rejected; a feathered blur was accepted. In the Hall, the open doll's label is type on the wall, not a white card.
- **Wording:** "task" (not "pledge"), never "wish". No Japanese-language text. No colour meanings.
- **Buttons:** black, 6 px radius.
- **On the desktop, stay out of the way.** Rest on the bottom edge or on top of the Dock, never over the Dock or app content, and let clicks through everywhere else.

---

## 3. What it does now

### On the desk
- A 3D torii gate in a bottom corner, with a stone slab, a tiny kept doll under it and a little sakura tree. Hover it for a menu with two illustrated options: **New doll** (<kbd>N</kbd>) and **View hall** (<kbd>H</kbd>).
- **Add a task:** a sheet with a turning doll preview, nine lacquer colours (one picked at random), and a field of up to 120 characters. On "Add task" the first eye is painted and the doll drops onto the desk.
- **Dolls** rest in one packed row beside the gate, rocking gently now and then. Hover one for a card showing the task and its age, with **Mark as done** and a two-step remove.
- **Mark as done:** the second eye is painted, the doll hops, fireworks burst (peony, chrysanthemum, ring and willow), and the doll flies through the gate. The rest close up behind it.
- **Drag a doll** anywhere. Let go low and it falls and rocks. Let go high and a parachute opens and it drifts down. It lands in the space the row opened for it, and rolls back if it lands beyond the end of the row.
- **Drag the gate** to the other bottom corner. The row tumbles across to follow, and the side is remembered.
- Everything respects Reduce Motion, and tasks and positions are saved.

### The Hall of Dolls
- Floating walnut ledges on a warm plaster wall, lit by soft daylight with long shadows, and sakura petals falling slowly and settling on the ledges.
- Dolls are spread evenly and centred, oldest first, so there is never a lone doll on a shelf. The view fits anything from 1 to 24 or more dolls, on wide and narrow windows.
- **Pick a doll:** it steps forward onto a walnut stand while the wall softens and fades behind it. Its label is set straight on the wall like a museum placard, with no card: the task (sized by its length), a hairline, then Added, Done and Took. In a wide window doll and label stand side by side, centred together as one piece; in a narrow one the label hangs just under the stand. The arrows under the label or the arrow keys step through the dolls; **All dolls** (top left) or <kbd>Esc</kbd> goes back.
- While a doll is open, the dolls behind it can't be hovered or picked.
- A **New doll** button opens the task sheet over the Hall. Adding a task closes the Hall so you see the new doll come down.
- An empty Hall offers "Preview with sample dolls". The samples are never saved.

### The desktop app (macOS)
- One transparent window covering the screen, floating over other windows including full-screen apps. Clicks pass through everywhere except the dolls, the gate and whatever is open.
- The dolls stand on top of the Dock while it shows, and drop to the bottom edge when it hides. A Dock on the left or right moves the gate clear of it.
- A feathered, untinted blur behind the gate hides what's underneath and takes on its colours.
- A menu bar icon offers New Doll…, View Hall of Dolls, Open at Login, and Quit. The app has no Dock icon.

---

## 4. How it is built

### Files
| File | What it holds |
|---|---|
| `index.html` | Everything the user sees: styles, markup, and one ES module with three scenes (desk, task preview, hall) plus illustrations |
| `app/main.js` | Electron main process: `app://` protocol, overlay window, click-through, menu bar icon, Dock and menu-bar insets, helper process |
| `app/preload.js` | The bridge the page uses: `clickThrough`, `plate`, `onCommand`, `inset`, `onInset` |
| `app/helper.swift` | Native helper: reports whether the Dock and menu bar are on screen, and draws the feathered blur behind the gate |
| `vendor/three@0.170.0/` | three.js r170 plus RoomEnvironment and BufferGeometryUtils, bundled for offline use |
| `build/icon.icns`, `build/icon.png` | App icon (a rendered red doll on its walnut stand) |
| `app/trayTemplate*.png` | Menu bar icon (a daruma silhouette) |
| `package.json` | Scripts and electron-builder config |

### Rendering (three.js r170)
- The **doll** is a lathe-turned egg. Its front half carries the painted design, drawn on a canvas and projected flat; the back is plain lacquer. The material is MeshPhysical with clearcoat and an orange-peel normal, roughness/metal maps that change with the painted eyes, a bump map, and baked occlusion.
- The **desk** is a transparent full-window WebGL canvas in pixel units, rendered only when something moves. Each doll has an invisible button that follows it, for pointer and keyboard input.
- The **Hall** uses two canvases. The rack layer blurs with a CSS filter while the chosen doll is drawn sharp on a focus layer. VSM shadows fall on a shadow-only plaster wall.
- **Fireworks** are pooled additive point sprites with a short flash of light per burst.
- **Petals** are one instanced mesh of cupped, notched petals with a blush gradient. They flutter, tumble, catch occasional gusts, and settle on ledges.

### Desk behaviour
- Each doll has a mode: `idle`, `drop`, `drag`, `chute`, `fall`, `roll`, `paint`, `cheer`, `rest`, `fly` or `gone`.
- `pack()` gives every doll in the row a slot counted out from the gate. Dolls in the air are inserted where they would land, with hysteresis so the space doesn't flicker. Short moves slide on a spring that makes the doll lean and rock; long moves roll. A crowded row staggers in depth.
- Tasks are saved in `localStorage` under `daruma.v1` as `{ active, hall, side }`. Each active task keeps its slot as `x`.

### Desktop app internals
- The page is served from `app://daruma/` so local storage keeps a stable origin. The three.js CDN address in the importmap is rewritten to the bundled copy.
- **Click-through:** the window ignores mouse events but still forwards mouse moves. The page checks what is under the pointer, or whether something is open or being dragged, and asks the main process to take or release clicks.
- **Insets:** `main.js` combines the screen's work area with the helper's report of what is actually on screen, and sends the page the room at each edge. The page moves its floor (`BASE_Y`) and the gate accordingly.
- **Helper:** on the window server's on-screen list, it finds the Dock's layer-20 window and the menu bar's layer-24 window. It draws an `NSVisualEffectView` masked to a feathered oval, with the material's tint layers ("fill", "tone", "Chameleon") and saturation filter removed. It quits when the app does.
- **Signing:** the app is ad-hoc signed, with the hardened runtime off, so it launches on Apple Silicon. It is not notarized.

---

## 5. Run, build, test

```bash
npm install
npm start          # compiles the helper, runs the app
npm run dist       # compiles the helper, builds dist/Daruma Desk-1.0.0-arm64.dmg
```

- The browser prototype needs nothing: open `index.html`.
- **Install:** open the `.dmg` and drag the app to Applications. On a Mac other than the one that built it, right-click the app and choose Open the first time.
- **Test mode:** `DARUMA_SNAPSHOT=/path/out.png npm start` runs the app with a throwaway profile. It adds three dolls, saves a capture of the window and quits.
- **Browser tests** were Playwright scripts driving the installed Chrome headless. They covered the row packing, the parachute, Hall states (0, 1, 6, 12 and 24 dolls; narrow; focus), New doll from the Hall, and long text. They lived in the session's scratch folder, not in the repo.

---

## 6. Known limits and ideas

- The untinted blur relies on how macOS 26 builds its blur internally. A future macOS could change that and bring the haze back.
- The Dock check relies on the Dock's window being on the window server's on-screen list. It was verified on this Mac with the Dock showing, and in a simulated hidden state; full-screen behaviour was confirmed by the window list but not watched on screen.
- Only the primary display is used.
- The app is Apple Silicon only, ad-hoc signed and not notarized. Sharing it widely would need a Developer ID and notarization, or a universal build.
- The `.dmg` is not in the repository. It could be attached to a GitHub release.
- No automated tests live in the repo yet.
- Possible next steps: due dates or reminders that nudge a doll, more than one row on small screens, export or backup of tasks, and Windows support.

---

## 7. Commit history (`main`)

| Commit | Change |
|---|---|
| `bae8ceb` | Daruma Desk browser prototype |
| `2cd2989` | Package Daruma Desk as a macOS menu bar app (also: corner-draggable gate, smaller dolls, walnut-ledge Hall) |
| `3bc23da` | Rest the desk dolls on top of the Dock while it shows |
| `5706824` | Bring the dolls down to the bottom edge whenever the Dock is hidden |
| `23b8efc` | Frost the desktop behind the gate in the app |
| `bca3849` | Feather the blur behind the gate instead of a frosted tile |
| `cf19573` | Blur behind the gate without a tint, so it takes the background's colours |
| `1c7a786` | Call them tasks rather than pledges |
| `a5535c7` | Keep long tasks from covering the dolls |
