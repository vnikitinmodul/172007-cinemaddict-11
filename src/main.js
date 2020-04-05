import {getProfileMarkup} from "./components/profile.js";
import {getNavigationMarkup} from "./components/navigation.js";
import {getSortMarkup} from "./components/sort.js";
import {getFilmsMarkup} from "./components/films.js";
import {getFilmDetailsMarkup} from "./components/film-details.js";
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

const renderMarkup = (container, markup, position = `beforeend`) => {
  container.insertAdjacentHTML(position, markup);
};

const renderCards = (container, num, markup = getCardMarkup()) => {
  for (let i = 0; i < num; i++) {
    renderMarkup(container, markup);
  }
};

renderMarkup(headerElement, getProfileMarkup());
renderMarkup(mainElement, getNavigationMarkup());
renderMarkup(mainElement, getSortMarkup());
renderMarkup(mainElement, getFilmsMarkup());
renderMarkup(bodyElement, getFilmDetailsMarkup());


const filmsListWrapperElement = document.querySelector(`.films-list`);
const filmsListElement = document.querySelector(`#filmsList`);
const filmsListTopElement = document.querySelector(`#filmsListTop`);
const filmsListCommentedElement = document.querySelector(`#filmsListCommented`);

renderMarkup(filmsListWrapperElement, getButtonMarkup());

renderCards(filmsListElement, CardsNum.LIST);
renderCards(filmsListTopElement, CardsNum.TOP);
renderCards(filmsListCommentedElement, CardsNum.COMMENTED);
