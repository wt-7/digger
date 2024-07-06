use tauri::Manager;
use tracing::metadata::LevelFilter;
use tracing_appender::rolling::{RollingFileAppender, Rotation};
use tracing_subscriber::{fmt::format::FmtSpan, layer::SubscriberExt, Layer};

pub fn init_logging(app_handle: &tauri::AppHandle) {
    let log_dir = app_handle
        .path_resolver()
        .app_log_dir()
        .expect("failed to get log dir");

    std::fs::create_dir_all(&log_dir).expect("failed to create log dir");

    let file_appender = RollingFileAppender::builder()
        .rotation(Rotation::DAILY)
        .max_log_files(14)
        .filename_prefix("Digger.log")
        .build(&log_dir)
        .expect("failed to create file appender");

    let (file_writer, guard) = tracing_appender::non_blocking(file_appender);
    app_handle.manage(guard); // keep the guard alive for the lifetime of the app

    let format = tracing_subscriber::fmt::format()
        .with_file(true)
        .with_line_number(true)
        .with_target(false)
        .compact();

    let log_level_filter = std::env::var("LOG_LEVEL")
        .unwrap_or_else(|_| "info".to_string())
        .to_lowercase()
        .parse()
        .unwrap_or(LevelFilter::INFO);

    let use_colors_in_logs = cfg!(not(feature = "windows"));
    let subscriber = tracing_subscriber::registry()
        .with(
            // Stdout
            tracing_subscriber::fmt::layer()
                .event_format(format.clone())
                .with_ansi(use_colors_in_logs)
                .with_span_events(FmtSpan::CLOSE)
                .with_filter(log_level_filter),
        )
        .with(
            // Log file
            tracing_subscriber::fmt::layer()
                .event_format(format)
                .with_ansi(false)
                .with_span_events(FmtSpan::NEW | FmtSpan::CLOSE)
                .with_writer(file_writer)
                .with_filter(log_level_filter),
        );

    tracing::subscriber::set_global_default(subscriber).expect("failed to set subscriber");
}
