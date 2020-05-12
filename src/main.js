import {
  renderElement,
  showTitle,
  hideTitle,
  showError,
} from "./utils/render.js";
import API from "./api.js";

import MainController from "./controllers/main-container.js";
import FiltersController from "./controllers/filters.js";

import Films from "./models/films.js";
import Comments from "./models/comments.js";

import FooterStatistics from "./components/footer-statistics.js";

import {TITLE_MESSAGE} from "./constants.js";

const AUTHORIZATION = `Basic 98ae48tb8*Rv9w4tQ#`;

const mainElement = document.querySelector(`.main`);
const footerElement = document.querySelector(`.footer`);
const footerStatisticsElement = footerElement.querySelector(`.footer__statistics`);

const api = new API(AUTHORIZATION);
const films = new Films();
const comments = new Comments();
const mainContainer = new MainController(mainElement, films, comments, api);
const filters = new FiltersController(mainElement, films);

filters.render();
mainContainer.render(filters);

showTitle(TITLE_MESSAGE.LOADING);

api.getFilms()
  .then((filmsData) => {
    films.setFilms(filmsData);
    hideTitle();
    renderElement(footerStatisticsElement, new FooterStatistics(filmsData.length));
  })
  .catch((err) => showError(err));
