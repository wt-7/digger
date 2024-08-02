// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
mod args;
mod commands;
mod error;
mod logging;
mod window;
use commands::*;
use error::Result;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            open_in_explorer,
            open_with_default,
            file_search,
            preview_file
        ])
        .setup(|app| {
            let handle = app.handle();
            logging::init_logging(&handle);

            let window = window::create_window(&handle)?;

            #[cfg(debug_assertions)]
            window.open_devtools();

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
