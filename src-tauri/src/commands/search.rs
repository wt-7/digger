use std::sync::atomic::{AtomicUsize, Ordering};

use crate::{args::Args, worker::matched_file::MatchedFile};
use ignore::WalkState;
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
    let matcher = args.matcher().map_err(|e| e.to_string())?;
    let walker = args.walker();

    let files_searched = AtomicUsize::new(0);
    let files_checked = AtomicUsize::new(0);

    let (s, r) = crossbeam_channel::unbounded::<MatchedFile>();

    let result_thread = std::thread::spawn(move || {
        let mut matches = Vec::new();
        for matched_file in r {
            matches.push(matched_file);
        }
        matches
    });

    walker.run(|| {
        let files_searched = &files_searched;
        let files_checked = &files_checked;
        let searcher = &searcher;
        let matcher = &matcher;
        let s = s.clone();

        Box::new(move |entry_result| {
            let entry = match entry_result {
                Ok(entry) => entry,
                Err(_) => return WalkState::Continue,
            };

            files_checked.fetch_add(1, Ordering::Relaxed);

            let path = entry.path();
            if searcher.should_search(&path) {
                let search_result = searcher.search_path(&path, &matcher);
                files_searched.fetch_add(1, Ordering::Relaxed);
                if let Ok(search_result) = search_result {
                    s.send(search_result).ok();
                }
            }

            WalkState::Continue
        })
    });

    drop(s);

    let mut matches = result_thread
        .join()
        .map_err(|_| "Couldn't join the result thread")?;

    matches.sort_by(|a, b| b.modified().cmp(&a.modified()));

    let duration = start_time.elapsed();

    Ok(Search {
        files: matches,
        duration: duration.as_millis(),
        files_checked: files_checked.into_inner(),
        files_searched: files_searched.into_inner(),
    })
}
