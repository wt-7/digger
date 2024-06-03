use aho_corasick::AhoCorasick;
use line_numbers::LinePositions;
use std::collections::{BTreeMap, BTreeSet};
mod context;
mod needle;
use context::Context;

pub use needle::Needle;

pub(crate) type Matches = BTreeMap<String, Vec<Context>>;
pub struct PatternMatcher {
    needles: Vec<Needle>,
    // Required needles is a set of indexes into the needles vector.
    // This is used to ensure that all required needles are matched.
    required_needles: BTreeSet<usize>,
    inner: AhoCorasick,
}

impl PatternMatcher {
    /// Find the matches in the given contents. If the contents do not contain all of the required needles,
    /// it will be considered a non-match.
    pub(crate) fn compute_match(&self, contents: &str) -> Option<Matches> {
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

        let not_all_required_needles_matched =
            required_needles != self.required_needles && !matches.is_empty();

        if not_all_required_needles_matched || matches.is_empty() {
            return None;
        }

        Some(matches)
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
        let required_needles = self
            .needles
            .iter()
            .enumerate()
            .filter_map(|(idx, n)| if n.is_required() { Some(idx) } else { None })
            .collect::<BTreeSet<_>>();

        let matcher = aho_corasick::AhoCorasick::builder()
            .ascii_case_insensitive(self.ignore_case)
            .build(&self.needles)?;

        Ok(PatternMatcher {
            needles: self.needles.clone(),
            required_needles,
            inner: matcher,
        })
    }
}

#[cfg(test)]

mod tests {
    use super::{Needle, PatternMatcherBuilder};

    #[test]
    fn test_pattern_matcher_works() {
        let text = "Lorem ipsum dolor sit amet,
        consectetur adipiscing elit,
        sed do eiusmod tempor incididunt
        ut labore et dolore magna aliqua";

        let needles = vec![Needle::new("lorem", false), Needle::new("dolor", false)];

        let matcher = PatternMatcherBuilder::new()
            .add_needles(&needles)
            .build()
            .unwrap();

        let matches = matcher.compute_match(text).unwrap();

        assert_eq!(matches.len(), 2);

        let lorem_ctx = &matches["lorem"][0];
        let dolor_ctx_1 = &matches["dolor"][0];
        let dolor_ctx_2 = &matches["dolor"][1];

        assert_eq!(lorem_ctx.line(), 1);
        assert_eq!(lorem_ctx.prefix(), "");
        assert_eq!(lorem_ctx.infix(), "Lorem");
        assert_eq!(lorem_ctx.postfix(), " ipsum dolor sit");

        assert_eq!(dolor_ctx_1.line(), 1);
        assert_eq!(dolor_ctx_1.prefix(), "Lorem ipsum ");
        assert_eq!(dolor_ctx_1.infix(), "dolor");
        assert_eq!(dolor_ctx_1.postfix(), " sit amet,");

        assert_eq!(dolor_ctx_2.line(), 4);
        assert_eq!(dolor_ctx_2.prefix(), "labore et ");
        assert_eq!(dolor_ctx_2.infix(), "dolor");
        assert_eq!(dolor_ctx_2.postfix(), "e magna aliqua");
    }

    #[test]
    fn test_pattern_matcher_works_case_sensitive() {
        let text = "Lorem ipsum dolor sit amet,
        consectetur adipiscing elit,
        sed do eiusmod tempor incididunt
        ut labore et Dolore magna aliqua";

        let needles = vec![Needle::new("lorem", false), Needle::new("dolor", false)];

        let matcher = PatternMatcherBuilder::new()
            .add_needles(&needles)
            .ignore_case(false)
            .build()
            .unwrap();

        let matches = matcher.compute_match(text).unwrap();

        assert_eq!(matches.len(), 1);

        let dolor_ctx = &matches["dolor"][0];

        assert_eq!(dolor_ctx.line(), 1);
        assert_eq!(dolor_ctx.prefix(), "Lorem ipsum ");
        assert_eq!(dolor_ctx.infix(), "dolor");
        assert_eq!(dolor_ctx.postfix(), " sit amet,");
    }
    #[test]
    fn test_pattern_matcher_returns_none_when_required_needle_is_missing() {
        let text = "Lorem ipsum dolor sit amet,
        consectetur adipiscing elit,
        sed do eiusmod tempor incididunt
        ut labore et dolore magna aliqua";

        let needles = vec![
            Needle::new("not in the text", true),
            Needle::new("dolor", true),
        ];

        let matcher = PatternMatcherBuilder::new()
            .add_needles(&needles)
            .build()
            .unwrap();

        let matches = matcher.compute_match(text);

        assert!(matches.is_none());
    }

    #[test]
    fn test_pattern_matcher_works_when_optional_needle_is_missing() {
        let text = "Lorem ipsum dolor sit amet,
        consectetur adipiscing elit,
        sed do eiusmod tempor incididunt
        ut labore et dolore magna aliqua";

        let needles = vec![
            Needle::new("not in the text", false),
            Needle::new("dolor", true),
        ];

        let matcher = PatternMatcherBuilder::new()
            .add_needles(&needles)
            .build()
            .unwrap();

        let matches = matcher.compute_match(text);

        assert!(matches.is_some());
    }
}
