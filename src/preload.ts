import { contextBridge } from "electron";

import { RunesApi } from "./bridge/RunesApi";

contextBridge.exposeInMainWorld("runesApi", RunesApi);
