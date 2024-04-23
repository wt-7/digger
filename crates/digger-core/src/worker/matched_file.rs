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
    pub(crate) fn new<P: AsRef<Path>>(path: P, matches: Matches) -> anyhow::Result<Self> {
        let path = path.as_ref();

        let metadata = path.metadata()?.into();

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

        Ok(Self {
            path: path.to_path_buf(),
            filename,
            extension,
            matches,
            metadata,
        })
    }

    pub fn modified(&self) -> &Option<time::OffsetDateTime> {
        // Exposed for sorting
        &self.metadata.modified
    }
}

impl Ord for MatchedFile {
    fn cmp(&self, other: &Self) -> std::cmp::Ordering {
        other.modified().cmp(self.modified())
    }
}

impl PartialOrd for MatchedFile {
    fn partial_cmp(&self, other: &Self) -> Option<std::cmp::Ordering> {
        Some(self.cmp(other))
    }
}

impl PartialEq for MatchedFile {
    fn eq(&self, other: &Self) -> bool {
        self.path == other.path
    }
}

impl Eq for MatchedFile {}

#[derive(Debug, serde::Serialize)]
pub struct Metadata {
    #[serde(with = "time::serde::iso8601::option")]
    pub modified: Option<time::OffsetDateTime>,
    #[serde(with = "time::serde::iso8601::option")]
    accessed: Option<time::OffsetDateTime>,
    #[serde(with = "time::serde::iso8601::option")]
    created: Option<time::OffsetDateTime>,
    size: u64,
}
impl From<std::fs::Metadata> for Metadata {
    fn from(metadata: std::fs::Metadata) -> Self {
        let modified = metadata.modified().ok().map(time::OffsetDateTime::from);
        let accessed = metadata.accessed().ok().map(time::OffsetDateTime::from);
        let created = metadata.created().ok().map(time::OffsetDateTime::from);
        let size = metadata.len();

        Self {
            accessed,
            modified,
            created,
            size,
        }
    }
}
