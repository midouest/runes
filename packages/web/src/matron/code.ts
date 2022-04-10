export function appendInit(code: string = ""): string {
  return `${code}
pcall(init)`;
}

export function appendRedraw(code: string = ""): string {
  return `${code}
screen.save()
pcall(redraw)
screen.restore()`;
}

export function callKey(n: number, isDown: boolean): string {
  const z = Number(isDown);
  return `pcall(key,${n},${z})`;
}

export function callEnc(n: number, d: number): string {
  return `pcall(enc,${n},${d})`;
}
