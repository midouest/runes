import { contextBridge } from "electron";

contextBridge.exposeInMainWorld("runesApi", {});
