export function isOffscreenCanvas2dSupported(): boolean {
  const testCanvas = document.createElement("canvas");

  if (typeof testCanvas.transferControlToOffscreen !== "function") {
    return false;
  }

  const offscreen = testCanvas.transferControlToOffscreen();
  try {
    const context = offscreen.getContext("2d");
    return context !== null;
  } catch (err) {
    return false;
  }
}
