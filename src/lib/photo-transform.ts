export type PhotoRotation = 0 | 90 | 180 | 270;

export function photoTransformPlan(width: number, height: number, rotation: PhotoRotation, crop: boolean) {
  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
    throw new Error("Invalid image dimensions");
  }
  const sourceSize = crop ? Math.min(width, height) : null;
  const sx = sourceSize ? (width - sourceSize) / 2 : 0;
  const sy = sourceSize ? (height - sourceSize) / 2 : 0;
  const sw = sourceSize ?? width;
  const sh = sourceSize ?? height;
  const scale = Math.min(1, 2000 / Math.max(sw, sh));
  const drawWidth = Math.max(1, Math.round(sw * scale));
  const drawHeight = Math.max(1, Math.round(sh * scale));
  const swapSides = rotation === 90 || rotation === 270;
  return {
    sx,
    sy,
    sw,
    sh,
    drawWidth,
    drawHeight,
    canvasWidth: swapSides ? drawHeight : drawWidth,
    canvasHeight: swapSides ? drawWidth : drawHeight,
  };
}
