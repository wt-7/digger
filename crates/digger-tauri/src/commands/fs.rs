use anyhow::Context;
use digger_core::extractor;
use std::path::Path;

#[tauri::command]
#[tracing::instrument]
pub async fn open_in_explorer(path: &str) -> crate::Result<()> {
    let parent = Path::new(path)
        .parent()
        .context("failed to get parent path")?;

    open::that(parent)
        .inspect_err(|err| tracing::error!(?err, ?parent))
        .context("failed to open path")
        .map_err(Into::into)
}

#[tauri::command]
#[tracing::instrument]
pub async fn open_with_default(path: &str) -> crate::Result<()> {
    open::that(path)
        .inspect_err(|err| tracing::error!(?err, ?path))
        .context("failed to open path")
        .map_err(Into::into)
}

#[tauri::command]
#[tracing::instrument]
pub async fn preview_file(path: &str) -> crate::Result<String> {
    extractor::extract_text(path)
        .inspect_err(|err| tracing::error!(?err, "failed to extract text from file"))
        .map_err(Into::into)
}
