// Everything the frame says about this effect: the same file on every branch
export const frame = {
  title: "Horizontal Gallery Wave",
  // The tutorial is at davidfaure.eu/lab/<slug>
  slug: "horizontal-gallery-wave",
  repo: "https://github.com/davidfaure/horizontal-gallery-wave",
  // Branch -> its full-screen demo at davidfaure.eu/demos/<demo>/, in the order of the steps
  steps: {
    dom: "horizontal-gallery-dom",
    webgl: "horizontal-gallery-webgl",
    mobile: "horizontal-gallery-wave",
  } as Record<string, string>,
  tags: ["webgl", "three.js", "gsap", "shaders", "scroll", "mobile"],
  // Empty until the effect ships in Alcide
  alcide: "",
};
