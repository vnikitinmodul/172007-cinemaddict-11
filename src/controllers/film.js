import cloneDeep from "clone-deep";

import {renderElement} from "../utils/render.js";

import Card from "../components/card.js";
import FilmDetails from "../components/film-details.js";

import {
  KEY_CODE,
  BODY_HIDE_OVERFLOW_CLASS,
  FILM_ACTION,
  FILM_INFO_ACTION_HANDLER,
} from "../constants.js";

const CARD_ACTION_PROPERTIES = {
  IS_ADDED_TO_WATCHLIST: `isAddedToWatchlist`,
  IS_MARKED_AS_WATCHED: `isMarkedAsWatched`,
  IS_FAVORITE: `isFavorite`,
};

export default class FilmController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._bodyElement = document.body;
    this._card = null;
    this._filmInfo = null;
    this._data = null;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
  }

  _showFilmInfo(info) {
    return () => {
      this._onViewChange();

      this._renderFilmInfo(info);

      info.onEscPress = this._onFilmInfoEscPress(info);

      document.addEventListener(`keydown`, info.onEscPress);
      info.setCloseButtonHandler(this._onFilmInfoCloseElementClick(info));
      this._filmInfo.setChangeFilmInfoActionHandler(
          this._onFilmInfoActionChange(CARD_ACTION_PROPERTIES.IS_ADDED_TO_WATCHLIST),
          FILM_ACTION.ADD_TO_WATCHLIST,
          FILM_INFO_ACTION_HANDLER.ADD_TO_WATCHLIST
      );
      this._filmInfo.setChangeFilmInfoActionHandler(
          this._onFilmInfoActionChange(CARD_ACTION_PROPERTIES.IS_MARKED_AS_WATCHED),
          FILM_ACTION.MARK_AS_WATCHED,
          FILM_INFO_ACTION_HANDLER.MARK_AS_WATCHED
      );
      this._filmInfo.setChangeFilmInfoActionHandler(
          this._onFilmInfoActionChange(CARD_ACTION_PROPERTIES.IS_FAVORITE),
          FILM_ACTION.FAVORITE,
          FILM_INFO_ACTION_HANDLER.FAVORITE
      );
      this._filmInfo.setChangeEmojiHandler(this._onFilmInfoEmojiChange.bind(this));
    };
  }

  _renderFilmInfo(info) {
    this._updateBodyClassList(BODY_HIDE_OVERFLOW_CLASS);
    info.render();
  }

  _updateBodyClassList(className, method = `add`) {
    this._bodyElement.classList[method](className);
  }

  _removeFilmInfo(info) {
    info.removeElement(true);
    this._updateBodyClassList(BODY_HIDE_OVERFLOW_CLASS, `remove`);
  }

  _onFilmInfoCloseElementClick(info) {
    return () => {
      this.closeFilmInfo(info);
    };
  }

  _onFilmInfoEscPress(info) {
    return (evt) => {
      if (evt.key === KEY_CODE.ESC) {
        this.closeFilmInfo(info);
      }
    };
  }

  _onCardActionClick(property) {
    return (evt) => {
      evt.preventDefault();
      const thisCardData = this._data;
      const newCardData = cloneDeep(thisCardData);
      newCardData[property] = !thisCardData[property];
      this._data = newCardData;
      this._onDataChange(thisCardData, newCardData);
    };
  }

  _onFilmInfoActionChange(property) {
    return () => {
      const thisFilmInfoData = this._data;
      const newFilmInfoData = cloneDeep(thisFilmInfoData);
      newFilmInfoData[property] = !thisFilmInfoData[property];
      this._data = newFilmInfoData;
      this._onDataChange(thisFilmInfoData, newFilmInfoData);
      this._filmInfo.rerender();
    };
  }

  _onFilmInfoEmojiChange(evt) {
    const newFilmInfoData = cloneDeep(this._data);
    newFilmInfoData.selectedEmoji = evt.target.getAttribute(`value`);
    this._data = newFilmInfoData;
    this._filmInfo.rerender();
  }

  closeFilmInfo(info) {
    if (!info) {
      return;
    }

    this._removeFilmInfo(info);

    document.removeEventListener(`keydown`, info.onEscPress);
  }

  getData() {
    return this._data;
  }

  getCard() {
    return this._card;
  }

  getFilmInfo() {
    return this._filmInfo;
  }

  render(data) {
    this._data = data;

    if (!this._card) {
      this._card = new Card(this);
      this._filmInfo = new FilmDetails(this);
    }

    renderElement(this._container, this._card);

    this._card.setClickHandler(this._showFilmInfo(this._filmInfo));
    this._card.setClickCardActionHandler(
        this._onCardActionClick(CARD_ACTION_PROPERTIES.IS_ADDED_TO_WATCHLIST),
        FILM_ACTION.ADD_TO_WATCHLIST
    );
    this._card.setClickCardActionHandler(
        this._onCardActionClick(CARD_ACTION_PROPERTIES.IS_MARKED_AS_WATCHED),
        FILM_ACTION.MARK_AS_WATCHED
    );
    this._card.setClickCardActionHandler(
        this._onCardActionClick(CARD_ACTION_PROPERTIES.IS_FAVORITE),
        FILM_ACTION.FAVORITE
    );
  }
}
