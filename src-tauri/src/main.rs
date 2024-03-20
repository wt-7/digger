// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
mod args;
mod commands;
mod matcher;
mod readers;
mod utils;
mod worker;
use commands::*;
use tauri::Manager;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            open_in_explorer,
            open_with_default,
            file_search,
            preview_file
        ])
        .setup(|app| {
            let window = app.get_window("main").unwrap();
            // Hacky way to set the platform globally on the window object.
            // Getting the platform from the tauri API is async, which is not ideal.
            let set_platform = format!("window.platform = '{}'", std::env::consts::OS);
            window.eval(&set_platform).ok();

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
