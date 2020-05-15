import AbstractSmartComponent from "./abstract-smart.js";

import {FILTERS} from "../constants.js";

const CLASS_ACTIVE = {
  FILTER: `main-navigation__item--active`,
  STATS: `main-navigation__additional--active`,
};

const getFiltersMarkup = (filter, filmsModel) => (
  `<a href="${filter.HREF}" class="main-navigation__item">${filter.NAME}
    ${filter.HREF !== filmsModel.getDefaultFilter() ? `<span class="main-navigation__item-count">${filmsModel.getNum(filter.method)}</span>` : ``}
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
    this._statsClickHandler = null;
  }

  _getFilterElements() {
    this._filterElements = this.getElement().querySelectorAll(`.main-navigation__item`);

    return this._filterElements;
  }

  _getStatsElement() {
    this._statsElement = this._element.querySelector(`.main-navigation__additional`);

    return this._statsElement;
  }

  _clearFilterActive() {
    this._getFilterElements().forEach((item) => {
      item.classList.remove(CLASS_ACTIVE.FILTER);
    });
  }

  setFilterActive(filter = this._filmsModel.getCurrentFilter()) {
    this._clearFilterActive();
    this._getStatsElement().classList.remove(CLASS_ACTIVE.STATS);
    [...this._getFilterElements()].find((item) => (item.getAttribute(`href`) === filter)).classList.add(CLASS_ACTIVE.FILTER);
  }

  setStatsActive() {
    this._clearFilterActive();
    this._getStatsElement().classList.add(CLASS_ACTIVE.STATS);
  }

  setClickFilterHandler(handler) {
    this._filterChangeHandler = handler;
    this._getFilterElements().forEach((item) => {
      item.addEventListener(`click`, handler);
    });
  }

  setClickStats(handler) {
    this._statsClickHandler = handler;
    this._getStatsElement().addEventListener(`click`, handler);
  }

  getTemplate() {
    return getNavigationMarkup(this._filmsModel);
  }

  recoveryListeners() {
    this.setClickFilterHandler(this._filterChangeHandler);
    this.setClickStats(this._statsClickHandler);
  }
}
