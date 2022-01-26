export interface MatronEmscriptenModule extends EmscriptenModule {
  cwrap: typeof cwrap;
}

declare var matronModuleFactory: EmscriptenModuleFactory<MatronEmscriptenModule>;

export default matronModuleFactory;
