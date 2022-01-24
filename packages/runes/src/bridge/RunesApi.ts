import { ipcRenderer } from "electron";
import { RunesApiBridge } from "./interface";

export const RunesApi: RunesApiBridge = {
  eval(statement: string): void {
    ipcRenderer.send("eval", statement);
  },
};
