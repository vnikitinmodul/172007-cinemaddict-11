import {Key} from "./config.js";
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

const CARD_SHOW_DETAILS_SELECTOR = `.film-card__poster, .film-card__title, .film-card__comments`;
const BODY_HIDE_OVERFLOW_CLASS = `hide-overflow`;
const FILM_CLOSE_BUTTON_SELECTOR = `.film-details__close-btn`;

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
  const cardShowDetailsElements = cardElement.querySelectorAll(CARD_SHOW_DETAILS_SELECTOR);

  renderElement(container, cardElement);

  const filmInfo = new FilmDetails(data);

  cardShowDetailsElements.forEach((item) => {
    item.addEventListener(`click`, () => {
      showFilmInfo(filmInfo, data);
    });
  });
};

const showFilmInfo = (filmInfo) => {
  const filmInfoElement = filmInfo.getElement();

  const onFilmInfoCloseElementClick = () => {
    currentFilmInfo = null;
    closeFilmInfo(filmInfo);
  };

  const onFilmInfoEscPress = (evt) => {
    if (evt.key === Key.ESC) {
      currentFilmInfo = null;
      closeFilmInfo(filmInfo);
    }
  };

  if (currentFilmInfo) {
    closeFilmInfo(currentFilmInfo);
  }

  currentFilmInfo = filmInfo;

  bodyElement.classList.add(BODY_HIDE_OVERFLOW_CLASS);

  renderElement(bodyElement, filmInfoElement);

  const filmCommentsList = filmInfoElement.querySelector(`.film-details__comments-list`);
  const filmInfoCloseElement = filmInfoElement.querySelector(FILM_CLOSE_BUTTON_SELECTOR);

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
  bodyElement.classList.remove(BODY_HIDE_OVERFLOW_CLASS);
  infoElement.querySelector(FILM_CLOSE_BUTTON_SELECTOR).removeEventListener(`click`, info.onCloseElementClick);
  document.removeEventListener(`keydown`, info.onEscPress);
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

renderCardsMain(filmsListElement, 0, CardsNum.START);
renderCards(filmsListTopElement, CardsNum.TOP);
renderCards(filmsListCommentedElement, CardsNum.COMMENTED);

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
