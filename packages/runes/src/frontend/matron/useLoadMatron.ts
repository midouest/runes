import { useEffect, useState } from "react";
import { Matron } from "./Matron";

export type LoadMatronCallback = (matron: Matron) => void;

export function useLoadMatron(callback?: LoadMatronCallback): Matron | null {
  const [state, setState] = useState<Matron | null>(null);

  useEffect(() => {
    const start = Date.now();
    Matron.load().then((matron) => {
      const dt = Date.now() - start;
      console.log(`Matron load took ${dt / 1000}s`);
      setState(matron);
      if (callback) {
        callback(matron);
      }
    });

    return () => {
      if (state !== null) {
        state.deinit();
      }
    };
  }, []);

  return state;
}
