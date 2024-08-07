use quick_xml::events::Event;
use std::fs::File;
use std::io::prelude::*;
use std::path::Path;
use zip::ZipArchive;

pub fn read_docx<P: AsRef<Path>>(path: P) -> anyhow::Result<String> {
    let path = path.as_ref();
    let file = File::open(path)?;

    let mut archive = ZipArchive::new(file)?;

    let mut doc = archive.by_name("word/document.xml")?;
    let mut xml_data = String::with_capacity(doc.size() as usize);
    doc.read_to_string(&mut xml_data)?;

    anyhow::ensure!(!xml_data.is_empty(), "File has no content");

    let mut xml_reader = quick_xml::reader::Reader::from_str(&xml_data);
    let mut buf = Vec::new();
    let mut txt = String::new();

    let mut to_read = false;
    loop {
        match xml_reader.read_event_into(&mut buf) {
            Ok(Event::Eof) => break,
            Ok(Event::Start(e)) => match e.name().as_ref() {
                b"w:p" => {
                    to_read = true;
                    txt.push('\n');
                }
                b"w:t" => to_read = true,
                _ => (),
            },
            Ok(Event::Text(e)) => {
                if to_read {
                    txt.push_str(e.unescape().unwrap().as_ref());
                    to_read = false;
                }
            }
            Err(e) => {
                let buffer_position = xml_reader.buffer_position();
                tracing::error!(?e, ?path, ?buffer_position, "Error reading docx");
                anyhow::bail!("Error reading docx")
            }

            _ => (),
        }
    }

    Ok(txt)
}
//todo: test
