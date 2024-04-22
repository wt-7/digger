use aho_corasick::AhoCorasick;
use line_numbers::LinePositions;
use std::collections::{BTreeMap, BTreeSet};
mod context;
mod needle;
use context::Context;

pub use needle::Needle;
pub type Matches = BTreeMap<String, Vec<Context>>;
pub struct PatternMatcher {
    needles: Vec<Needle>,
    // Required needles is a set of indexes into the needles vector.
    // This is used to ensure that all required needles are matched.
    required_needles: BTreeSet<usize>,
    inner: AhoCorasick,
}

impl PatternMatcher {
    pub fn find_matches(&self, contents: &str) -> anyhow::Result<Matches> {
        let mut matches = Matches::new();
        let mut required_needles = BTreeSet::new();
        let line_positions = LinePositions::from(contents);

        for mat in self.inner.find_overlapping_iter(contents) {
            let matched_needle = &self.needles[mat.pattern()];
            // Lines are 0-indexed, but 1-indexed in the UI.
            let line = line_positions.from_offset(mat.start()).as_usize() + 1;

            let context = Context::from_haystack(contents, mat.start(), mat.end(), line);

            if matched_needle.is_required() {
                required_needles.insert(mat.pattern().as_usize());
            }

            matches
                .entry(matched_needle.pattern().to_string())
                .or_default()
                .push(context);
        }

        anyhow::ensure!(
            required_needles == self.required_needles && !matches.is_empty(),
            "Not all required needles were matched"
        );

        Ok(matches)
    }
}

pub struct PatternMatcherBuilder {
    needles: Vec<Needle>,
    ignore_case: bool,
}

impl Default for PatternMatcherBuilder {
    fn default() -> Self {
        Self {
            needles: Vec::new(),
            ignore_case: true,
        }
    }
}
impl PatternMatcherBuilder {
    pub fn new() -> Self {
        Self::default()
    }

    pub fn add_needles(&mut self, needles: &[Needle]) -> &mut Self {
        self.needles.extend_from_slice(needles);
        self
    }

    pub fn ignore_case(&mut self, ignore_case: bool) -> &mut Self {
        self.ignore_case = ignore_case;
        self
    }

    pub fn build(&self) -> anyhow::Result<PatternMatcher> {
        let needles = self.needles.clone();

        let required_needles = needles
            .iter()
            .enumerate()
            .filter_map(|(idx, n)| if n.is_required() { Some(idx) } else { None })
            .collect::<BTreeSet<_>>();

        let matcher = aho_corasick::AhoCorasick::builder()
            .ascii_case_insensitive(self.ignore_case)
            .build(&needles)?;

        Ok(PatternMatcher {
            needles,
            required_needles,
            inner: matcher,
        })
    }
}
