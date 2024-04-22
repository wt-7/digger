use std::{
    collections::BTreeSet,
    sync::atomic::{AtomicUsize, Ordering},
};

use crate::args::Args;
use digger_core::worker::matched_file::MatchedFile;

use ignore::WalkState;

/// Somewhat contrived upper bound for the channel capacity.
/// The goal is to have it large enough to not block the search, but not so large that it uses too much memory.
const CHANNEL_CAPACITY: usize = 1024;

#[derive(Debug, serde::Serialize)]
pub struct Search {
    files: Vec<MatchedFile>,
    files_searched: usize,
    entries_checked: usize,

    duration: u128,
}

#[tauri::command]
#[tracing::instrument]
pub async fn file_search(args: Args) -> Result<Search, String> {
    let start_time = std::time::Instant::now();
    let searcher = args.worker();
    let matcher = args.matcher().map_err(|e| e.to_string())?;
    let walker = args.walker();

    let files_searched = AtomicUsize::new(0);
    let entries_checked = AtomicUsize::new(0);

    let (s, r) = crossbeam_channel::bounded::<MatchedFile>(CHANNEL_CAPACITY);

    let result_thread = std::thread::spawn(move || {
        let mut matches = BTreeSet::new();
        for matched_file in r {
            matches.insert(matched_file);
        }
        matches
    });

    walker.run(|| {
        let files_searched = &files_searched;
        let entries_checked = &entries_checked;

        let searcher = &searcher;
        let matcher = &matcher;
        let s = s.clone();

        Box::new(move |entry_result| {
            let entry = match entry_result {
                Ok(entry) => entry,
                Err(err) => {
                    tracing::error!(?err, "Error walking directory");
                    return WalkState::Continue;
                }
            };
            entries_checked.fetch_add(1, Ordering::Relaxed);

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

    let matches = result_thread
        .join()
        .map_err(|_| "Couldn't join the result thread")?;

    let duration = start_time.elapsed();

    Ok(Search {
        files: matches.into_iter().collect(),
        duration: duration.as_millis(),
        entries_checked: entries_checked.into_inner(),

        files_searched: files_searched.into_inner(),
    })
}
