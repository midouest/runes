import { MatronEmscriptenModule } from "@runes/matron";

export interface ConfigBinding {
  init(): null;
  deinit(): null;
}

export interface WeaverBinding {
  init(): null;
  deinit(): null;
  startup(): null;
  reset(): null;
  runCode(code: string): null;
  handleExecCodeLine(code: string): null;
}

export interface ScreenBinding {
  getData(): number;
  dirty(): boolean;
}

export interface MatronBinding {
  config: ConfigBinding;
  weaver: WeaverBinding;
  screen: ScreenBinding;
}

export function createMatronBinding(
  wasm: MatronEmscriptenModule
): MatronBinding {
  const config: ConfigBinding = {
    init: wasm.cwrap("config_init", null, []),
    deinit: wasm.cwrap("config_deinit", null, []),
  };

  const weaver: WeaverBinding = {
    init: wasm.cwrap("w_init", null, []),
    startup: wasm.cwrap("w_startup", null, []),
    reset: wasm.cwrap("w_reset_lvm", null, []),
    deinit: wasm.cwrap("w_deinit", null, []),
    runCode: wasm.cwrap("w_run_code", null, ["string"]),
    handleExecCodeLine: wasm.cwrap("w_handle_exec_code_line", null, ["string"]),
  };

  const screen: ScreenBinding = {
    getData: wasm.cwrap("screen_get_data", "number", []),
    dirty: wasm.cwrap("screen_dirty", "boolean", []),
  };

  return {
    config,
    weaver,
    screen,
  };
}
