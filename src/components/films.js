import * as util from "../util.js";

const getFilmsMarkup = () => (
  `<section class="films">
    <section class="films-list">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
      <div id="filmsList" class="films-list__container"></div>
    </section>

    <section class="films-list--extra">
      <h2 class="films-list__title">Top rated</h2>
      <div id="filmsListTop" class="films-list__container"></div>
    </section>

    <section class="films-list--extra">
      <h2 class="films-list__title">Most commented</h2>
      <div id="filmsListCommented" class="films-list__container"></div>
    </section>
  </section>`
);

export default class Films {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return getFilmsMarkup();
  }

  getElement() {
    if (this._element === null) {
      this._element = util.createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
