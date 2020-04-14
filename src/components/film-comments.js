import * as util from "../util.js";

const getCommentMarkup = (item) => {
  const {emoji, author, day, text} = item;

  return `<li class="film-details__comment">
    <span class="film-details__comment-emoji">
      <img src="./images/emoji/${emoji}.png" width="55" height="55" alt="emoji-smile">
    </span>
    <div>
      <p class="film-details__comment-text">${text}</p>
      <p class="film-details__comment-info">
        <span class="film-details__comment-author">${author}</span>
        <span class="film-details__comment-day">${day.getFullYear()}/${util.addZeroBefore(day.getMonth())}/${util.addZeroBefore(day.getDate())} ${util.addZeroBefore(day.getHours())}:${util.addZeroBefore(day.getMinutes())}</span>
        <button class="film-details__comment-delete">Delete</button>
      </p>
    </div>
  </li>`;
};

const getFilmCommentsMarkup = (commentsData) => (
  commentsData
    .map(getCommentMarkup).join(``)
);

export default class Comments {
  constructor(commentsData) {
    this._comments = commentsData;
    this._element = null;
  }

  getTemplate() {
    return getFilmCommentsMarkup(this._comments);
  }

  getElement() {
    if (this._element === null) {
      this._element = util.createElement(this.getTemplate(), true);
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
