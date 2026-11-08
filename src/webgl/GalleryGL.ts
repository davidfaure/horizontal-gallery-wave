import gsap from "gsap";
import * as THREE from "three";
import { Media } from "./Media";

const FOV = 45;
const CAMERA_Z = 5;
const MAX_PIXEL_RATIO = 2;

// All the WebGL side needs from the scroll, read on every frame
export interface ScrollState {
  readonly current: number;
  readonly speed: number;
}

export class GalleryGL {
  private readonly scroll: ScrollState;
  private readonly renderer: THREE.WebGLRenderer;
  private readonly scene = new THREE.Scene();
  private readonly camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 100);
  // One geometry for every plane: 50 columns, 100 rows
  private readonly geometry = new THREE.PlaneGeometry(1, 1, 50, 100);
  private readonly medias: Media[];
  // The screen in pixels, and what the camera sees at z = 0 in scene units
  private readonly screen = new THREE.Vector2();
  private readonly viewport = new THREE.Vector2();

  constructor(scroll: ScrollState, figures: HTMLElement[]) {
    this.scroll = scroll;

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, MAX_PIXEL_RATIO));
    this.renderer.domElement.className = "webgl";
    document.body.append(this.renderer.domElement);

    this.camera.position.z = CAMERA_Z;

    // Each file loads once, however many slides show it
    const loader = new THREE.TextureLoader();
    const textures = new Map<string, Promise<THREE.Texture>>();
    const load = (src: string) => {
      const texture = textures.get(src) ?? loader.loadAsync(src);
      textures.set(src, texture);
      return texture;
    };

    this.medias = figures.map(
      (element) =>
        new Media({
          element,
          geometry: this.geometry,
          scene: this.scene,
          texture: load(element.querySelector("img")?.getAttribute("src") ?? ""),
          screen: this.screen,
          viewport: this.viewport,
        }),
    );

    this.resize();
    window.addEventListener("resize", this.resize);
    gsap.ticker.add(this.render);
  }

  private resize = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.renderer.setSize(width, height);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    const fov = (this.camera.fov * Math.PI) / 180;
    const viewportHeight = 2 * Math.tan(fov / 2) * this.camera.position.z;

    this.screen.set(width, height);
    this.viewport.set(viewportHeight * this.camera.aspect, viewportHeight);

    for (const media of this.medias) media.resize(this.scroll.current);
  };

  // After the scroll's own update: both read the same frame
  private render = () => {
    for (const media of this.medias) media.update(this.scroll.current, this.scroll.speed);

    this.renderer.render(this.scene, this.camera);
  };
}
