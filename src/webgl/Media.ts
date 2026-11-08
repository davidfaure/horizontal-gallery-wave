import gsap from "gsap";
import * as THREE from "three";
import { isPhone } from "../device";
import { frameRatio } from "../utils";
import vertexShader from "./shaders/vertex.glsl?raw";
import fragmentShader from "./shaders/fragment.glsl?raw";

// The phase covered by the wave across the screen (halved in the shader):
// about one sine period on a desktop, five eighths of one on a phone
const WAVE_FREQUENCY = isPhone ? Math.PI * 2.5 : Math.PI * Math.PI * 1.3;
// The ripple's clock, per frame at 60fps
const TIME_STEP = 0.02;
const FADE_DURATION = 0.5;
const FADE_EASE = "power2.out";

export interface MediaParams {
  element: HTMLElement;
  geometry: THREE.PlaneGeometry;
  scene: THREE.Scene;
  texture: Promise<THREE.Texture>;
  // Shared with the other planes, updated by GalleryGL on resize
  screen: THREE.Vector2;
  viewport: THREE.Vector2;
}

export class Media {
  private readonly element: HTMLElement;
  private readonly material: THREE.ShaderMaterial;
  private readonly mesh: THREE.Mesh;
  private readonly screen: THREE.Vector2;
  private readonly viewport: THREE.Vector2;
  // Where the figure sits with the gallery at 0, in pixels
  private left = 0;

  constructor({ element, geometry, scene, texture, screen, viewport }: MediaParams) {
    this.element = element;
    this.screen = screen;
    this.viewport = viewport;

    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      premultipliedAlpha: true,
      uniforms: {
        tMap: { value: null },
        uAlpha: { value: 0 },
        uTime: { value: 0 },
        uStrength: { value: 0 },
        uFrequency: { value: WAVE_FREQUENCY },
        uViewportSizes: { value: viewport },
      },
    });

    this.mesh = new THREE.Mesh(geometry, this.material);
    scene.add(this.mesh);

    void texture.then((map) => {
      this.material.uniforms.tMap!.value = map;
      gsap.to(this.material.uniforms.uAlpha!, {
        value: 1,
        duration: FADE_DURATION,
        ease: FADE_EASE,
      });
    });
  }

  // Once per resize: the only place that reads the layout
  resize(scroll: number) {
    const rect = this.element.getBoundingClientRect();

    // The gallery is translated by the scroll at this point
    this.left = rect.left - scroll;

    this.mesh.scale.set(
      (rect.width / this.screen.x) * this.viewport.x,
      (rect.height / this.screen.y) * this.viewport.y,
      1,
    );
    this.mesh.position.y =
      this.viewport.y / 2 - this.mesh.scale.y / 2 - (rect.top / this.screen.y) * this.viewport.y;
  }

  update(scroll: number, speed: number) {
    const uniforms = this.material.uniforms;
    uniforms.uTime!.value += TIME_STEP * frameRatio();
    uniforms.uStrength!.value = speed;

    const left = (this.left + scroll) / this.screen.x;
    this.mesh.position.x = -this.viewport.x / 2 + this.mesh.scale.x / 2 + left * this.viewport.x;
  }
}
