export function toRadians(degrees: number) {
  return (degrees * Math.PI) / 180;
}

export function lineLength(
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

export function lineAngle(
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number {
  const opp = y2 - y1;
  const adj = x2 - x1;
  if (opp === 0 && adj === 0) {
    return 0;
  }

  const rad = Math.atan(opp / adj);

  if (opp > 0) {
    if (adj > 0) {
      return rad;
    }
    return Math.PI + rad;
  } else {
    if (adj > 0) {
      return 2 * Math.PI + rad;
    }

    return Math.PI + rad;
  }
}
