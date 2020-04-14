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
      renderElement(container, new Card(item).getElement());
    });
};

const renderCards = (container, num) => {
  for (let i = 0; i < num; i++) {
    renderElement(container, new Card(util.getRandomFromArray(filmsData)).getElement());
  }
};

renderElement(headerElement, new Profile(profileData).getElement());
renderElement(mainElement, new Navigation(filtersData).getElement());
renderElement(mainElement, new Sort().getElement());
renderElement(mainElement, new Films().getElement());
renderElement(footerStatisticsElement, new FooterStatistics(footerStatisticsData).getElement());
renderElement(bodyElement, new FilmDetails(filmsData[0]).getElement());


const filmsListWrapperElement = document.querySelector(`.films-list`);
const filmsListElement = document.querySelector(`#filmsList`);
const filmsListTopElement = document.querySelector(`#filmsListTop`);
const filmsListCommentedElement = document.querySelector(`#filmsListCommented`);
const filmCommentsList = document.querySelector(`.film-details__comments-list`);

renderElement(filmCommentsList, new Comments(filmsData[0].comments).getElement());

renderCardsMain(filmsListElement, 0, CardsNum.START);
renderCards(filmsListTopElement, CardsNum.TOP);
renderCards(filmsListCommentedElement, CardsNum.COMMENTED);

if (filmsLength > CardsNum.START) {
  const buttonMore = new Button();
  const showMoreElement = buttonMore.getElement();

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
