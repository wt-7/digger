use std::path::Path;

mod docx;
mod pdf;

/// Read the contents of a file, choosing the appropriate reader based on the file extension.
pub fn read_file(path: &Path) -> anyhow::Result<String> {
    match path
        .extension()
        .and_then(|x| x.to_str())
        .unwrap_or_default()
    {
        "docx" => docx::read_docx(path),
        "pdf" => pdf::read_pdf(path),
        _ => std::fs::read_to_string(path).map_err(|e| e.into()),
    }
}
