const MAX_CONTEXT_WHITESPACE: usize = 3;
const MAX_CONTEXT_LENGTH: usize = 30;

#[derive(serde::Serialize, Debug)]
pub struct Context {
    prefix: String,
    infix: String,
    postfix: String,
}

impl Context {
    pub fn from_haystack(haystack: &str, match_start: usize, match_end: usize) -> Self {
        let prefix = build_prefix(haystack, match_start);
        // Infix should always be valid
        let infix = haystack[match_start..match_end].to_owned();
        let postfix = build_postfix(haystack, match_end);

        Self {
            prefix,
            infix,
            postfix,
        }
    }
}

pub fn build_prefix(haystack: &str, start: usize) -> String {
    let mut whitespace_count = 0;
    let pre = haystack[..start]
        .chars()
        .rev()
        .take(MAX_CONTEXT_LENGTH)
        .take_while(|c| {
            if c.is_whitespace() {
                whitespace_count += 1;
            }
            whitespace_count <= MAX_CONTEXT_WHITESPACE
        })
        .collect::<String>();

    pre.chars().rev().collect()
}

pub fn build_postfix(haystack: &str, end: usize) -> String {
    let mut whitespace_count = 0;
    haystack[end..]
        .chars()
        .take(MAX_CONTEXT_LENGTH)
        .take_while(|c| {
            if c.is_whitespace() {
                whitespace_count += 1;
            }
            whitespace_count < MAX_CONTEXT_WHITESPACE
        })
        .collect()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_prefix() {
        let haystack = "The quick brown fox jumps over the lazy dog";

        let prefix1 = build_prefix(haystack, 20);

        assert_eq!(prefix1, "quick brown fox ");
    }

    #[test]
    fn test_postfix() {
        let haystack = "The quick brown fox jumps over the lazy dog";

        let postfix = build_postfix(haystack, 25);

        assert_eq!(postfix, " over the");
    }

    #[test]
    fn test_context() {
        let haystack = "The quick brown fox jumps over the lazy dog";

        let context = Context::from_haystack(haystack, 20, 25);

        assert_eq!(context.prefix, "quick brown fox ");
        assert_eq!(context.infix, "jumps");
        assert_eq!(context.postfix, " over the");
    }
}
