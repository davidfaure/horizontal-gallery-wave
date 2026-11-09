# Horizontal Gallery Wave

A horizontal gallery driven by the wheel and by drag. Scroll fast and the images bend in a wave, in WebGL.

## Branches

| Branch   | What it shows                                                                 |
| -------- | ----------------------------------------------------------------------------- |
| `main`   | The gallery itself: markup, styles and images, no motion                      |
| `dom`    | The wheel and drag move the gallery, smoothed with a lerp                     |
| `webgl`  | Same scroll, the images are now WebGL planes that bend with the scroll speed  |
| `mobile` | What changes for phones: lighter textures, pixel ratio, wave length, pausing  |

Compare two steps:

```bash
git diff dom webgl
git diff webgl mobile
```

## How it works

- The DOM stays in charge. The scroll moves a plain `div` with a CSS transform, and the WebGL planes copy the position of their `figure` on every frame, from bounds measured once per resize.
- The scroll speed is the gap between where the gallery is going and where it is. That gap drives the wave (`uStrength` in `vertex.glsl`).
- The wave pushes the vertices towards the camera along a sine of their position on screen, so the bend travels across the images as they move.

## Frame

The title, branch and links around the demo live in `src/frame/` and aren't part of the effect. The text is in `src/frame/config.ts`, the branch comes from git when Vite starts, and the frame hides itself when the demo is embedded in an iframe.

## Getting started

```bash
npm install
npm run dev
```

## Stack

- TypeScript
- Vite
- GSAP (ticker and utilities)
- Three.js (`webgl` and `mobile` branches)
