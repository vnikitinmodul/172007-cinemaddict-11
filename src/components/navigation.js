import * as util from "../util.js";

const getFiltersMarkup = (item) => {
  const {name, sum, isChecked, isSumOff} = item;

  return `<a href="#watchlist" class="main-navigation__item ${isChecked ? `main-navigation__item--active` : ``}">${name}
    ${!isSumOff ? `<span class="main-navigation__item-count">${sum}</span>` : ``}
  </a>`;
};

const getNavigationMarkup = (filters) => {
  const filtersMarkup = filters
    .map(getFiltersMarkup).join(``);

  return `<nav class="main-navigation">
    <div class="main-navigation__items">
      ${filtersMarkup}
    </div>
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`;
};

export default class Navigation {
  constructor(filters) {
    this._filters = filters;
    this._element = null;
  }

  getTemplate() {
    return getNavigationMarkup(this._filters);
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
