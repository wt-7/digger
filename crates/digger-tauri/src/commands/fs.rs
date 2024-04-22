use anyhow::Context;
use std::path::Path;

#[tauri::command]
#[tracing::instrument]
pub async fn open_in_explorer(path: &str) -> Result<(), String> {
    Path::new(path)
        .parent()
        .context("Failed to get parent path")
        .and_then(open_path)
        .map_err(|e| e.to_string())
}

#[tauri::command]
#[tracing::instrument]
pub async fn open_with_default(path: &str) -> Result<(), String> {
    open_path(path).map_err(|e| e.to_string())
}

#[tauri::command]
#[tracing::instrument]
pub async fn preview_file(path: &str) -> Result<String, String> {
    crate::extractors::extract_text(path).map_err(|e| e.to_string())
}


fn open_path<P: AsRef<Path>>(path: P) -> anyhow::Result<()> {
    #[cfg(target_os = "windows")]
    let command = "explorer";
    #[cfg(target_os = "macos")]
    let command = "open";

    let path = path.as_ref();

    anyhow::ensure!(path.exists(), "File does not exist");

    let status = std::process::Command::new(command).arg(path).status()?;

    status.success().then_some(()).context("Non-zero exit code")
}
