import {POSTERS_PATH} from "../config.js";
import * as util from "../util.js";

const cutText = (text, maxLength = 140, symbol = `…`) => (
  text.length > maxLength ? `${text.slice(0, maxLength - 1)}${symbol}` : text
);

const getCardMarkup = (filmData) => {
  const {title, rating, date, duration, genres, poster, description, comments} = filmData;

  return `<article class="film-card">
    <h3 class="film-card__title">${title}</h3>
    <p class="film-card__rating">${rating}</p>
    <p class="film-card__info">
      <span class="film-card__year">${date.getFullYear()}</span>
      <span class="film-card__duration">${duration}</span>
      <span class="film-card__genre">${genres[0]}</span>
    </p>
    <img src="${POSTERS_PATH + poster}" alt="" class="film-card__poster">
    <p class="film-card__description">${cutText(description)}</p>
    <a class="film-card__comments">${comments.length} comments</a>
    <form class="film-card__controls">
      <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist">Add to watchlist</button>
      <button class="film-card__controls-item button film-card__controls-item--mark-as-watched">Mark as watched</button>
      <button class="film-card__controls-item button film-card__controls-item--favorite">Mark as favorite</button>
    </form>
  </article>`;
};

export default class Card {
  constructor(filmData) {
    this._film = filmData;
    this._element = null;
  }

  getTemplate() {
    return getCardMarkup(this._film);
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
