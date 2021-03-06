import cloneDeep from "clone-deep";

export default class Store {
  constructor(key, storage) {
    this._key = key;
    this._storage = storage;
  }

  getStorage() {
    try {
      return JSON.parse(this._storage.getItem(this._key)) || {};
    } catch (err) {
      return {};
    }
  }

  setStorage(items) {
    this._storage.setItem(
        this._key,
        JSON.stringify(items)
    );
  }

  setItem(key, value) {
    const store = cloneDeep(this.getStorage());
    store[key] = value;

    this._storage.setItem(
        this._key,
        JSON.stringify(store)
    );
  }
}
