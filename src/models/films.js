import {FILTERS} from "../constants.js";

export default class Films {
  constructor() {
    this._filmsData = null;
    this._defaultFilter = FILTERS[0].HREF;
    this._currentFilter = this._defaultFilter;
    this._filterChangeHandlers = [];
    this._dataChangeHandlers = [];
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }

  getFilms() {
    return this._filmsData.filter(FILTERS.find((item) => (item.HREF === this._currentFilter)).FUNCTION);
  }

  getFilmsNum(filter = this._defaultFilter) {
    return this._filmsData.filter(filter).length;
  }

  setFilms(data) {
    this._filmsData = data;
    this._callHandlers(this._dataChangeHandlers);
  }

  updateFilm(data) {
    this._filmsData[this._filmsData.findIndex((item) => (item.id === data.id))] = data;
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

  setFilterChangeHandler(handler) {
    this._filterChangeHandlers.push(handler);
  }

  setDataChangeHandler(handler) {
    this._dataChangeHandlers.push(handler);
  }
}
