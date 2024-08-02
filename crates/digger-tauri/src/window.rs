#[cfg(not(target_os = "macos"))]
pub fn create_window(handle: &tauri::AppHandle) -> anyhow::Result<tauri::Window> {
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
pub fn create_window(handle: &tauri::AppHandle) -> anyhow::Result<tauri::Window> {
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
