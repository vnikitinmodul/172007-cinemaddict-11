import {KEY_CODE} from "../config.js";
import * as util from "../util.js";
import {renderElement} from "../render.js";

import Button from "../components/button.js";
import Card from "../components/card.js";
import Comments from "../components/film-comments.js";
import FilmDetails from "../components/film-details.js";
import Films from "../components/films.js";
import Navigation from "../components/navigation.js";
import Sort from "../components/sort.js";


const BODY_HIDE_OVERFLOW_CLASS = `hide-overflow`;

const TITLE_MESSAGE = {
  NO_MOVIES: `There are no movies in our database`
};

let currentFilmInfo;
let filmsLoadedLength = 0;

const bodyElement = document.querySelector(`body`);


const renderCardsMain = (container, data, range) => {
  const [start, num] = range;

  filmsLoadedLength += num;

  data.slice(start, start + num)
    .forEach((item) => {
      renderCard(container, item);
    });
};

const renderCards = (container, data, num) => {
  for (let i = 0; i < num; i++) {
    renderCard(container, util.getRandomFromArray(data));
  }
};

const renderCard = (container, data) => {
  const card = new Card(data);

  renderElement(container, card);

  const filmInfo = new FilmDetails(data);

  card.setClickHandler(showFilmInfo(filmInfo));
};

const renderFilmInfo = (info) => {
  bodyElement.classList.add(BODY_HIDE_OVERFLOW_CLASS);
  renderElement(bodyElement, info);

  const filmCommentsList = info.getElement().querySelector(`.film-details__comments-list`);
  renderElement(filmCommentsList, new Comments(info.getComments()));
};

const showFilmInfo = (info) => () => {
  if (currentFilmInfo === info) {
    return;
  }

  closeFilmInfo(currentFilmInfo);

  currentFilmInfo = info;

  renderFilmInfo(info);

  info.onEscPress = onFilmInfoEscPress(info);

  document.addEventListener(`keydown`, info.onEscPress);
  info.setCloseButtonHandler(onFilmInfoCloseElementClick(info));
};

const removeFilmInfo = (info) => {
  info.removeElement();
  bodyElement.classList.remove(BODY_HIDE_OVERFLOW_CLASS);
};

const closeFilmInfo = (info) => {
  if (!info) {
    return;
  }

  removeFilmInfo(info);

  document.removeEventListener(`keydown`, info.onEscPress);
};

const showTitle = (element, message) => {
  util.showElement(element);
  element.textContent = message;
};

const onFilmInfoCloseElementClick = (info) => () => {
  currentFilmInfo = null;
  closeFilmInfo(info);
};

const onFilmInfoEscPress = (info) => (evt) => {
  if (evt.key === KEY_CODE.ESC) {
    currentFilmInfo = null;
    closeFilmInfo(info);
  }
};

export default class MainController {
  constructor(container) {
    this._filmsLength = 0;
    this._container = container;
  }

  render(filmsData, filtersData, CardsNum) {
    this._filmsLength = filmsData.length;

    renderElement(this._container, new Navigation(filtersData));
    renderElement(this._container, new Sort());
    renderElement(this._container, new Films());

    const filmsListWrapperElement = document.querySelector(`.films-list`);
    const filmsListElement = document.querySelector(`#filmsList`);
    const filmsListTopElement = document.querySelector(`#filmsListTop`);
    const filmsListCommentedElement = document.querySelector(`#filmsListCommented`);
    const filmsListTitleElement = document.querySelector(`.films-list__title`);

    if (this._filmsLength) {
      const filmsRangeStart = [0, CardsNum.START];

      util.hideElement(filmsListTitleElement);

      renderCardsMain(filmsListElement, filmsData, filmsRangeStart);
      renderCards(filmsListTopElement, filmsData, CardsNum.TOP);
      renderCards(filmsListCommentedElement, filmsData, CardsNum.COMMENTED);
    } else {
      showTitle(filmsListTitleElement, TITLE_MESSAGE.NO_MOVIES);
    }

    if (this._filmsLength > CardsNum.START) {
      const showMore = new Button();

      renderElement(filmsListWrapperElement, showMore);

      const onShowMoreElementClick = () => {
        if (filmsLoadedLength + CardsNum.MORE >= this._filmsLength) {
          showMore.removeElement();
        }

        const filmsRangeMore = [filmsLoadedLength, CardsNum.MORE];

        renderCardsMain(filmsListElement, filmsData, filmsRangeMore);
      };

      showMore.setClickHandler(onShowMoreElementClick);
    }
  }
}
