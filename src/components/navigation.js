import AbstractSmartComponent from "./abstract-smart.js";

import {FILTERS} from "../constants.js";

const FILTER_CLASS_ACTIVE = `main-navigation__item--active`;

const getFiltersMarkup = (filter, filmsModel) => (
  `<a href="${filter.HREF}" class="main-navigation__item">${filter.NAME}
    ${filter.HREF !== filmsModel.getDefaultFilter() ? `<span class="main-navigation__item-count">${filmsModel.getFilmsNum(filter.FUNCTION)}</span>` : ``}
  </a>`
);

const getNavigationMarkup = (filmsModel) => {
  const filtersMarkup = FILTERS
    .map((item) => (getFiltersMarkup(item, filmsModel))).join(``);

  return `<nav class="main-navigation">
    <div class="main-navigation__items">
      ${filtersMarkup}
    </div>
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`;
};

export default class Navigation extends AbstractSmartComponent {
  constructor(filmsModel) {
    super();

    this._filmsModel = filmsModel;
    this._filterElements = null;
    this._filterChangeHandler = null;
  }

  _getFilterElements() {
    this._filterElements = this.getElement().querySelectorAll(`.main-navigation__item`);

    return this._filterElements;
  }

  setFilterActive(filter = this._filmsModel.getCurrentFilter()) {
    this._getFilterElements().forEach((item) => {
      item.classList.remove(FILTER_CLASS_ACTIVE);
    });

    [...this._getFilterElements()].find((item) => (item.getAttribute(`href`) === filter)).classList.add(FILTER_CLASS_ACTIVE);
  }

  setClickFilterHandler(handler) {
    this._filterChangeHandler = handler;
    document.querySelectorAll(`.main-navigation__item`).forEach((item) => {
      item.addEventListener(`click`, handler);
    });
  }

  setClickStats(handler) {
    this._element.querySelector(`.main-navigation__additional`).addEventListener(`click`, handler);
  }

  getTemplate() {
    return getNavigationMarkup(this._filmsModel);
  }

  recoveryListeners() {
    this.setClickFilterHandler(this._filterChangeHandler);
  }
}
