import {KEY_CODE} from "./config.js";
import * as util from "./util.js";

import {generateFilms} from "./mock/films.js";
import {generateFilters} from "./mock/filters.js";
import {generateFooterStatistics} from "./mock/footer-statistics.js";
import {generateProfile} from "./mock/profile.js";

import Button from "./components/button.js";
import Card from "./components/card.js";
import Comments from "./components/film-comments.js";
import FilmDetails from "./components/film-details.js";
import Films from "./components/films.js";
import FooterStatistics from "./components/footer-statistics.js";
import Navigation from "./components/navigation.js";
import Profile from "./components/profile.js";
import Sort from "./components/sort.js";

const SELECTOR = {
  CARD_SHOW_DETAILS: [
    `.film-card__poster`,
    `.film-card__title`,
    `.film-card__comments`,
  ],
  FILM_CLOSE_BUTTON: `.film-details__close-btn`,
  BODY_HIDE_OVERFLOW_CLASS: `hide-overflow`,
};

const TITLE_MESSAGE = {
  NO_MOVIES: `There are no movies in our database`
};

const CardsNum = {
  START: 5,
  MORE: 5,
  TOP: 2,
  COMMENTED: 2
};

const headerElement = document.querySelector(`.header`);
const mainElement = document.querySelector(`.main`);
const bodyElement = document.querySelector(`body`);
const footerStatisticsElement = document.querySelector(`.footer__statistics`);

const filmsData = generateFilms();
const filtersData = generateFilters();
const profileData = generateProfile();
const footerStatisticsData = generateFooterStatistics();

const filmsLength = filmsData.length;
let filmsLoadedLength = 0;
let currentFilmInfo;

const renderElement = (container, element, isAfterBegin) => {
  if (isAfterBegin) {
    container.prepend(element);
  } else {
    container.append(element);
  }
};

const renderCardsMain = (container, start, num) => {
  filmsLoadedLength += num;

  filmsData.slice(start, start + num)
    .forEach((item) => {
      renderCard(container, item);
    });
};

const renderCards = (container, num) => {
  for (let i = 0; i < num; i++) {
    renderCard(container, util.getRandomFromArray(filmsData));
  }
};

const renderCard = (container, data) => {
  const cardElement = new Card(data).getElement();
  const cardShowDetailsElements = cardElement.querySelectorAll(SELECTOR.CARD_SHOW_DETAILS.join(`, `));

  renderElement(container, cardElement);

  const filmInfo = new FilmDetails(data);

  cardShowDetailsElements.forEach((item) => {
    item.addEventListener(`click`, showFilmInfo(filmInfo));
  });
};

const showFilmInfo = (filmInfo) => () => {
  const filmInfoElement = filmInfo.getElement();

  const onFilmInfoCloseElementClick = () => {
    currentFilmInfo = null;
    closeFilmInfo(filmInfo);
  };

  const onFilmInfoEscPress = (evt) => {
    if (evt.key === KEY_CODE.ESC) {
      currentFilmInfo = null;
      closeFilmInfo(filmInfo);
    }
  };

  if (currentFilmInfo === filmInfo) {
    return;
  } else if (currentFilmInfo) {
    closeFilmInfo(currentFilmInfo);
  }

  currentFilmInfo = filmInfo;

  bodyElement.classList.add(SELECTOR.BODY_HIDE_OVERFLOW_CLASS);

  renderElement(bodyElement, filmInfoElement);

  const filmCommentsList = filmInfoElement.querySelector(`.film-details__comments-list`);
  const filmInfoCloseElement = filmInfoElement.querySelector(SELECTOR.FILM_CLOSE_BUTTON);

  renderElement(filmCommentsList, new Comments(filmInfo.getComments()).getElement());

  filmInfoCloseElement.addEventListener(`click`, onFilmInfoCloseElementClick);
  document.addEventListener(`keydown`, onFilmInfoEscPress);

  filmInfo.onCloseElementClick = onFilmInfoCloseElementClick;
  filmInfo.onEscPress = onFilmInfoEscPress;
};

const closeFilmInfo = (info) => {
  const infoElement = info.getElement();

  info.removeElement();
  infoElement.remove();
  bodyElement.classList.remove(SELECTOR.BODY_HIDE_OVERFLOW_CLASS);
  infoElement.querySelector(SELECTOR.FILM_CLOSE_BUTTON).removeEventListener(`click`, info.onCloseElementClick);
  document.removeEventListener(`keydown`, info.onEscPress);
};

const showTitle = (message) => {
  util.showElement(filmsListTitleElement);
  filmsListTitleElement.textContent = message;
};

renderElement(headerElement, new Profile(profileData).getElement());
renderElement(mainElement, new Navigation(filtersData).getElement());
renderElement(mainElement, new Sort().getElement());
renderElement(mainElement, new Films().getElement());
renderElement(footerStatisticsElement, new FooterStatistics(footerStatisticsData).getElement());


const filmsListWrapperElement = document.querySelector(`.films-list`);
const filmsListElement = document.querySelector(`#filmsList`);
const filmsListTopElement = document.querySelector(`#filmsListTop`);
const filmsListCommentedElement = document.querySelector(`#filmsListCommented`);
const filmsListTitleElement = document.querySelector(`.films-list__title`);

if (filmsLength) {
  util.hideElement(filmsListTitleElement);

  renderCardsMain(filmsListElement, 0, CardsNum.START);
  renderCards(filmsListTopElement, CardsNum.TOP);
  renderCards(filmsListCommentedElement, CardsNum.COMMENTED);
} else {
  showTitle(TITLE_MESSAGE.NO_MOVIES);
}

if (filmsLength > CardsNum.START) {
  const showMoreElement = new Button().getElement();

  renderElement(filmsListWrapperElement, showMoreElement);

  const onShowMoreElementClick = () => {
    if (filmsLoadedLength + CardsNum.MORE >= filmsLength) {
      showMoreElement.removeEventListener(`click`, onShowMoreElementClick);
      showMoreElement.remove();
    }

    renderCardsMain(filmsListElement, filmsLoadedLength, CardsNum.MORE);
  };

  showMoreElement.addEventListener(`click`, onShowMoreElementClick);
}
