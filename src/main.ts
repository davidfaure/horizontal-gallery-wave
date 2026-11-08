import "./style.css";
import { slides } from "./data";
import { renderGallery } from "./gallery";

const track = document.querySelector<HTMLElement>("[data-track]");

if (track) {
  renderGallery(track, slides);
}
