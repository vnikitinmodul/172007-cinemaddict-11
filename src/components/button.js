import AbstractComponent from "./abstract.js";

const getButtonMarkup = () => `<button class="films-list__show-more">Show more</button>`;

export default class Button extends AbstractComponent {
  constructor() {
    super();
  }

  getTemplate() {
    return getButtonMarkup();
  }

  setClickHandler(handler) {
    this.getElement().addEventListener(`click`, handler);
  }
}
