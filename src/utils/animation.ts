export function advanceProgress(
  progress: number,
  elapsedMs: number,
  durationMs: number,
  speed: number,
) {
  if (durationMs <= 0 || speed <= 0) throw Error("Invalid animation timing");
  return Math.min(
    1,
    Math.max(0, progress) + (Math.max(0, elapsedMs) * speed) / durationMs,
  );
}
export function segmentProgress(
  progress: number,
  index: number,
  count: number,
  start = 0.28,
  end = 0.82,
) {
  return Math.max(
    0,
    Math.min(1, ((progress - start) / (end - start)) * count - index),
  );
}
