use tracing::metadata::LevelFilter;
use tracing_subscriber::{fmt::format::FmtSpan, layer::SubscriberExt, Layer};

pub fn init() {
    let format = tracing_subscriber::fmt::format()
        .with_file(true)
        .with_line_number(true)
        .with_target(false)
        .compact();

    let log_level_filter = std::env::var("LOG_LEVEL")
        .unwrap_or("info".to_string())
        .to_lowercase()
        .parse()
        .unwrap_or(LevelFilter::INFO);

    let subscriber = tracing_subscriber::registry().with(
        tracing_subscriber::fmt::layer()
            .event_format(format)
            .with_span_events(FmtSpan::CLOSE)
            .with_filter(log_level_filter),
    );

    tracing::subscriber::set_global_default(subscriber).expect("Failed to set subscriber");
}
