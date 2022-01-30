import React from "react";
import { Provider, useStartMatronWorker } from "./matron";
import { ScratchPad } from "./scratchpad/ScratchPad";

export function App(): JSX.Element {
  const matron = useStartMatronWorker();

  const handleConnect = () => runesApi.connect("norns.local", 5555);
  const restart = () => matron?.restart();
  const reset = () => matron?.reset();

  return (
    <div>
      {matron === null ? (
        "Starting Matron..."
      ) : (
        <Provider matron={matron}>
          <button onClick={handleConnect}>Connect Norns</button>
          <button onClick={reset}>Reset Lua VM</button>
          <button onClick={restart}>Restart Matron</button>
          <ScratchPad />
        </Provider>
      )}
    </div>
  );
}
