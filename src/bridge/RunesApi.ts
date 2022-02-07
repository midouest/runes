import { ipcRenderer } from "electron";

import { RunesApiBridge } from "./interface";

export const RunesApi: RunesApiBridge = {
  connect(host: string, port: number): void {
    ipcRenderer.send("connect", host, port);
  },

  eval(statement: string): void {
    ipcRenderer.send("eval", statement);
  },
};
