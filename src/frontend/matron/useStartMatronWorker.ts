import { useEffect, useState } from "react";
import { MatronWorker } from "./MatronWorker";

export function useStartMatronWorker(): MatronWorker | null {
  const [state, setState] = useState<MatronWorker | null>(null);

  useEffect(() => {
    const start = Date.now();
    MatronWorker.start().then((worker) => {
      const dt = Date.now() - start;
      console.log(`Matron load took ${dt / 1000}s`);
      setState(worker);
    });
    return () => state?.shutdown();
  }, []);

  return state;
}
