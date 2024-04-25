use digger_core::{
    matcher::{Needle, PatternMatcher, PatternMatcherBuilder},
    worker::{SearchWorker, SearchWorkerBuilder},
};
use std::collections::HashMap;

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
        let needles = dedup_needles(self.needles.clone());

        PatternMatcherBuilder::new()
            .add_needles(&needles)
            .ignore_case(!self.case_sensitive)
            .build()
    }
}

fn dedup_needles(needles: Vec<Needle>) -> Vec<Needle> {
    let mut unique_needles: HashMap<String, Needle> = HashMap::new();

    for needle in needles {
        unique_needles
            .entry(needle.pattern().to_string())
            .and_modify(|existing_needle| {
                // If the existing needle is not required and the new needle is, the new one takes precedence.
                if !existing_needle.is_required() && needle.is_required() {
                    *existing_needle = needle.clone();
                }
            })
            .or_insert(needle);
    }

    unique_needles.into_values().collect()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_dedup_needles() {
        let json = r#"[{"pattern":"needle1","required":false},{"pattern":"needle2","required":false},{"pattern":"needle2","required":true}]"#;
        let needles = dedup_needles(serde_json::from_str(json).unwrap());

        assert_eq!(needles.len(), 2);

        assert_eq!(needles[0].pattern(), "needle1");
        assert_eq!(needles[0].is_required(), false);

        assert_eq!(needles[1].pattern(), "needle2");
        assert_eq!(needles[1].is_required(), true);
    }
}
