import { MutableRefObject, useEffect, useRef } from "react";
import { NornsScreen } from "./NornsScreen";

export function useScreen(
  loadCallback?: (screen: NornsScreen) => void
): MutableRefObject<NornsScreen | undefined> {
  const screenRef = useRef<NornsScreen | undefined>();

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
