import matronModuleFactory, { MatronEmscriptenModule } from "@runes/matron";
import { noop } from "../util/function";

// @ts-ignore
import matronDataUrl from "@runes/matron/dist/matron.data";
// @ts-ignore
import matronWasmUrl from "@runes/matron/dist/matron.wasm";

function locateFile(url: string): string {
  switch (url) {
    case "matron.wasm":
      return matronWasmUrl;

    case "matron.data":
      return matronDataUrl;

    default:
      return url;
  }
}

export function loadMatronModule(): Promise<MatronEmscriptenModule> {
  return matronModuleFactory({
    printErr: noop,
    locateFile,
  });
}
