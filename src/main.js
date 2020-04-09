import {util} from "./util.js";

import {generateFilms} from "./mock/films.js";
import {generateFilters} from "./mock/filters.js";
import {generateProfile} from "./mock/profile.js";
import {generateFooterStatistics} from "./mock/footer-statistics.js";

import {getProfileMarkup} from "./components/profile.js";
import {getNavigationMarkup} from "./components/navigation.js";
import {getSortMarkup} from "./components/sort.js";
import {getFilmsMarkup} from "./components/films.js";
import {getFilmDetailsMarkup} from "./components/film-details.js";
import {getFilmCommentsMarkup} from "./components/film-comments.js";
import {getButtonMarkup} from "./components/button.js";
import {getFooterStatisticsMarkup} from "./components/footer-statistics.js";
import {getCardMarkup} from "./components/card.js";

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

const renderMarkup = (container, markup, position = `beforeend`) => {
  container.insertAdjacentHTML(position, markup);
};

const renderCardsMain = (container, start, num) => {
  filmsLoadedLength += num;

  filmsData.slice(start, start + num)
    .forEach((item) => {
      renderMarkup(container, getCardMarkup(item));
    });
};

const renderCards = (container, num) => {
  for (let i = 0; i < num; i++) {
    renderMarkup(container, getCardMarkup(util.getRandomFromArray(filmsData)));
  }
};

renderMarkup(headerElement, getProfileMarkup(profileData));
renderMarkup(mainElement, getNavigationMarkup(filtersData));
renderMarkup(mainElement, getSortMarkup());
renderMarkup(mainElement, getFilmsMarkup());
renderMarkup(footerStatisticsElement, getFooterStatisticsMarkup(footerStatisticsData));
renderMarkup(bodyElement, getFilmDetailsMarkup(filmsData[0]));


const filmsListWrapperElement = document.querySelector(`.films-list`);
const filmsListElement = document.querySelector(`#filmsList`);
const filmsListTopElement = document.querySelector(`#filmsListTop`);
const filmsListCommentedElement = document.querySelector(`#filmsListCommented`);
const filmCommentsList = document.querySelector(`.film-details__comments-list`);

renderMarkup(filmCommentsList, getFilmCommentsMarkup(filmsData[0].comments));


renderCardsMain(filmsListElement, 0, CardsNum.START);
renderCards(filmsListTopElement, CardsNum.TOP);
renderCards(filmsListCommentedElement, CardsNum.COMMENTED);

if (filmsLength > CardsNum.START) {
  renderMarkup(filmsListWrapperElement, getButtonMarkup());
  const showMoreElement = filmsListWrapperElement.querySelector(`.films-list__show-more`);

  const onShowMoreElementClick = () => {
    if (filmsLoadedLength + CardsNum.MORE >= filmsLength) {
      showMoreElement.removeEventListener(`click`, onShowMoreElementClick);
      showMoreElement.remove();
    }

    renderCardsMain(filmsListElement, filmsLoadedLength, CardsNum.MORE);
  };

  showMoreElement.addEventListener(`click`, onShowMoreElementClick);
}
