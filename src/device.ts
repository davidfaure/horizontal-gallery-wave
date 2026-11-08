// A touch screen whose shortest side is under 768px: a phone, even in landscape
export const isPhone =
  window.matchMedia("(pointer: coarse)").matches &&
  Math.min(window.screen.width, window.screen.height) < 768;
