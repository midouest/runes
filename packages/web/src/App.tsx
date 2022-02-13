import { Provider, useStartMatronProcess } from "./matron";
import { ScratchPad } from "./scratchpad";

export function App(): JSX.Element {
  const matron = useStartMatronProcess();

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
