import * as path from "path";
import matronModuleFactory from "@runes/matron";
import { noop } from "../util/function";
import { createCanvas, createImageData } from "canvas";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "./constants";
import { Matron } from "./Matron";

class TestMatron {
  static async load(): Promise<TestMatron> {
    const wasm = await matronModuleFactory({
      printErr: noop,
      locateFile(url) {
        switch (url) {
          case "matron.wasm":
            return url;

          case "matron.data":
            return path.join(__dirname, "../../../matron/dist", url);

          default:
            return url;
        }
      },
    });
    const matron = new Matron(wasm);
    return new TestMatron(matron);
  }

  private _canvas = createCanvas(SCREEN_WIDTH, SCREEN_HEIGHT);

  constructor(private _matron: Matron) {}

  restart(): void {
    this._matron.restart();
  }

  draw(code: string): Buffer {
    this._matron.exec(`
screen.save()
screen.clear()
${code}
screen.update()
screen.restore()
    `);
    const screen = this._matron.getScreen();
    const imageData = createImageData(screen, SCREEN_WIDTH, SCREEN_HEIGHT);
    const context = this._canvas.getContext("2d");
    context.putImageData(imageData, 0, 0);
    const buffer = this._canvas.toBuffer("image/png");
    return buffer;
  }
}

export class MatronTestHarness {
  private _matron: TestMatron | undefined;

  async setUp(): Promise<void> {
    if (this._matron) {
      this._matron.restart();
      return;
    }

    this._matron = await TestMatron.load();
  }

  draw(code: string): Buffer | undefined {
    if (!this._matron) {
      throw new Error("MatronTestHarness has not been set up");
    }
    return this._matron.draw(code);
  }
}
