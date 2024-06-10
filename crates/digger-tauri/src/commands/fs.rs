use anyhow::Context;
use digger_core::extractor;
use std::path::Path;

#[tauri::command]
#[tracing::instrument]
pub async fn open_in_explorer(path: &str) -> crate::Result<()> {
    Path::new(path)
        .parent()
        .context("Failed to get parent path")
        .and_then(open_path)
        .inspect_err(|err| tracing::error!(?err, "failed to open parent path"))
        .inspect(|_| tracing::info!(?path, "opened parent path in explorer"))
        .map_err(Into::into)
}

#[tauri::command]
#[tracing::instrument]
pub async fn open_with_default(path: &str) -> crate::Result<()> {
    open_path(path)
        .inspect_err(|err| tracing::error!(?err, "failed to open path"))
        .inspect(|_| tracing::info!(?path, "opened path with default application"))
        .map_err(Into::into)
}

#[tauri::command]
#[tracing::instrument]
pub async fn preview_file(path: &str) -> crate::Result<String> {
    extractor::extract_text(path)
        .inspect_err(|err| tracing::error!(?err, "failed to extract text from file"))
        .inspect(|_| tracing::info!(?path, "extracted text from file"))
        .map_err(Into::into)
}

fn open_path<P: AsRef<Path>>(path: P) -> anyhow::Result<()> {
    #[cfg(target_os = "windows")]
    let command = "explorer";
    #[cfg(target_os = "macos")]
    let command = "open";
    let path = path.as_ref();
    anyhow::ensure!(path.exists(), "file path does not exist");
    std::process::Command::new(command)
        .arg(path)
        .status()?
        .success()
        .then_some(())
        .context("failed to open the file with its default application")
}
