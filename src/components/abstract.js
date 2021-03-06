import {createElement} from "../utils/render.js";

export default class AbstractComponent {
  constructor() {
    if (new.target === AbstractComponent) {
      throw new Error(`Can't instantiate AbstractComponent, only concrete one.`);
    }

    this._element = null;
    this._container = null;
  }

  get container() {
    return this._container;
  }

  set container(container) {
    this._container = container;
  }

  getTemplate() {
    throw new Error(`Abstract method not implemented: getTemplate`);
  }

  getElement(isWrapped) {
    if (this._element === null) {
      this._element = createElement(this.getTemplate(), isWrapped);
    }

    return this._element;
  }

  removeElement(isDOMRemove) {
    if (isDOMRemove && this._element) {
      this.getElement().remove();
    }
    this._element = null;
  }

  removeContainer() {
    this._container = null;
  }
}
