use std::sync::atomic::{AtomicUsize, Ordering};

use crate::{args::Args, worker::matched_file::MatchedFile};
use rayon::prelude::*;

#[derive(Debug, serde::Serialize)]
pub struct Search {
    files: Vec<MatchedFile>,
    files_searched: usize,
    files_checked: usize,
    duration: u128,
}

#[tauri::command]
pub async fn file_search(args: Args) -> Result<Search, String> {
    let start_time = std::time::Instant::now();
    let searcher = args.worker();
    let walker = args.walker();
    let matcher = args.matcher().map_err(|e| e.to_string())?;

    let files_searched = AtomicUsize::new(0);
    let files_checked = AtomicUsize::new(0);

    let mut matches = walker
        .into_iter()
        .flatten()
        .filter_map(|dir_entry| {
            files_checked.fetch_add(1, Ordering::Relaxed);
            let path = dir_entry.path();
            if searcher.should_search(&path) {
                Some(path)
            } else {
                None
            }
        })
        // Parallel bridge to parallelize the search more effectively.
        // Jwalk parallelizes at the directory level, however, parallelizing at the file level is better here.
        .par_bridge()
        .flat_map(|path| {
            files_searched.fetch_add(1, Ordering::Relaxed);
            searcher.search_path(&path, &matcher)
        })
        .collect::<Vec<_>>();

    matches.sort_by(|a, b| b.modified().cmp(a.modified()));

    let duration = start_time.elapsed();

    Ok(Search {
        files: matches,
        duration: duration.as_millis(),
        files_checked: files_checked.into_inner(),
        files_searched: files_searched.into_inner(),
    })
}
