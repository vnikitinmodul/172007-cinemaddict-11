import AbstractComponent from "./abstract.js";

const getFilmsMarkup = () => (
  `<section class="films">
    <section class="films-list">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
      <div id="filmsList" class="films-list__container"></div>
    </section>

    <section id="filmsListTop" class="films-list--extra">
      <h2 class="films-list__title">Top rated</h2>
      <div class="films-list__container"></div>
    </section>

    <section id="filmsListCommented" class="films-list--extra">
      <h2 class="films-list__title">Most commented</h2>
      <div class="films-list__container"></div>
    </section>
  </section>`
);

export default class Films extends AbstractComponent {
  getTemplate() {
    return getFilmsMarkup();
  }
}
