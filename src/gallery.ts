export const renderGallery = (track: HTMLElement, slides: string[]) => {
  track.innerHTML = slides
    .map(
      (src) => `
        <figure class="gallery__media">
          <img class="gallery__image" src="${src}" alt="" draggable="false" />
        </figure>
      `,
    )
    .join("");
};
