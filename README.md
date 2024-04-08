<div align="center">
   <img align="center" width="128px" src="src-tauri/icons/128x128@2x.png" />
	<h1 align="center"><b>Digger</b></h1>
	<p align="center">
		Cross platform text search tool for multiple file types
  </p>
</div>

![client](https://github.com/wt-7/digger/assets/97180065/2b38d5d0-182f-4f25-9052-6dd47997745d)

<br/>

Digger is a GUI text search tool that allows you to search for keyword matches in the contents of your files. Digger supports proprietary file types such as pdf and docx, as well as common text-based file types such as txt, md, rs, tsx, etc...

## Features

- **Fast (🔥)**
  - Multi-threaded searching and directory traversal
- **Required/optional search terms**
  - Instead of constructing regex queries, searches are done by specifying optional and required keywords. This provides some of the flexibility of regex, without the complexity.
- **Previews**
  - Quickly view the context of the match, or view the entire file with syntax highlighting

## Performance

_Unscientific benchmark_

Comparing Digger to ripgrep: searching for "hello" or "world" in rust files from the home directory. The results are returned sorted.

---

**Digger**

- Extensions: rs
- "hello" -optional
- "world" -optional

**Ripgrep**

```shell
$ rg "hello|world" -trust -sort path --stats
```

---

**Digger time taken: 0.45s**

**Ripgrep time taken: 0.75s**

This is a quite a biased comparison, as ripgrep is using a regex engine, whereas Digger only uses [aho-corasick](https://github.com/BurntSushi/aho-corasick). Additionally, ripgrep does not sort it's output by default, and sorting will cause a performance penalty.

## Tech Stack

Digger is a [Tauri](https://github.com/tauri-apps/tauri) based application. The frontend is built with [React](https://github.com/facebook/react) + [TypeScript](https://github.com/microsoft/TypeScript), and the backend is written in [Rust](https://github.com/rust-lang/rust).
