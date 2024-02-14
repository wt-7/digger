use std::path::Path;

use anyhow::Context;

#[tauri::command]
pub async fn open_in_explorer(path: &str) -> Result<(), String> {
    Path::new(path)
        .parent()
        .context("Failed to get parent path")
        .and_then(crate::utils::open_path)
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn open_with_default(path: &str) -> Result<(), String> {
    Ok(Path::new(path))
        .and_then(crate::utils::open_path)
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn preview_file(path: &str) -> Result<String, String> {
    crate::readers::read_file(Path::new(path)).map_err(|e| e.to_string())
}
