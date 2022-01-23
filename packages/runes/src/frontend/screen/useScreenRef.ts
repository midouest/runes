import { MutableRefObject, useEffect, useRef } from "react";
import { NornsScreen } from "./NornsScreen";

export function useScreenRef(
  loadCallback?: (screen: NornsScreen) => void
): MutableRefObject<NornsScreen | null> {
  const screenRef = useRef<NornsScreen | null>(null);

  useEffect(() => {
    NornsScreen.load()
      .then((screen) => {
        screenRef.current = screen;
        return screen;
      })
      .then(loadCallback);

    return () => screenRef.current?.delete();
  }, []);

  return screenRef;
}
