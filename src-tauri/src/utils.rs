use std::path::Path;

use anyhow::Context;

/// Open a path in the user's file explorer.
/// Returns an error if the path does not exist or if the command fails.
pub fn open_path<P: AsRef<Path>>(path: P) -> anyhow::Result<()> {
    #[cfg(target_os = "windows")]
    let command = "explorer";
    #[cfg(target_os = "macos")]
    let command = "open";

    let path = path.as_ref();

    anyhow::ensure!(path.exists(), "File does not exist");

    let status = std::process::Command::new(command).arg(path).status()?;

    status.success().then_some(()).context("Non-zero exit code")
}

pub fn set_platform(window: &tauri::Window) {
    // Hacky way to set the platform globally on the window object.
    // Getting the platform from the tauri API is async, which is not ideal.
    let javascript = format!("window.platform = '{}'", std::env::consts::OS);
    window.eval(&javascript).ok();
}
