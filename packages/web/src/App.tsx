import React from "react";

import { Provider, useStartMatronWorker } from "./matron";
import { ScratchPad } from "./scratchpad";

export function App(): JSX.Element {
  const matron = useStartMatronWorker();

  return (
    <div>
      {matron === null ? (
        "Starting Matron..."
      ) : (
        <Provider matron={matron}>
          <ScratchPad />
        </Provider>
      )}
    </div>
  );
}
