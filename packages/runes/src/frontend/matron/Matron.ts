import matronModuleFactory, { MatronEmscriptenModule } from "@runes/matron";
import { createMatronApi, MatronApi } from "./MatronApi";

const SCREEN_WIDTH = 128;
const SCREEN_HEIGHT = 64;
const SCREEN_BYTES_PER_PIXEL = 4;
const SCREEN_BYTE_SIZE = SCREEN_WIDTH * SCREEN_HEIGHT * SCREEN_BYTES_PER_PIXEL;

export class Matron {
  static async load(): Promise<Matron> {
    const wasm = await matronModuleFactory();
    const api = createMatronApi(wasm);
    return new Matron(wasm, api);
  }

  constructor(private _wasm: MatronEmscriptenModule, private _api: MatronApi) {
    this._api.config.init();
    this._api.weaver.init();
    this._api.weaver.startup();
  }

  cleanup(): void {
    this._api.weaver.deinit();
    this._api.config.deinit();
  }

  reset(): void {
    this._api.weaver.reset();
  }

  exec(code: string): void {
    this._api.weaver.runCode(code);
  }

  execLine(code: string): void {
    this._api.weaver.handleExecCodeLine(code);
  }

  getScreen(): Uint8ClampedArray {
    const ptr = this._api.screen.getData();
    return new Uint8ClampedArray(
      this._wasm.HEAPU8.buffer,
      ptr,
      SCREEN_BYTE_SIZE
    );
  }

  isDirty(): boolean {
    return this._api.screen.dirty();
  }
}
