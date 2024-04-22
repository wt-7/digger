mod extractors;
pub mod matcher;
pub use extractors::extract_text;
pub mod worker;
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn it_works() {
        ()
    }
}
