# runes

🚧 Work-in-progress 🚧

## Development

Tested on macOS 12.1 and Ubuntu 20.04.3 LTS. Windows is not supported, but
Ubuntu running in WSL2 works.

### Requirements

- Node.js (14.18.2+)
- Yarn (1.22.17+)
- CMake (3.16.3+)
- Emscripten (3.1.1+)

### Recommended Chrome Extensions

- [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)
- [C/C++ DevTools Support \(Dwarf\)](https://chrome.google.com/webstore/detail/cc%20%20-devtools-support-dwa/pdcpmagijalfljmkmjngeonclgbbannb)

### Setup

Install/checkout dependencies:

```bash
$ git submodule init
$ git submodule update
$ yarn install
```

Compile Matron to WebAssembly:

```bash
$ yarn workspace @runes/matron configure
$ yarn workspace @runes/matron build
```

Start the development server:

```bash
$ yarn workspace @runes/web start
```
