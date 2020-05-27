import moment from "moment";
import AbstractSmartComponent from "./abstract-smart.js";

const getCommentMarkup = (item) => {
  const {
    emoji,
    author,
    date,
    text,
    commentId,
  } = item;

  return `<li class="film-details__comment" data-id="${commentId}">
    <span class="film-details__comment-emoji">
      <img src="./images/emoji/${emoji}.png" width="55" height="55" alt="emoji-smile">
    </span>
    <div>
      <p class="film-details__comment-text">${text}</p>
      <p class="film-details__comment-info">
        <span class="film-details__comment-author">${author}</span>
        <span class="film-details__comment-day" title="${moment(date).format(`YYYY/MM/DD HH:mm`)}">${moment(date).fromNow()}</span>
        <button class="film-details__comment-delete" data-id="${commentId}">Delete</button>
      </p>
    </div>
  </li>`;
};

export default class FilmComments extends AbstractSmartComponent {
  constructor() {
    super();

    this._comments = [];
    this._onClickDeleteComment = null;
  }

  getElement() {
    return super.getElement(true);
  }

  getTemplate() {
    return this._getFilmCommentsMarkup(this._comments);
  }

  recoveryListeners() {
    this.setDeleteCommentHandler(this._onClickDeleteComment);
  }

  setData(comments) {
    this._comments = comments;
  }

  setDeleteCommentHandler(handler) {
    this._onClickDeleteComment = handler;

    this.getElement().querySelectorAll(`.film-details__comment-delete`).forEach((item) => {
      item.addEventListener(`click`, handler);
    });
  }

  _getFilmCommentsMarkup(commentsData) {
    return commentsData
      .map(getCommentMarkup).join(``);
  }
}
