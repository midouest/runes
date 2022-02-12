import { MutableRefObject, useEffect, useRef } from "react";

export function useAnimation(
  callback: FrameRequestCallback
): MutableRefObject<number | null> {
  const animationRef = useRef<number | null>(null);

  const animate = (dt: number) => {
    callback(dt);
    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return animationRef;
}
