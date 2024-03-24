use anyhow::Context;
use std::path::Path;

#[tauri::command]
#[tracing::instrument]
pub async fn open_in_explorer(path: &str) -> Result<(), String> {
    Path::new(path)
        .parent()
        .context("Failed to get parent path")
        .and_then(crate::utils::open_path)
        .map_err(|e| e.to_string())
}

#[tauri::command]
#[tracing::instrument]
pub async fn open_with_default(path: &str) -> Result<(), String> {
    crate::utils::open_path(path).map_err(|e| e.to_string())
}

#[tauri::command]
#[tracing::instrument]
pub async fn preview_file(path: &str) -> Result<String, String> {
    crate::extractors::extract_text(path).map_err(|e| e.to_string())
}
