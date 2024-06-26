use std::path::Path;

use anyhow::Context;

use crate::matcher::PatternMatcher;

use self::matched_file::MatchedFile;
pub mod matched_file;

/// High level worker for managing searches.
pub struct SearchWorker {
    extensions: Vec<String>,
    max_file_size: Option<u64>,
}
impl SearchWorker {
    pub fn should_search<P: AsRef<Path>>(&self, path: P) -> bool {
        let path = path.as_ref();

        // No directories or symlinks.
        if !path.is_file() {
            return false;
        }

        let file_extension = path
            .extension()
            .and_then(|x| x.to_str())
            .unwrap_or_default()
            .to_owned();

        let file_size = path.metadata().map(|m| m.len()).unwrap_or(0);

        // Extensions will always be a small, deduped array.
        // Lookup should be faster with a Vec than a HashSet.
        self.extensions.contains(&file_extension)
            && self
                .max_file_size
                .map_or(true, |max_size| file_size <= max_size)
    }

    pub fn search_path<P: AsRef<Path>>(
        &self,
        path: P,
        matcher: &PatternMatcher,
    ) -> anyhow::Result<MatchedFile> {
        let path = path.as_ref();
        let contents = crate::extractor::extract_text(path)
            .inspect_err(|e| tracing::error!(?path, ?e, "failed to extract text"))?;

        let matches = matcher
            .compute_match(&contents)
            .context("No matches found")?;

        MatchedFile::new(path, matches)
    }
}
#[derive(Default)]
pub struct SearchWorkerBuilder {
    extensions: Vec<String>,
    max_file_size: Option<u64>,
}

impl SearchWorkerBuilder {
    pub fn new() -> Self {
        Self::default()
    }

    pub fn add_extensions(&mut self, extensions: &[String]) -> &mut Self {
        self.extensions.extend_from_slice(extensions);
        self
    }
    pub fn max_file_size(&mut self, max_file_size: Option<u64>) -> &mut Self {
        self.max_file_size = max_file_size;
        self
    }

    pub fn build(&self) -> SearchWorker {
        let extensions = self.extensions.clone();

        SearchWorker {
            extensions,
            max_file_size: self.max_file_size,
        }
    }
}
