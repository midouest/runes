import { useEffect, useState } from "react";
import { FallbackMatron } from "./FallbackMatron";
import { isOffscreenCanvas2dSupported } from "./isOffscreenCanvas2dSupported";
import { MatronProcess } from "./MatronProcess";

import { OffscreenMatron } from "./OffscreenMatron";

export function useStartMatronProcess(): MatronProcess | null {
  const [state, setState] = useState<MatronProcess | null>(null);

  useEffect(() => {
    const start = Date.now();

    let promise: Promise<MatronProcess>;
    if (isOffscreenCanvas2dSupported()) {
      console.log("OffscreenCanvas with CanvasRenderingContext2D is supported");
      console.log("Starting Matron on WebWorker");
      promise = OffscreenMatron.start();
    } else {
      console.log(
        "OffscreenCanvas with CanvasRenderingContext2D is not supported"
      );
      console.log("Starting Matron on main thread");
      promise = FallbackMatron.start();
    }

    promise.then((process) => {
      setState(process);
      const dt = Date.now() - start;
      console.log(`Matron load took ${dt / 1000}s`);
    });

    return () => state?.shutdown();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return state;
}
