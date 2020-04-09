import {util} from "../util.js";

const getCommentMarkup = (emoji, author, day, text) => (
  `<li class="film-details__comment">
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
  </li>`
);

export const getFilmCommentsMarkup = (commentsData) => {
  return commentsData
    .map(
        (item) => getCommentMarkup(item.emoji, item.author, item.day, item.text)
    ).join(``);
};
