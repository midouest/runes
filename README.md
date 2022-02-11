# runes

🚧 Work-in-progress 🚧

## Development

### Requirements

- Node.js (17.3.1)
- Yarn (1.22.17)
- CMake (3.22.1)
- Emscripten (3.1.1)

### Setup

Install/checkout dependencies:

```bash
$ git submodule init
$ git submodule update
$ yarn install
```

Compile Matron to WebAssembly:

```bash
$ yarn configure-matron
$ yarn build-matron
```

Start the development server:

```bash
$ yarn start
```

Build a standalone executable:

```bash
$ yarn make
```
