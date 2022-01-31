import { MatronEmscriptenModule } from "../../../matron/build/matron";

export interface ConfigApi {
  init(): null;
  deinit(): null;
}

export interface WeaverApi {
  init(): null;
  deinit(): null;
  startup(): null;
  reset(): null;
  runCode(code: string): null;
  handleExecCodeLine(code: string): null;
}

export interface ScreenApi {
  getData(): number;
  dirty(): boolean;
}

export interface MatronApi {
  config: ConfigApi;
  weaver: WeaverApi;
  screen: ScreenApi;
}

export function createMatronApi(wasm: MatronEmscriptenModule): MatronApi {
  const config: ConfigApi = {
    init: wasm.cwrap("config_init", null, []),
    deinit: wasm.cwrap("config_deinit", null, []),
  };

  const weaver: WeaverApi = {
    init: wasm.cwrap("w_init", null, []),
    startup: wasm.cwrap("w_startup", null, []),
    reset: wasm.cwrap("w_reset_lvm", null, []),
    deinit: wasm.cwrap("w_deinit", null, []),
    runCode: wasm.cwrap("w_run_code", null, ["string"]),
    handleExecCodeLine: wasm.cwrap("w_handle_exec_code_line", null, ["string"]),
  };

  const screen: ScreenApi = {
    getData: wasm.cwrap("screen_get_data", "number", []),
    dirty: wasm.cwrap("screen_dirty", "boolean", []),
  };

  return {
    config,
    weaver,
    screen,
  };
}
