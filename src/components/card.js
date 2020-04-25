import {POSTERS_PATH} from "../constants.js";
import AbstractComponent from "./abstract.js";

const CARD_SHOW_DETAILS = [
  `.film-card__poster`,
  `.film-card__title`,
  `.film-card__comments`,
];

const CARD_CONTROL_ACTIVE_CLASS = `film-card__controls-item--active`;

const getShowDetailsElements = (card) => card.getElement().querySelectorAll(CARD_SHOW_DETAILS.join(`, `));

const getCardActionsElements = (card) => ({
  addToWatchlist: card.getElement().querySelector(`.film-card__controls-item--add-to-watchlist`),
  markAsWatched: card.getElement().querySelector(`.film-card__controls-item--mark-as-watched`),
  favorite: card.getElement().querySelector(`.film-card__controls-item--favorite`),
});

const cutText = (text, maxLength = 140, symbol = `…`) => (
  text.length > maxLength ? `${text.slice(0, maxLength - 1)}${symbol}` : text
);

const getCardMarkup = (filmData) => {
  const {
    title,
    rating,
    date,
    duration,
    genres,
    poster,
    description,
    comments,
    isAddedToWatchlist,
    isMarkedAsWatched,
    isFavorite,
  } = filmData;

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
      <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist${isAddedToWatchlist ? ` ${CARD_CONTROL_ACTIVE_CLASS}` : ``}">Add to watchlist</button>
      <button class="film-card__controls-item button film-card__controls-item--mark-as-watched${isMarkedAsWatched ? ` ${CARD_CONTROL_ACTIVE_CLASS}` : ``}">Mark as watched</button>
      <button class="film-card__controls-item button film-card__controls-item--favorite${isFavorite ? ` ${CARD_CONTROL_ACTIVE_CLASS}` : ``}">Mark as favorite</button>
    </form>
  </article>`;
};

export default class Card extends AbstractComponent {
  constructor(filmData) {
    super();

    this._film = filmData;
    this._cardActionsElements = {};
  }

  getTemplate() {
    return getCardMarkup(this._film);
  }

  setClickAddToWatchlistHandler(handler) {
    getCardActionsElements(this).addToWatchlist.addEventListener(`click`, handler);
  }

  setClickMarkAsWatchedHandler(handler) {
    getCardActionsElements(this).markAsWatched.addEventListener(`click`, handler);
  }

  setClickFavoriteHandler(handler) {
    getCardActionsElements(this).favorite.addEventListener(`click`, handler);
  }

  setClickHandler(handler) {
    getShowDetailsElements(this).forEach((item) => {
      item.addEventListener(`click`, handler);
    });
  }

  set data(data) {
    this._film = data;
  }

  get data() {
    return this._film;
  }
}
