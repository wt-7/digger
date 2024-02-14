#[derive(serde::Serialize, Debug, serde::Deserialize, Clone, PartialEq, Eq)]
pub struct Needle {
    pattern: String,
    required: bool,
}

// Required for AhoCorasick
impl AsRef<[u8]> for Needle {
    fn as_ref(&self) -> &[u8] {
        self.pattern.as_bytes()
    }
}

impl Needle {
    pub fn is_required(&self) -> bool {
        self.required
    }

    pub fn pattern(&self) -> &str {
        &self.pattern
    }
}
