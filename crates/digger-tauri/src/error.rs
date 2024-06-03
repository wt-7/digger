use serde::Serialize;

#[derive(Debug)]
pub struct Error(anyhow::Error);

pub type Result<T> = std::result::Result<T, Error>;

impl From<anyhow::Error> for Error {
    fn from(e: anyhow::Error) -> Self {
        Self(e)
    }
}

impl From<Error> for anyhow::Error {
    fn from(e: Error) -> Self {
        e.0
    }
}

impl Serialize for Error {
    fn serialize<S: serde::Serializer>(
        &self,
        serializer: S,
    ) -> std::result::Result<S::Ok, S::Error> {
        self.0.to_string().serialize(serializer)
    }
}
