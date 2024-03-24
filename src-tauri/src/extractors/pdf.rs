use std::path::Path;

pub fn read_pdf<P: AsRef<Path>>(path: P) -> anyhow::Result<String> {
    // pdf_extract likes to panic a lot
    let path = path.as_ref();
    std::panic::catch_unwind(|| pdf_extract::extract_text(path).map_err(|e| e.into()))
        .map_err(|e| anyhow::anyhow!("pdf_extract panicked: {:?}", e))?
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::path::Path;

    #[test]
    fn read() {
        let f = read_pdf(Path::new("test/example.pdf")).unwrap();
        assert!(f.contains("Hello, World!"));
    }
}
