import gsap from "gsap";
import { damp } from "./utils";

const WHEEL_FACTOR = 0.8;
const DRAG_FACTOR = 0.8;
const SCROLL_LERP = 0.1;
// deltaMode 1: Firefox with a mouse wheel counts in lines, not pixels
const LINE_HEIGHT = 16;

export class HorizontalScroll {
  // In pixels, from 0 (first image) to -limit (last image)
  current = 0;
  target = 0;

  private readonly track: HTMLElement;
  private limit = 0;
  private dragging = false;
  private dragStart = 0;
  private dragFrom = 0;

  constructor(track: HTMLElement) {
    this.track = track;

    this.resize();
    window.addEventListener("resize", this.resize);
    window.addEventListener("wheel", this.onWheel, { passive: false });
    window.addEventListener("pointerdown", this.onPointerDown);
    window.addEventListener("pointermove", this.onPointerMove);
    window.addEventListener("pointerup", this.onPointerUp);
    window.addEventListener("pointercancel", this.onPointerUp);
    gsap.ticker.add(this.update);
  }

  private resize = () => {
    this.limit = Math.max(this.track.offsetWidth - window.innerWidth, 0);
  };

  private onWheel = (e: WheelEvent) => {
    const delta = e.deltaMode === 1 ? e.deltaY * LINE_HEIGHT : e.deltaY;
    const target = gsap.utils.clamp(-this.limit, 0, this.target - delta * WHEEL_FACTOR);

    // At either end, the wheel goes back to the page
    if (target === this.target) return;

    e.preventDefault();
    this.target = target;
  };

  private onPointerDown = (e: PointerEvent) => {
    this.dragging = true;
    this.dragStart = e.clientX;
    this.dragFrom = this.current;
  };

  private onPointerMove = (e: PointerEvent) => {
    if (!this.dragging) return;

    this.target = this.dragFrom - (this.dragStart - e.clientX) * DRAG_FACTOR;
  };

  private onPointerUp = () => {
    this.dragging = false;
  };

  private update = () => {
    this.target = gsap.utils.clamp(-this.limit, 0, this.target);
    this.current = damp(this.current, this.target, SCROLL_LERP);

    this.track.style.transform = `translate3d(${this.current}px, 0, 0)`;
  };
}
