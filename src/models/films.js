import {FILTERS} from "../constants.js";
import * as util from "../utils/common.js";

export default class Films {
  constructor() {
    this._filmsData = [];
    this._defaultFilter = FILTERS[0].HREF;
    this._currentFilter = this._defaultFilter;
    this._filterChangeHandlers = [];
    this._dataChangeHandlers = [];
    this._dataLoadHandlers = [];
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }

  getData(filter) {
    filter = filter || util.getFilterMethod(FILTERS, (item) => (item.HREF === this._currentFilter));
    return this._filmsData.filter(filter);
  }

  getNum(filter = this._defaultFilter) {
    return this._filmsData.filter(filter).length;
  }

  setData(films) {
    this._filmsData = films;
    this._callHandlers(this._dataLoadHandlers);
  }

  updateFilm(film) {
    this._filmsData[this._filmsData.findIndex((item) => (item.id === film.id))] = film;
    this._callHandlers(this._dataChangeHandlers);
  }

  getDefaultFilter() {
    return this._defaultFilter;
  }

  getCurrentFilter() {
    return this._currentFilter;
  }

  activateFilter(filter) {
    if (this._currentFilter === filter) {
      return;
    }

    this._currentFilter = filter;
    this._callHandlers(this._filterChangeHandlers);
  }

  clearFilter() {
    this._currentFilter = null;
  }

  setFilterChangeHandler(handler) {
    this._filterChangeHandlers.push(handler);
  }

  setDataChangeHandler(handler) {
    this._dataChangeHandlers.push(handler);
  }

  setDataLoadHandler(handler) {
    this._dataLoadHandlers.push(handler);
  }
}
