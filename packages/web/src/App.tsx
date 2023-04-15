import { Provider, useStartMatronProcess } from "./matron";
import { ScratchPad } from "./scratchpad";

export function App(): JSX.Element {
  const matron = useStartMatronProcess();

  return (
    <>
      {matron === null ? (
        "Starting Matron..."
      ) : (
        <Provider matron={matron}>
          <ScratchPad />
        </Provider>
      )}
    </>
  );
}
