import React from "react";
import { useLoadMatron, Provider } from "./matron";
import { ScratchPad } from "./scratchpad/ScratchPad";

export function App(): JSX.Element {
  const matron = useLoadMatron();
  const handleConnect = () => runesApi.connect("norns.local", 5555);

  return (
    <div>
      {matron === null ? (
        "Loading Matron..."
      ) : (
        <Provider matron={matron}>
          <button onClick={handleConnect}>Connect</button>
          <button onClick={() => matron.reset()}>Reset</button>
          <ScratchPad />
        </Provider>
      )}
    </div>
  );
}
