import {renderElement} from "../utils/render.js";

import Card from "../components/card.js";
import Comments from "../components/film-comments.js";
import FilmDetails from "../components/film-details.js";

import {
  KEY_CODE,
  BODY_HIDE_OVERFLOW_CLASS,
} from "../constants.js";

const CARD_ACTION_PROPERTIES = {
  IS_ADDED_TO_WATCHLIST: `isAddedToWatchlist`,
  IS_MARKED_AS_WATCHED: `isMarkedAsWatched`,
  IS_FAVORITE: `isFavorite`,
}

export default class FilmController {
  constructor(container, onDataChange) {
    this._container = container;
    this._bodyElement = document.body;
    this._card = null;
    this._filmInfo = null;
    this._currentFilmInfo = null;
    this._onDataChange = onDataChange;
  }

  _showFilmInfo(info) {
    return () => {
      if (this._currentFilmInfo === info) {
        return;
      }

      this._closeFilmInfo(this._currentFilmInfo);

      this._currentFilmInfo = info;

      this._renderFilmInfo(info);

      info.onEscPress = this._onFilmInfoEscPress(info);

      document.addEventListener(`keydown`, info.onEscPress);
      info.setCloseButtonHandler(this._onFilmInfoCloseElementClick(info));
    };
  }

  _renderFilmInfo(info) {
    this._updateBodyClassList(BODY_HIDE_OVERFLOW_CLASS);
    renderElement(this._bodyElement, info);

    const filmCommentsList = info.getElement().querySelector(`.film-details__comments-list`);
    renderElement(filmCommentsList, new Comments(info.getComments()));
  }

  _closeFilmInfo(info) {
    if (!info) {
      return;
    }

    this._removeFilmInfo(info);

    document.removeEventListener(`keydown`, info.onEscPress);
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
      this._currentFilmInfo = null;
      this._closeFilmInfo(info);
    };
  }

  _onFilmInfoEscPress(info) {
    return (evt) => {
      if (evt.key === KEY_CODE.ESC) {
        this._currentFilmInfo = null;
        this._closeFilmInfo(info);
      }
    };
  }

  _onCardActionClick(property) {
    return (evt) => {
      evt.preventDefault();
      const thisCardData = this._card.data;
      const newCardData = Object.assign(thisCardData, {
        [property]: !thisCardData[property]
      });
      this._onDataChange(thisCardData, newCardData);
    };
  }

  getCard() {
    return this._card;
  }

  render(data) {
    if (!this._card) {
      this._card = new Card(data);
      this._filmInfo = new FilmDetails(data);
    } else {
      this._card.data = data;
    }

    renderElement(this._container, this._card);

    this._card.setClickHandler(this._showFilmInfo(this._filmInfo));
    this._card.setClickAddToWatchlistHandler(this._onCardActionClick(CARD_ACTION_PROPERTIES.IS_ADDED_TO_WATCHLIST));
    this._card.setClickMarkAsWatchedHandler(this._onCardActionClick(CARD_ACTION_PROPERTIES.IS_MARKED_AS_WATCHED));
    this._card.setClickFavoriteHandler(this._onCardActionClick(CARD_ACTION_PROPERTIES.IS_FAVORITE));
  }
}
