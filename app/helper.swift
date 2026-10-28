// Daruma Desk's native helper, for what a web page cannot do.
// - It reports whether the Dock and the menu bar are on screen ("1 1", "0 0", ...), at start and on every
//   change: macOS hides both in full-screen spaces without changing the screen's work area.
// - It frosts the desktop behind the gate: a borderless window of system blur, solid in the middle and
//   feathered to nothing at an oval edge, placed by "plate x y w h" lines on stdin (points, from the top left).
// It quits when the app closes its stdin, or is gone.
import AppKit

setvbuf(stdout, nil, _IOLBF, 0)
let app = NSApplication.shared
app.setActivationPolicy(.accessory)

let win = NSWindow(contentRect: NSRect(x: 0, y: 0, width: 10, height: 10), styleMask: .borderless, backing: .buffered, defer: false)
win.isOpaque = false
win.backgroundColor = .clear
win.hasShadow = false
win.ignoresMouseEvents = true
win.level = NSWindow.Level(rawValue: NSWindow.Level.floating.rawValue - 1)   // just under the dolls' window
win.collectionBehavior = [.canJoinAllSpaces, .fullScreenAuxiliary, .stationary, .ignoresCycle]
// System blur with its tint taken out, so the patch keeps the colours of whatever is behind it:
// dark over a dark background, light over a light one. (The tint is a few named layers over the
// blur; macOS rebuilds them now and then, as on a switch between light and dark, so they are taken out again.)
final class ClearBlur: NSVisualEffectView {
  override func layout() { super.layout(); clear() }
  override func viewDidChangeEffectiveAppearance() { super.viewDidChangeEffectiveAppearance(); clear() }
  func clear() {
    CATransaction.begin(); CATransaction.setDisableActions(true)
    func walk(_ l: CALayer) {
      if l.name == "backdrop", let filters = l.filters as? [NSObject] {
        let keep = filters.filter { ["sdrNormalize", "gaussianBlur"].contains($0.value(forKey: "name") as? String ?? "") }
        if keep.count != filters.count {
          for f in keep where f.value(forKey: "name") as? String == "gaussianBlur" { f.setValue(26, forKey: "inputRadius") }
          l.filters = keep
        }
      } else if ["fill", "tone", "Chameleon"].contains(l.name ?? "") { l.isHidden = true }
      l.sublayers?.forEach(walk)
    }
    if let l = layer { walk(l) }
    CATransaction.commit()
  }
}
let blur = ClearBlur()
blur.material = .popover
blur.blendingMode = .behindWindow
blur.state = .active
win.contentView = blur

func feather(_ size: NSSize) -> NSImage {
  NSImage(size: size, flipped: false) { r in
    let g = NSGradient(colors: [.black, .black, NSColor.black.withAlphaComponent(0.55), .clear], atLocations: [0, 0.42, 0.7, 1], colorSpace: .deviceRGB)!
    let t = NSAffineTransform()
    t.translateX(by: r.midX, yBy: r.midY); t.scaleX(by: r.width / 2, yBy: r.height / 2); t.concat()
    g.draw(fromCenter: .zero, radius: 0, toCenter: .zero, radius: 1, options: [])
    return true
  }
}
func place(_ line: String) {
  let p = line.split(separator: " ").compactMap { Double($0) }
  guard line.hasPrefix("plate "), p.count == 4, let screen = NSScreen.screens.first else { return }
  let frame = NSRect(x: p[0], y: screen.frame.height - p[1] - p[3], width: p[2], height: p[3])
  if frame.size != win.frame.size { blur.maskImage = feather(frame.size) }
  win.setFrame(frame, display: true)
  if !win.isVisible { win.orderFrontRegardless() }
}
var pending = ""
FileHandle.standardInput.readabilityHandler = { h in
  let data = h.availableData
  if data.isEmpty { exit(0) }
  pending += String(decoding: data, as: UTF8.self)
  while let nl = pending.firstIndex(of: "\n") {
    let line = String(pending[..<nl])
    pending.removeSubrange(...nl)
    DispatchQueue.main.async { place(line) }
  }
}

var last = ""
func poll() {
  if getppid() == 1 { exit(0) }   // the app is gone without saying so
  let dockPID = NSRunningApplication.runningApplications(withBundleIdentifier: "com.apple.dock").first?.processIdentifier
  let windows = CGWindowListCopyWindowInfo([.optionOnScreenOnly], kCGNullWindowID) as? [[String: Any]] ?? []
  var dock = false, bar = false
  for w in windows {
    let layer = w[kCGWindowLayer as String] as? Int ?? 0, pid = w[kCGWindowOwnerPID as String] as? Int32
    if layer == Int(CGWindowLevelForKey(.dockWindow)) && pid == dockPID { dock = true }
    if layer == Int(CGWindowLevelForKey(.mainMenuWindow)) { bar = true }
  }
  let state = "\(dock ? 1 : 0) \(bar ? 1 : 0)"
  if state != last { print(state); last = state }
  blur.clear()
}
poll()
Timer.scheduledTimer(withTimeInterval: 0.5, repeats: true) { _ in poll() }
app.run()
