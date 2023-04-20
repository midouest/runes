/// <reference types="emscripten" />

export interface MatronEmscriptenModule extends EmscriptenModule {
  cwrap: typeof cwrap;
}

declare const matronModuleFactory: EmscriptenModuleFactory<MatronEmscriptenModule>;

export default matronModuleFactory;
