import "./style.css";
import { slides } from "./data";
import { renderGallery } from "./gallery";
import { HorizontalScroll } from "./scroll";

const track = document.querySelector<HTMLElement>("[data-track]");

if (track) {
  renderGallery(track, slides);
  new HorizontalScroll(track);
}
