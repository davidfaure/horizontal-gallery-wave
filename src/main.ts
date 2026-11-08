import "./style.css";
import { slides } from "./data";
import { renderGallery } from "./gallery";
import { HorizontalScroll } from "./scroll";
import { GalleryGL } from "./webgl/GalleryGL";

const track = document.querySelector<HTMLElement>("[data-track]");

if (track) {
  renderGallery(track, slides);
  const scroll = new HorizontalScroll(track);
  new GalleryGL(scroll, [...track.querySelectorAll<HTMLElement>(".gallery__media")]);
}
