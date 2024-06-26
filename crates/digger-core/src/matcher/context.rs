const MAX_CONTEXT_LENGTH: usize = 20;
const MAX_PREFIX_WHITE_SPACE: usize = 2;
const MAX_POSTFIX_WHITESPACE: usize = 3;

/// The context surrounding a match in a haystack. The infix is the match itself, with the surrounding
/// postfix and prefix built from the haystack.
#[derive(serde::Serialize, Debug)]
pub struct Context {
    line: usize,
    prefix: String,
    infix: String,
    postfix: String,
}

impl Context {
    pub(crate) fn from_haystack(
        haystack: &str,
        match_start: usize,
        match_end: usize,
        line: usize,
    ) -> Self {
        let prefix = build_prefix(haystack, match_start);
        // The infix should always be in bounds
        let infix = haystack[match_start..match_end].to_owned();
        let postfix = build_postfix(haystack, match_end);

        Self {
            line,
            prefix,
            infix,
            postfix,
        }
    }
    #[cfg(test)]
    pub fn line(&self) -> usize {
        self.line
    }
    #[cfg(test)]
    pub fn prefix(&self) -> &str {
        &self.prefix
    }
    #[cfg(test)]
    pub fn infix(&self) -> &str {
        &self.infix
    }
    #[cfg(test)]
    pub fn postfix(&self) -> &str {
        &self.postfix
    }
}

/// Builds the prefix of a match context. Given the start index of the match in the haystack,
/// it will iterate backwards from the start index and collect characters until
/// it reaches the maximum length or the maximum number of whitespace characters.
fn build_prefix(haystack: &str, infix_start: usize) -> String {
    let mut whitespace_count = 0;
    let pre = haystack[..infix_start]
        .chars()
        .rev()
        .take(MAX_CONTEXT_LENGTH)
        .take_while(|c| {
            if c == &'\n' {
                return false;
            }

            if c.is_whitespace() {
                whitespace_count += 1;
            }
            whitespace_count <= MAX_PREFIX_WHITE_SPACE
        })
        .collect::<String>();

    pre.trim_end().chars().rev().collect()
}

/// Builds the postfix of a match context. Given the end index of the match in the haystack,
/// it will iterate from end index and collect characters until it reaches the maximum length
/// or the maximum number of whitespace characters.
fn build_postfix(haystack: &str, postfix_start: usize) -> String {
    let mut whitespace_count = 0;
    haystack[postfix_start..]
        .chars()
        .take(MAX_CONTEXT_LENGTH)
        .take_while(|c| {
            if c == &'\n' {
                return false;
            }

            if c.is_whitespace() {
                whitespace_count += 1;
            }
            whitespace_count <= MAX_POSTFIX_WHITESPACE
        })
        .collect()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_build_prefix_works() {
        let haystack = "The quick brown fox jumps over the lazy dog";
        let prefix1 = build_prefix(haystack, 20);
        assert_eq!(prefix1, "brown fox ");
    }

    #[test]
    fn test_build_prefix_works_no_prefix() {
        let haystack = "The quick brown fox jumps over the lazy dog";
        let prefix1 = build_prefix(haystack, 0);
        assert_eq!(prefix1, "");
    }

    #[test]
    fn test_build_prefix_terminates_on_newline() {
        let haystack = "01234\n6789";
        let prefix = build_prefix(haystack, 8);
        assert_eq!(prefix, "67");
    }

    #[test]
    fn test_build_postfix_works() {
        let haystack = "The quick brown fox jumps over the lazy dog";
        let postfix = build_postfix(haystack, 25);
        assert_eq!(postfix, " over the lazy");
    }

    #[test]
    fn test_build_postfix_works_no_postfix() {
        let haystack = "The quick brown fox jumps over the lazy dog";
        let postfix = build_postfix(haystack, 43);
        assert_eq!(postfix, "");
    }

    #[test]
    fn test_build_postfix_terminates_on_newline() {
        let haystack = "01234\n6789";
        let postfix = build_postfix(haystack, 2);
        assert_eq!(postfix, "234");
    }

    #[test]
    fn test_context_works() {
        let haystack = "The quick brown fox jumps over the lazy dog";
        let line = 0;
        let context = Context::from_haystack(haystack, 20, 25, line);

        assert_eq!(context.prefix, "brown fox ");
        assert_eq!(context.infix, "jumps");
        assert_eq!(context.postfix, " over the lazy");
    }
}
