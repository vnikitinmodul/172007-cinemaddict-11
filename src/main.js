import {util} from "./util.js";

import {generateFilms} from "./mock/films.js";
import {generateFilters} from "./mock/filters.js";

import {getProfileMarkup} from "./components/profile.js";
import {getNavigationMarkup} from "./components/navigation.js";
import {getSortMarkup} from "./components/sort.js";
import {getFilmsMarkup} from "./components/films.js";
import {getFilmDetailsMarkup} from "./components/film-details.js";
import {getFilmCommentsMarkup} from "./components/film-comments.js";
import {getButtonMarkup} from "./components/button.js";
import {getCardMarkup} from "./components/card.js";

const CardsNum = {
  LIST: 5,
  TOP: 2,
  COMMENTED: 2
};

const headerElement = document.querySelector(`.header`);
const mainElement = document.querySelector(`.main`);
const bodyElement = document.querySelector(`body`);

const filmsData = generateFilms();
const filtersData = generateFilters();


const renderMarkup = (container, markup, position = `beforeend`) => {
  container.insertAdjacentHTML(position, markup);
};

const renderCardsMain = (container, num) => {
  filmsData.slice(0, num)
    .forEach((item) => {
      renderMarkup(container, getCardMarkup(item));
    });
};

const renderCards = (container, num) => {
  for (let i = 0; i < num; i++) {
    renderMarkup(container, getCardMarkup(util.getRandomFromArray(filmsData)));
  }
};

renderMarkup(headerElement, getProfileMarkup());
renderMarkup(mainElement, getNavigationMarkup(filtersData));
renderMarkup(mainElement, getSortMarkup());
renderMarkup(mainElement, getFilmsMarkup());
renderMarkup(bodyElement, getFilmDetailsMarkup(filmsData[0]));


const filmsListWrapperElement = document.querySelector(`.films-list`);
const filmsListElement = document.querySelector(`#filmsList`);
const filmsListTopElement = document.querySelector(`#filmsListTop`);
const filmsListCommentedElement = document.querySelector(`#filmsListCommented`);
const filmCommentsList = document.querySelector(`.film-details__comments-list`);

renderMarkup(filmCommentsList, getFilmCommentsMarkup(filmsData[0].comments));

renderMarkup(filmsListWrapperElement, getButtonMarkup());

renderCardsMain(filmsListElement, CardsNum.LIST);
renderCards(filmsListTopElement, CardsNum.TOP);
renderCards(filmsListCommentedElement, CardsNum.COMMENTED);
