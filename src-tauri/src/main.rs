// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
mod args;
mod commands;
mod matcher;
mod readers;
mod utils;
mod worker;
use commands::*;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            open_in_explorer,
            open_with_default,
            file_search,
            preview_file
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
