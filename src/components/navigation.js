const getFiltersMarkup = (item) => {
  const {name, sum, isChecked, isSumOff} = item;

  return `<a href="#watchlist" class="main-navigation__item ${isChecked ? `main-navigation__item--active` : ``}">${name}
    ${!isSumOff ? `<span class="main-navigation__item-count">${sum}</span>` : ``}
  </a>`;
};

export const getNavigationMarkup = (filters) => {
  const filtersMarkup = filters
    .map((item) => {
      return getFiltersMarkup(item);
    }).join(``);

  return `<nav class="main-navigation">
    <div class="main-navigation__items">
      ${filtersMarkup}
    </div>
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`;
};
