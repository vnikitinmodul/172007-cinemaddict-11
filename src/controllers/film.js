import {renderElement} from "../utils/render.js";

import Card from "../components/card.js";
import FilmDetails from "../components/film-details.js";

import {
  KEY_CODE,
  BODY_HIDE_OVERFLOW_CLASS,
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
      this._filmInfo.setChangeAddToWatchlistHandler(this._onFilmInfoActionChange(CARD_ACTION_PROPERTIES.IS_ADDED_TO_WATCHLIST));
      this._filmInfo.setChangeMarkAsWatchedHandler(this._onFilmInfoActionChange(CARD_ACTION_PROPERTIES.IS_MARKED_AS_WATCHED));
      this._filmInfo.setChangeFavoriteHandler(this._onFilmInfoActionChange(CARD_ACTION_PROPERTIES.IS_FAVORITE));
      this._filmInfo.setChangeEmojiHandler(this._onFilmInfoEmojiChange.bind(this._filmInfo));
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
      const thisCardData = this._card.data;
      const newCardData = Object.assign(thisCardData, {
        [property]: !thisCardData[property]
      });
      this._onDataChange(thisCardData, newCardData);
    };
  }

  _onFilmInfoActionChange(property) {
    return () => {
      const thisFilmInfoData = this._filmInfo.data;
      const newFilmInfoData = Object.assign(thisFilmInfoData, {
        [property]: !thisFilmInfoData[property]
      });
      this._onDataChange(thisFilmInfoData, newFilmInfoData);
      this._filmInfo.rerender();
    };
  }

  _onFilmInfoEmojiChange(evt) {
    const emoji = evt.target.getAttribute(`value`);
    this._film = Object.assign(this._film, {
      selectedEmoji: emoji
    });
    this.rerender();
  }

  closeFilmInfo(info) {
    if (!info) {
      return;
    }

    this._removeFilmInfo(info);

    document.removeEventListener(`keydown`, info.onEscPress);
  }

  getCard() {
    return this._card;
  }

  getFilmInfo() {
    return this._filmInfo;
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
