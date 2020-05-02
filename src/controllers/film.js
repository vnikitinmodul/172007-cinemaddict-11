import cloneDeep from "clone-deep";

import {renderElement} from "../utils/render.js";

import Card from "../components/card.js";
import FilmDetails from "../components/film-details.js";

import {
  KEY_CODE,
  BODY_HIDE_OVERFLOW_CLASS,
  ACTION_PROPERTIES,
} from "../constants.js";


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

  _setClickCardActionHandlers() {
    Object.keys(ACTION_PROPERTIES).forEach((key) => {
      this._card.setClickCardActionHandler({
        className: `film-card__controls-item--${ACTION_PROPERTIES[key].MODIFIER}`,
        handler: this._onCardActionClick(ACTION_PROPERTIES[key].PROPERTY)
      });
    });
  }

  _setChangeFilmInfoActionHandlers() {
    Object.keys(ACTION_PROPERTIES).forEach((key) => {
      this._filmInfo.setChangeFilmInfoActionHandler({
        id: key.toLowerCase(),
        handler: this._onFilmInfoActionChange(ACTION_PROPERTIES[key].PROPERTY)
      });
    });
  }

  _showFilmInfo(info) {
    return () => {
      this._onViewChange();

      this._renderFilmInfo(info);

      info.onEscPress = this._onFilmInfoEscPress(info);

      document.addEventListener(`keydown`, info.onEscPress);
      info.setCloseButtonHandler(this._onFilmInfoCloseElementClick(info));
      this._setChangeFilmInfoActionHandlers();
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

    this._setClickCardActionHandlers();
    this._card.setClickHandler(this._showFilmInfo(this._filmInfo));
  }
}
