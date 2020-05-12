import moment from "moment";
import {
  POSTERS_PATH,
  ACTION_PROPERTIES,
} from "../constants.js";
import * as util from "../utils/common.js";
import {renderElement} from "../utils/render.js";
import AbstractSmartComponent from "./abstract-smart.js";
import FilmComments from "./film-comments.js";

const FILM_CLOSE_BUTTON = `.film-details__close-btn`;

const getSelectedEmojiTemplate = (emoji) => {
  return emoji ? `<img src="images/emoji/${emoji}.png" width="55" height="55" alt="emoji-${emoji}">` : ``;
};

const getGenresMarkup = (genres) => (
  `<tr class="film-details__row">
    <td class="film-details__term">Genre${genres.length > 1 ? `s` : ``}</td>
    <td class="film-details__cell">
      <span class="film-details__genre">${genres.join(`</span><span class="film-details__genre">`)}</span>
    </td>
  </tr>`
);

const getFilmDetailsMarkup = (filmDetailsData, comments) => {
  const {
    title,
    rating,
    duration,
    director,
    writers,
    actors,
    date,
    genres,
    country,
    poster,
    description,
    age,
    titleOriginal,
    isAddedToWatchlist,
    isMarkedAsWatched,
    isFavorite,
    selectedEmoji,
  } = filmDetailsData;

  return `<section class="film-details">
    <form class="film-details__inner" action="" method="get">
      <div class="form-details__top-container">
        <div class="film-details__close">
          <button class="film-details__close-btn" type="button">close</button>
        </div>
        <div class="film-details__info-wrap">
          <div class="film-details__poster">
            <img class="film-details__poster-img" src="${POSTERS_PATH}${poster}" alt="">

            <p class="film-details__age">+${age}</p>
          </div>

          <div class="film-details__info">
            <div class="film-details__info-head">
              <div class="film-details__title-wrap">
                <h3 class="film-details__title">${title}</h3>
                <p class="film-details__title-original">${titleOriginal}</p>
              </div>

              <div class="film-details__rating">
                <p class="film-details__total-rating">${rating}</p>
              </div>
            </div>

            <table class="film-details__table">
              <tr class="film-details__row">
                <td class="film-details__term">Director</td>
                <td class="film-details__cell">${director}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Writers</td>
                <td class="film-details__cell">${writers.join(`, `)}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Actors</td>
                <td class="film-details__cell">${actors.join(`, `)}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Release Date</td>
                <td class="film-details__cell">${moment(date).format(`DD MMMM YYYY`)}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Runtime</td>
                <td class="film-details__cell">${util.getDurationMoment(duration, true).join(` `)}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Country</td>
                <td class="film-details__cell">${country}</td>
              </tr>
              ${genres.length ? getGenresMarkup(genres) : ``}
            </table>

            <p class="film-details__film-description">${description}</p>
          </div>
        </div>

        <section class="film-details__controls">
          <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${isAddedToWatchlist ? `checked` : ``}>
          <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

          <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${isMarkedAsWatched ? `checked` : ``}>
          <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

          <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${isFavorite ? `checked` : ``}>
          <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
        </section>
      </div>

      <div class="form-details__bottom-container">
        <section class="film-details__comments-wrap">
          <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

          <ul class="film-details__comments-list"></ul>

          <div class="film-details__new-comment">
            <div for="add-emoji" class="film-details__add-emoji-label">
              ${getSelectedEmojiTemplate(selectedEmoji)}
            </div>

            <label class="film-details__comment-label">
              <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
            </label>

            <div class="film-details__emoji-list">
              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile" ${selectedEmoji === `smile` ? `checked` : ``}>
              <label class="film-details__emoji-label" for="emoji-smile">
                <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping" ${selectedEmoji === `sleeping` ? `checked` : ``}>
              <label class="film-details__emoji-label" for="emoji-sleeping">
                <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke" ${selectedEmoji === `puke` ? `checked` : ``}>
              <label class="film-details__emoji-label" for="emoji-puke">
                <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry" ${selectedEmoji === `angry` ? `checked` : ``}>
              <label class="film-details__emoji-label" for="emoji-angry">
                <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
              </label>
            </div>
          </div>
        </section>
      </div>
    </form>
  </section>`;
};

export default class FilmDetails extends AbstractSmartComponent {
  constructor(controller) {
    super();

    this._controller = controller;
    this._onEscPress = null;
    this._onCloseClick = null;
    this._onChangeEmoji = null;
    this._filmInfoActionHandlers = [];
    this._commentsComponent = null;
  }

  getTemplate() {
    return getFilmDetailsMarkup(this._controller.getData(), this.getData());
  }

  getData() {
    return this._controller.getCommentsData().commentsList;
  }

  getCommentsComponent() {
    return this._commentsComponent;
  }

  render() {
    renderElement(document.body, this);
    this.renderComments();
  }

  renderComments() {
    const filmCommentsList = this.getElement().querySelector(`.film-details__comments-list`);
    this._commentsComponent = this._commentsComponent || new FilmComments();

    this._commentsComponent.setData(this.getData());

    renderElement(filmCommentsList, this._commentsComponent);
  }

  rerender() {
    super.rerender();

    if (this._commentsComponent) {
      this._commentsComponent.removeElement();
    }

    this.renderComments();
    this._commentsComponent.recoveryListeners();
  }

  set onEscPress(handler) {
    this._onEscPress = handler;
  }

  get onEscPress() {
    return this._onEscPress;
  }

  recoveryListeners() {
    this.setCloseButtonHandler(this._onCloseClick);
    this._filmInfoActionHandlers.forEach(this.setChangeFilmInfoActionHandler.bind(this));
    this.setChangeEmojiHandler(this._onChangeEmoji);
    this.setSubmitFormHandler(this._onSubmitForm);
  }

  setCloseButtonHandler(handler) {
    this._onCloseClick = handler;
    this.getElement().querySelector(FILM_CLOSE_BUTTON).addEventListener(`click`, handler);
  }

  setChangeFilmInfoActionHandler(param) {
    const maxLength = Object.keys(ACTION_PROPERTIES).length;
    const {id, handler} = param;

    if (this._filmInfoActionHandlers.length === maxLength) {
      this._filmInfoActionHandlers = [];
    }

    this._filmInfoActionHandlers.push(param);
    this.getElement().querySelector(`#${id}`).addEventListener(`change`, handler);
  }

  setChangeEmojiHandler(handler) {
    this._onChangeEmoji = handler;
    this.getElement().querySelectorAll(`.film-details__emoji-item`).forEach((item) => {
      item.addEventListener(`change`, handler);
    });
  }

  setSubmitFormHandler(handler) {
    this._onSubmitForm = handler;
    this.getElement().querySelector(`.film-details__inner`).addEventListener(`keydown`, handler);
  }
}
