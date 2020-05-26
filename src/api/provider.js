import cloneDeep from "clone-deep";
import FilmsAdapter from "../models/films-adapter";

import {showError} from "../utils/render.js";

import {ERROR_MESSAGE} from "../constants.js";

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
    this._isSyncRequired = false;
  }

  get _isOnLine() {
    return window.navigator.onLine;
  }

  get isSyncRequired() {
    return this._isSyncRequired;
  }

  sync() {
    if (this._isOnLine) {
      const storeFilms = Object.values(this._store.getStorage());
      this._isSyncRequired = false;

      return this._api.sync(this._getUpdatedFilms(storeFilms))
        .then((response) => {
          const newStorage = this._createStoreStructure(response.updated);

          this._store.setStorage(newStorage);
        });
    }

    return Promise.reject(showError(ERROR_MESSAGE.SYNC_FAILED));
  }

  getFilms() {
    if (this._isOnLine) {
      return this._api.getFilms()
        .then((films) => {
          const items = this._createStoreStructure(films.map((film) => film.toRAW()));

          this._store.setStorage(items);

          return films;
        });
    }

    const storeFilms = Object.values(this._store.getStorage());

    return Promise.resolve(FilmsAdapter.parseFilms(storeFilms));
  }

  updateFilm(id, film) {
    if (this._isOnLine) {
      return this._api.updateFilm(id, film)
        .then((filmUpdated) => {
          this._store.setItem(filmUpdated.id, filmUpdated.toRAW());

          return filmUpdated;
        });
    }

    this._isSyncRequired = true;
    const localFilm = FilmsAdapter.clone(Object.assign(film, {id}));

    localFilm.isFilmUpdated = true;
    this._store.setItem(id, localFilm.toRAW());

    return Promise.resolve(localFilm);
  }

  getComments(id) {
    if (this._isOnLine) {
      return this._api.getComments(id);
    }
    return Promise.reject(ERROR_MESSAGE.OFFLINE_LOGIC);
  }

  postComment(id, comment) {
    if (this._isOnLine) {
      return this._api.postComment(id, comment);
    }
    return Promise.reject(ERROR_MESSAGE.OFFLINE_LOGIC);
  }

  deleteComment(id) {
    if (this._isOnLine) {
      return this._api.deleteComment(id);
    }
    return Promise.reject(ERROR_MESSAGE.OFFLINE_LOGIC);
  }

  _getUpdatedFilms(items) {
    return items.filter((item) => item.isFilmUpdated);
  }

  _createStoreStructure(items) {
    return Object.assign(this._store.getStorage(), items.reduce((acc, current) => {
      const accClone = cloneDeep(acc);
      accClone[current.id] = current;
      return accClone;
    }, {}));
  }
}
