// Prints whether the Dock and the menu bar are on screen ("1 1", "0 0", ...), once at start and on every
// change. macOS hides both in full-screen spaces without changing the screen's work area, so this is
// the only way the app can tell when the dolls should come down to the bottom edge.
import AppKit

setvbuf(stdout, nil, _IOLBF, 0)
var last = ""
while getppid() != 1 {   // stop once the app that started it has gone
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
  Thread.sleep(forTimeInterval: 0.5)
}
