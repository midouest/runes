import React from "react";
import { useLoadMatron, Provider } from "./matron";
import { ScratchPad } from "./scratchpad/ScratchPad";

export function App(): JSX.Element {
  const matron = useLoadMatron();

  const handleConnect = () => runesApi.connect("norns.local", 5555);
  const restart = () => matron?.restart();
  const reset = () => matron?.reset();

  return (
    <div>
      {matron === null ? (
        "Loading Matron..."
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
