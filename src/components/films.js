export const getFilmsMarkup = () => (
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
