uniform float uTime;
uniform float uStrength;
uniform float uFrequency;
uniform vec2 uViewportSizes;

varying vec2 vUv;

void main() {
  vUv = uv;

  vec3 p = position;

  // A slow ripple that never stops, in the plane's own space
  p.z = (sin(p.x * 4.0 + uTime) * 0.5 + cos(p.y * 2.0 + uTime) * 0.5) * 0.1;

  vec4 viewPosition = modelViewMatrix * vec4(p, 1.0);

  // The wave: each vertex comes towards the camera along a sine of its position
  // on screen, as far as the scroll speed allows
  viewPosition.z += sin(viewPosition.x / uViewportSizes.x * uFrequency / 2.0) * abs(uStrength);

  gl_Position = projectionMatrix * viewPosition;
}
