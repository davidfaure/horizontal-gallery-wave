uniform sampler2D tMap;
uniform float uAlpha;

varying vec2 vUv;

void main() {
  vec4 color = texture2D(tMap, vUv);

  // Premultiplied, so the fade-in has no dark edges
  gl_FragColor = vec4(color.rgb * uAlpha, uAlpha);
}
