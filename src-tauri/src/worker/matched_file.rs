use std::path::{Path, PathBuf};

use crate::matcher::Matches;

#[derive(Debug, serde::Serialize)]
pub struct MatchedFile {
    path: PathBuf,
    extension: String,
    filename: String,
    matches: Matches,
    metadata: Metadata,
}

impl MatchedFile {
    pub fn new<P: AsRef<Path>>(path: P, matches: Matches) -> Self {
        let path = path.as_ref();
        let metadata = Metadata::from_path(path);

        let extension = path
            .extension()
            .and_then(|x| x.to_str())
            .unwrap_or_default()
            .to_owned();

        let filename = path
            .file_name()
            .and_then(|x| x.to_str())
            .unwrap_or_default()
            .to_owned();

        Self {
            path: path.to_path_buf(),
            filename,
            extension,
            matches,
            metadata,
        }
    }

    pub fn modified(&self) -> &Option<time::OffsetDateTime> {
        // Exposed for sorting
        &self.metadata.modified()
    }
}

#[derive(Debug, serde::Serialize)]
pub struct Metadata {
    #[serde(with = "time::serde::iso8601::option")]
    accessed: Option<time::OffsetDateTime>,
    #[serde(with = "time::serde::iso8601::option")]
    modified: Option<time::OffsetDateTime>,
    #[serde(with = "time::serde::iso8601::option")]
    created: Option<time::OffsetDateTime>,
    size: Option<u64>,
}

impl Metadata {
    pub fn from_path(path: &Path) -> Self {
        let meta = path.metadata().ok();

        let modified = meta
            .as_ref()
            .and_then(|z| z.modified().ok())
            .map(time::OffsetDateTime::from);

        let accessed = meta
            .as_ref()
            .and_then(|z| z.accessed().ok())
            .map(time::OffsetDateTime::from);

        let created = meta
            .as_ref()
            .and_then(|z| z.created().ok())
            .map(time::OffsetDateTime::from);

        let size = path.metadata().map(|x| x.len()).ok();

        Self {
            accessed,
            modified,
            created,
            size,
        }
    }

    pub fn modified(&self) -> &Option<time::OffsetDateTime> {
        // Exposed for sorting
        &self.modified
    }
}
