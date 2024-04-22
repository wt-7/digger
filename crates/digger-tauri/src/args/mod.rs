use crate::{
    matcher::{PatternMatcher, PatternMatcherBuilder},
    worker::{SearchWorker, SearchWorkerBuilder},
};

mod needle;

pub use self::needle::Needle;

/// Arguments passed to the application from the frontend.
/// Tauri handles the deserialization of the struct when used in a tauri::command
#[derive(Debug, Clone, serde::Deserialize)]
pub struct Args {
    path: String,
    extensions: Vec<String>,
    needles: Vec<Needle>,
    max_depth: Option<usize>,
    ignore_hidden: bool,
    case_sensitive: bool,
    max_file_size: Option<u64>,
}

impl Args {
    pub fn worker(&self) -> SearchWorker {
        // Remove duplicate needles. Sorting by required ensures that a duplicated needle
        // with required=true will be kept.
        let mut needles = self.needles.clone();
        needles.sort_by(|a, b| b.is_required().cmp(&a.is_required()));
        needles.dedup_by(|a, b| a.pattern() == b.pattern());

        SearchWorkerBuilder::new()
            .add_extensions(&self.extensions)
            .max_file_size(self.max_file_size)
            .build()
    }

    pub fn walker(&self) -> ignore::WalkParallel {
        let cpus = num_cpus::get();

        ignore::WalkBuilder::new(&self.path)
            .max_depth(self.max_depth)
            .threads(cpus)
            .hidden(self.ignore_hidden)
            .build_parallel()
    }

    pub fn matcher(&self) -> anyhow::Result<PatternMatcher> {
        PatternMatcherBuilder::new()
            .add_needles(&self.needles)
            .ignore_case(!self.case_sensitive)
            .build()
    }
}
