import * as util from "../util.js";

const getButtonMarkup = () => `<button class="films-list__show-more">Show more</button>`;

export default class Button {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return getButtonMarkup();
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
