use std::path::{self, Path};

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
        if self.extensions.is_empty() {
            return true;
        }
        let path = path.as_ref();

        // Extensions will always be a small, deduped array.
        // Lookup should be faster with a Vec than a HashSet.

        let file_extension = path
            .extension()
            .and_then(|x| x.to_str())
            .unwrap_or_default()
            .to_owned();

        let file_size = path.metadata().map(|m| m.len()).unwrap_or(0);

        self.extensions.contains(&file_extension)
            && self
                .max_file_size
                .map(|max_size| file_size <= max_size)
                .unwrap_or(true)
    }

    pub fn search_path<P: AsRef<Path>>(
        &self,
        path: P,
        matcher: &PatternMatcher,
    ) -> anyhow::Result<MatchedFile> {
        let contents = crate::readers::read_file(path.as_ref())?;
        let matches = matcher.find_matches(&contents)?;
        MatchedFile::new(path.as_ref(), matches)
    }
}

pub struct SearchWorkerBuilder {
    extensions: Vec<String>,
    max_file_size: Option<u64>,
}

impl Default for SearchWorkerBuilder {
    fn default() -> Self {
        Self {
            extensions: Vec::new(),
            max_file_size: None,
        }
    }
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
