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
    depth: usize,
    ignore_hidden: bool,
    ignore_case: bool,
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

    pub fn walker(&self) -> jwalk::WalkDir {
        let depth = if self.depth == 0 {
            std::usize::MAX
        } else {
            self.depth
        };

        jwalk::WalkDir::new(&self.path)
            .max_depth(depth)
            .skip_hidden(self.ignore_hidden)
    }

    pub fn matcher(&self) -> anyhow::Result<PatternMatcher> {
        PatternMatcherBuilder::new()
            .add_needles(&self.needles)
            .ignore_case(self.ignore_case)
            .build()
    }
}
