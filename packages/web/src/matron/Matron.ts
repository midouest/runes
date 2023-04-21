import { MatronEmscriptenModule } from "@runes/matron";

import { createMatronBinding } from "./MatronBinding";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "./constants";

const SCREEN_BYTES_PER_PIXEL = 4;
const SCREEN_BYTE_SIZE = SCREEN_WIDTH * SCREEN_HEIGHT * SCREEN_BYTES_PER_PIXEL;

export class Matron {
  private _binding = createMatronBinding(this._wasm);

  constructor(private _wasm: MatronEmscriptenModule) {
    this._init();
  }

  private _init(): void {
    this._binding.config.init();
    this._binding.weaver.init();
    this._binding.weaver.startup();
  }

  deinit(): void {
    this._binding.weaver.deinit();
    this._binding.config.deinit();
  }

  restart(): void {
    this.deinit();
    this._init();
  }

  reset(): void {
    this._binding.weaver.reset();
  }

  exec(code: string): void {
    this._binding.weaver.runCode(code);
  }

  execLine(code: string): void {
    this._binding.weaver.handleExecCodeLine(code);
  }

  getScreen(): Uint8ClampedArray {
    const ptr = this._binding.screen.getData();
    return new Uint8ClampedArray(
      this._wasm.HEAPU8.buffer,
      ptr,
      SCREEN_BYTE_SIZE
    );
  }

  isDirty(): boolean {
    return this._binding.screen.dirty();
  }
}
