import gsap from "gsap";

// 1 at 60Hz, 0.5 at 120Hz. Capped so a stalled frame can't make things jump.
export const frameRatio = () => Math.min(gsap.ticker.deltaRatio(60), 4);

// A per-frame lerp tuned at 60Hz, made independent of the refresh rate
export const damp = (current: number, target: number, amount: number, ratio = frameRatio()) =>
  gsap.utils.interpolate(current, target, 1 - Math.pow(1 - amount, ratio));
