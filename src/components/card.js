import moment from "moment";

import {
  POSTERS_PATH,
} from "../constants.js";
import * as util from "../utils/common.js";
import AbstractComponent from "./abstract.js";

const CARD_SHOW_DETAILS = [
  `.film-card__poster`,
  `.film-card__title`,
  `.film-card__comments`,
];

const RATING_VALUES = {
  POOR: {
    NAME: `poor`,
    NUM: 5
  },
  AVERAGE: {
    NAME: `average`,
    NUM: 7
  },
  GOOD: {
    NAME: `good`,
    NUM: 10
  },
};

const CARD_CONTROL_ACTIVE_CLASS = `film-card__controls-item--active`;

const cutText = (text, maxLength = 140, symbol = `…`) => (
  text.length > maxLength ? `${text.slice(0, maxLength - 1)}${symbol}` : text
);

const getRatingColor = (rating) => {
  if (rating < RATING_VALUES.POOR.NUM) {
    return RATING_VALUES.POOR.NAME;
  } else if (rating < RATING_VALUES.AVERAGE.NUM) {
    return RATING_VALUES.AVERAGE.NAME;
  } else {
    return RATING_VALUES.GOOD.NAME;
  }
};

const getCardMarkup = (filmData) => {
  const {
    title,
    rating,
    date,
    duration,
    genres,
    poster,
    description,
    isAddedToWatchlist,
    isMarkedAsWatched,
    isFavorite,
    comments,
  } = filmData;

  return `<article class="film-card">
    <h3 class="film-card__title">${title}</h3>
    <p class="film-card__rating film-card__rating--${getRatingColor(rating)}">${rating}</p>
    <p class="film-card__info">
      <span class="film-card__year" title="${moment(date).format(`DD MMMM YYYY`)}">${moment(date).format(`YYYY`)}</span>
      <span class="film-card__duration">${util.getDurationMoment(duration, true).join(` `)}</span>
      <span class="film-card__genre">${genres.length ? genres[0] : ``}</span>
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
  constructor(controller) {
    super();

    this._controller = controller;
  }

  getTemplate() {
    return getCardMarkup(this._controller.getData());
  }

  setClickActionHandler(param) {
    const {className, handler} = param;
    this.getElement().querySelector(`.${className}`).addEventListener(`click`, handler);
  }

  setClickHandler(handler) {
    this._getShowDetailsElements(this).forEach((item) => {
      item.addEventListener(`click`, handler);
    });
  }

  _getShowDetailsElements(card) {
    return card.getElement().querySelectorAll(CARD_SHOW_DETAILS.join(`, `));
  }
}
