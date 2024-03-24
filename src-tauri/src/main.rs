// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
mod args;
mod commands;
mod extractors;
mod logging;
mod matcher;
mod utils;
mod worker;
use commands::*;

fn main() {
    logging::init();

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            open_in_explorer,
            open_with_default,
            file_search,
            preview_file
        ])
        .setup(|app| {
            let handle = app.handle();
            let window = create_window(&handle)?;

            #[cfg(debug_assertions)]
            window.open_devtools();

            utils::set_platform(&window);

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[cfg(not(target_os = "macos"))]
fn create_window(handle: &tauri::AppHandle) -> anyhow::Result<tauri::Window> {
    let app_title = handle.package_info().name.clone();
    let window =
        tauri::WindowBuilder::new(handle, "main", tauri::WindowUrl::App("index.html".into()))
            .resizable(true)
            .title(app_title)
            .disable_file_drop_handler()
            .min_inner_size(800.0, 600.0)
            .inner_size(1440.0, 810.0)
            .build()?;
    tracing::info!("Window created");
    Ok(window)
}

#[cfg(target_os = "macos")]
fn create_window(handle: &tauri::AppHandle) -> anyhow::Result<tauri::Window> {
    let app_title = handle.package_info().name.clone();
    let window =
        tauri::WindowBuilder::new(handle, "main", tauri::WindowUrl::App("index.html".into()))
            .resizable(true)
            .title(app_title)
            .min_inner_size(800.0, 600.0)
            .inner_size(1440.0, 810.0)
            .hidden_title(true)
            .disable_file_drop_handler()
            .title_bar_style(tauri::TitleBarStyle::Overlay)
            .build()?;
    tracing::info!("Window created");
    Ok(window)
}
