import cloneDeep from "clone-deep";
import he from "he";

import * as util from "../utils/common.js";
import {
  renderElement,
  showError,
} from "../utils/render.js";

import Card from "../components/card.js";
import FilmDetails from "../components/film-details.js";

import {
  KEY_CODE,
  BODY_HIDE_OVERFLOW_CLASS,
  ACTION_PROPERTIES,
  COMMENT_AUTHORS,
  COMMENT_EMOJIES,
  ENCODE_PARAM,
} from "../constants.js";


export default class FilmController {
  constructor(container, handlers, api) {
    this._container = container;
    this._api = api;
    this._bodyElement = document.body;
    this._card = null;
    this._filmInfo = null;
    this._filmData = null;
    this._commentsData = null;
    this._onDataChange = handlers.onDataChange;
    this._onViewChange = handlers.onViewChange;
    this._onCommentsDataChange = handlers.onCommentsDataChange;
    this._onFilmInfoEmojiChange = this._onFilmInfoEmojiChange.bind(this);
    this._onCommentDeleteClick = this._onCommentDeleteClick.bind(this);
    this._onFilmInfoFormSubmit = this._onFilmInfoFormSubmit.bind(this);
  }

  _setClickCardActionHandlers() {
    Object.keys(ACTION_PROPERTIES).forEach((key) => {
      this._card.setClickActionHandler({
        className: `film-card__controls-item--${ACTION_PROPERTIES[key].MODIFIER}`,
        handler: this._onActionClick(`card`, ACTION_PROPERTIES[key].PROPERTY)
      });
    });
  }

  _setChangeFilmInfoActionHandlers() {
    Object.keys(ACTION_PROPERTIES).forEach((key) => {
      this._filmInfo.setChangeFilmInfoActionHandler({
        id: key.toLowerCase(),
        handler: this._onActionClick(`filmInfo`, ACTION_PROPERTIES[key].PROPERTY)
      });
    });
  }

  _showFilmInfo() {
    return () => {
      this._onViewChange();

      this._api.getComments(this._filmData.id)
        .then((commentsData) => {
          this._onCommentsDataChange(this._commentsData, {id: this._filmData.id, commentsList: commentsData});
          this._renderFilmInfo();

          this._filmInfo.onEscPress = this._onFilmInfoEscPress();

          document.addEventListener(`keydown`, this._filmInfo.onEscPress);
          this._filmInfo.setCloseButtonHandler(this._onFilmInfoCloseElementClick());
          this._setChangeFilmInfoActionHandlers();
          this._filmInfo.setChangeEmojiHandler(this._onFilmInfoEmojiChange);
          this._filmInfo.setSubmitFormHandler(this._onFilmInfoFormSubmit);
          this._filmInfo
            .getCommentsComponent()
            .setDeleteCommentHandler(this._onCommentDeleteClick);
        });
    };
  }

  _renderFilmInfo() {
    this._updateBodyClassList(BODY_HIDE_OVERFLOW_CLASS);
    this._filmInfo.render();
  }

  _updateBodyClassList(className, method = `add`) {
    this._bodyElement.classList[method](className);
  }

  _removeFilmInfo() {
    this._filmInfo.removeElement(true);
    this._filmInfo.removeContainer();
    this._updateBodyClassList(BODY_HIDE_OVERFLOW_CLASS, `remove`);
  }

  _onFilmInfoCloseElementClick() {
    return () => {
      this.closeFilmInfo();
    };
  }

  _onFilmInfoEscPress() {
    return (evt) => {
      if (evt.key === KEY_CODE.ESC) {
        this.closeFilmInfo();
      }
    };
  }

  _onActionClick(type, property) {
    return (evt) => {
      evt.preventDefault();

      const thisData = this._filmData;
      const newData = cloneDeep(thisData);

      evt.target.setAttribute(`disabled`, true);

      newData[property] = !thisData[property];
      newData.watchingDate = new Date();
      this._filmData = newData;
      this._api.updateFilm(this._filmData.id, newData)
        .then((serverData) => {
          this._onDataChange(thisData, serverData);
          if (type === `filmInfo`) {
            this._filmInfo.rerender();
          }
        })
        .catch((err) => {
          evt.target.removeAttribute(`disabled`);
          showError(err);
        });

    };
  }

  _onFilmInfoEmojiChange(evt) {
    const newFilmInfoData = cloneDeep(this._filmData);
    newFilmInfoData.selectedEmoji = evt.target.getAttribute(`value`);
    this._filmData = newFilmInfoData;
    this._filmInfo.rerender();
  }

  _onFilmInfoFormSubmit(evt) {
    if (evt.code === `Enter` && evt.ctrlKey) {
      const text = this.getFilmInfo().getElement().querySelector(`.film-details__comment-input`).value;
      const emojiElement = this.getFilmInfo().getElement().querySelector(`.film-details__emoji-item:checked`);
      const emoji = emojiElement ? emojiElement.value : COMMENT_EMOJIES[0];

      const thisCommentsData = this._commentsData;
      const newCommentsData = cloneDeep(thisCommentsData);

      const newComment = {
        emoji,
        author: util.getRandomFromArray(COMMENT_AUTHORS),
        date: new Date(),
        text: he.encode(text, ENCODE_PARAM),
      };

      newCommentsData.commentsList.push(newComment);
      this._onCommentsDataChange(thisCommentsData, newCommentsData);
      this._onDataChange(this._filmData, this._filmData);
    }
  }

  _onCommentDeleteClick(evt) {
    evt.preventDefault();

    const thisCommentsData = this._commentsData;
    const newCommentsData = cloneDeep(thisCommentsData);
    const commentId = evt.target.getAttribute(`data-id`);
    newCommentsData.commentsList.splice(newCommentsData.commentsList.findIndex((item) => (item.commentId === Number(commentId))), 1);
    this._onCommentsDataChange(thisCommentsData, newCommentsData);
    this._onDataChange(this._filmData, this._filmData);
  }

  closeFilmInfo() {
    this._removeFilmInfo();

    document.removeEventListener(`keydown`, this._filmInfo.onEscPress);
  }

  setCommentsData(comments) {
    this._commentsData = comments;
  }

  getData() {
    return this._filmData;
  }

  getCommentsData() {
    return this._commentsData;
  }

  getCard() {
    return this._card;
  }

  getFilmInfo() {
    return this._filmInfo;
  }

  render(film, commentsData) {
    this._filmData = film || this._filmData;
    this._commentsData = commentsData || this._commentsData;

    if (!this._card) {
      this._card = new Card(this);
      this._filmInfo = new FilmDetails(this);
    }

    renderElement(this._container, this._card);

    this._setClickCardActionHandlers();
    this._card.setClickHandler(this._showFilmInfo(this._filmInfo));
  }
}
