# Runes [![continuous-integration](https://github.com/midouest/runes/actions/workflows/continuous-integration.yml/badge.svg)](https://github.com/midouest/runes/actions/workflows/continuous-integration.yml) [![pages-build-deployment](https://github.com/midouest/runes/actions/workflows/pages/pages-build-deployment/badge.svg)](https://github.com/midouest/runes/actions/workflows/pages/pages-build-deployment)

Norns screen live-coding

🚧 Work-in-progress 🚧

[Live Demo](https://midouest.github.io/runes/)

## Development

Tested on macOS 12.1+ and Ubuntu 20.04.3+. Windows is not supported, but Ubuntu
running in WSL2 works.

### Requirements

- Node.js (14.18.2+)
- Yarn (1.22.17+)
- CMake (3.16.3+)
- Emscripten (3.1.1+)
- pkg-config (0.29.2+)

A Dockerfile is provided for quickly setting up a compatible development
environment.

### Recommended Chrome Extensions

- [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)
- [C/C++ DevTools Support \(Dwarf\)](https://chrome.google.com/webstore/detail/cc%20%20-devtools-support-dwa/pdcpmagijalfljmkmjngeonclgbbannb)

### Setup (Docker)

Build the Docker image:

```bash
$ yarn docker-image
```

Setup dependencies:

```bash
$ yarn docker-setup
```

Start the development server:

```bash
$ yarn docker-start
```

Start an interactive shell:

```bash
$ yarn docker
```

### Setup (Local)

Setup dependencies:

```bash
$ yarn setup
```

Start the development server:

```bash
$ yarn start
```

### Deploy

Deploy via GitHub Pages:

```bash
$ yarn deploy
```
