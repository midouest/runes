import * as fs from "fs/promises";
import * as path from "path";
import { rest } from "msw";

let matronWasm: Buffer | undefined;

export const handlers = [
  rest.get("/matron.wasm", async (_req, res, ctx) => {
    if (!matronWasm) {
      const wasmPath = path.join(__dirname, "../../matron/dist/matron.wasm");
      matronWasm = await fs.readFile(wasmPath);
    }

    return res(ctx.status(200), ctx.body(matronWasm));
  }),
];
