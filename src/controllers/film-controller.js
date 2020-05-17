import cloneDeep from "clone-deep";
import he from "he";

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
  COMMENT_EMOJIES,
  ENCODE_PARAM,
} from "../constants.js";

const BUTTON_TEXT = {
  DEFAULT: `Delete`,
  DELETING: `Deleting...`,
};
const ERROR_CLASS = {
  SHAKE: `shake`,
  BORDER: `film-details__comment-input--error`,
};
const SHAKE_DURATION = 600;

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

  _getRAWComment(text, emojiElement) {
    return {
      "emotion": emojiElement ? emojiElement.value : COMMENT_EMOJIES[0],
      "date": new Date(),
      "comment": he.encode(text, ENCODE_PARAM),
    };
  }

  _onFilmInfoFormSubmit(evt) {
    const textElement = this.getFilmInfo().getElement().querySelector(`.film-details__comment-input`);
    const text = textElement.value;
    const isSubmitFilmInfoForm = (evt.code === KEY_CODE.ENTER || evt.metaKey) && evt.ctrlKey && text.length;

    if (isSubmitFilmInfoForm) {
      const emojiElement = this.getFilmInfo().getElement().querySelector(`.film-details__emoji-item:checked`);
      const formElement = this._filmInfo.getElement().querySelector(`.film-details__inner`);
      const newComment = this._getRAWComment(text, emojiElement);

      textElement.classList.remove(ERROR_CLASS.BORDER);
      textElement.setAttribute(`disabled`, true);

      this._api.postComment(this._filmData.id, newComment)
        .then((allFilmData) => {
          const {comments, filmInfo} = allFilmData;
          this._onCommentsDataChange(this._commentsData, {
            id: this._filmData.id,
            commentsList: comments,
          });
          this._onDataChange(this._filmData, filmInfo);
        })
        .catch(() => {
          formElement.classList.add(ERROR_CLASS.SHAKE);
          textElement.classList.add(ERROR_CLASS.BORDER);
          this._catchCommentsError(formElement, textElement);
        });
    }
  }

  _onCommentDeleteClick(evt) {
    evt.preventDefault();

    const commentId = evt.target.getAttribute(`data-id`);
    const commentElement = this._filmInfo.getElement().querySelector(`.film-details__comment[data-id="${commentId}"]`);

    evt.target.setAttribute(`disabled`, true);
    evt.target.innerText = BUTTON_TEXT.DELETING;

    this._api.deleteComment(commentId)
      .then(this._onDeleteCommentSuccess(commentId))
      .catch(() => {
        evt.target.innerText = BUTTON_TEXT.DEFAULT;
        this._catchCommentsError(commentElement, evt.target);
      });
  }

  _onDeleteCommentSuccess(commentId) {
    const newCommentsData = cloneDeep(this._commentsData);
    const newFilmInfoData = cloneDeep(this._filmData);
    const commentIndex = newCommentsData.commentsList.findIndex((item) => (item.commentId === Number(commentId)));
    newCommentsData.commentsList.splice(commentIndex, 1);
    newFilmInfoData.comments.splice(commentIndex, 1);
    this._onCommentsDataChange(this._commentsData, newCommentsData);
    this._onDataChange(this._filmData, newFilmInfoData);
  }

  _catchCommentsError(shakeElement, disabledElement) {
    shakeElement.classList.add(ERROR_CLASS.SHAKE);
    setTimeout(() => {
      disabledElement.removeAttribute(`disabled`);
      shakeElement.classList.remove(ERROR_CLASS.SHAKE);
    }, SHAKE_DURATION);
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
