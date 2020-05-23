import cloneDeep from "clone-deep";
import FilmsAdapter from "../models/films-adapter";

import {showError} from "../utils/render.js";

import {ERROR_MESSAGE} from "../constants.js";

const isOnline = () => {
  return window.navigator.onLine;
};

const getSyncedTasks = (items) => {
  return items.filter(({success}) => success)
    .map(({payload}) => payload.task);
};

const createStoreStructure = (items) => {
  return items.reduce((acc, current) => {
    const accClone = cloneDeep(acc);
    accClone[current.id] = current;
    return accClone;
  }, {});
};

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  sync() {
    if (isOnline()) {
      const storeFilms = Object.values(this._store.getStorage());

      return this._api.sync(storeFilms)
        .then((response) => {
          const newStorage = createStoreStructure(getSyncedTasks(response.updated));

          this._store.setStorage(newStorage);
        });
    }

    return Promise.reject(showError(ERROR_MESSAGE.SYNC_FAILED));
  }

  getFilms() {
    if (isOnline()) {
      return this._api.getFilms()
        .then((films) => {
          const items = createStoreStructure(films.map((task) => task.toRAW()));

          this._store.setStorage(items);

          return films;
        });
    }

    const storeFilms = Object.values(this._store.getFilmsData());

    return Promise.resolve(FilmsAdapter.parseFilms(storeFilms));
  }

  updateFilm(id, film) {
    if (isOnline()) {
      return this._api.updateFilm(id, film)
        .then((newFilm) => {
          this._store.setItem(newFilm.id, newFilm.toRAW());

          return newFilm;
        });
    }

    const localFilm = FilmsAdapter.clone(Object.assign(film, {id}));

    this._store.setItem(id, localFilm.toRAW());

    return Promise.resolve(localFilm);
  }

  getComments(id) {
    return this._api.getComments(id);
  }

  postComment(comment) {
    return this._api.postComment(comment);
  }

  deleteComment(id) {
    return this._api.deleteComment(id);
  }
}
