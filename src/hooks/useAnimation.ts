import { useEffect, useState } from "react";
import { advanceProgress } from "../utils/animation";
export function useAnimation(key: string, duration = 10000) {
  const [progress, setProgress] = useState(0),
    [playing, setPlaying] = useState(false),
    [speed, setSpeed] = useState(1);
  useEffect(() => {
    setProgress(0);
    setPlaying(false);
  }, [key]);
  useEffect(() => {
    if (!playing) return;
    let frame = 0,
      last = performance.now();
    const tick = (now: number) => {
      const elapsed = Math.min(100, now - last);
      last = now;
      setProgress((p) => advanceProgress(p, elapsed, duration, speed));
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing, speed, duration]);
  useEffect(() => {
    if (progress >= 1) setPlaying(false);
  }, [progress]);
  return {
    progress,
    playing,
    speed,
    setSpeed,
    play: () => {
      if (progress >= 1) setProgress(0);
      setPlaying(true);
    },
    pause: () => setPlaying(false),
    reset: () => {
      setPlaying(false);
      setProgress(0);
    },
    replay: () => {
      setProgress(0);
      setPlaying(true);
    },
  };
}
