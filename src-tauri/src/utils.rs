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
