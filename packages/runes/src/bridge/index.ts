import { RunesApiBridge } from "./interface";

declare global {
  const runesApi: RunesApiBridge;

  interface Window {
    runesApi: RunesApiBridge;
  }
}
