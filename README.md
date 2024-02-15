  <p align="center">
  <p align="center">
    <picture>
    <source media="(prefers-color-scheme: dark)" srcset="src/assets/digger-dark.svg">
    <source media="(prefers-color-scheme: light)" srcset="src/assets/digger-light.svg">
    <img alt="digger logo" src="src/assets/digger-dark.svg" width="300px">
    <picture/>

  </p>
  </p>
  <h1 align="center"><b>digger</b></h1>
  <p align="center">
    Fast and lightweight GUI text search tool for multiple file types.
    <br />
    <br />
  </p>
  </p>

   <picture>
    <source media="(prefers-color-scheme: dark)" srcset="src/assets/ui-dark.webp">
    <source media="(prefers-color-scheme: light)" srcset="src/assets/ui-light.webp">
    <img alt="digger logo" src="src/assets/digger-dark.svg" width="300px">
    <picture/>

## Stack

Framework: [Tauri](https://tauri.app/)

Backend: [Rust](https://www.rust-lang.org/)

Frontend: React ([TypeScript](https://www.typescriptlang.org))

Styling: Tailwind + shadcn/ui

## How fast?

_Unscientific testing_

For non-standard file types (e.g. docx), digger is around 2x faster than using ripgrep with a preprocessor.

For plain-text files, digger is about 1/2 as fast as ripgrep.
