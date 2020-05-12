import {
  renderElement,
  showTitle,
  hideTitle,
  showError,
} from "./utils/render.js";
import API from "./api/index.js";

import MainController from "./controllers/main-controller.js";
import FiltersController from "./controllers/filters-controller.js";

import Films from "./models/films.js";
import Comments from "./models/comments.js";

import FooterStatistics from "./components/footer-statistics.js";
import Statistics from "./components/statistics.js";

import {TITLE_MESSAGE} from "./constants.js";

const AUTHORIZATION = `Basic 98ae48tb8*Rv9w4tQ#`;

const mainElement = document.querySelector(`.main`);
const footerElement = document.querySelector(`.footer`);
const footerStatisticsElement = footerElement.querySelector(`.footer__statistics`);

const api = new API(AUTHORIZATION);
const models = {
  films: new Films(),
  comments: new Comments(),
};

const statistics = new Statistics(models.films);
const mainContainer = new MainController(mainElement, models, statistics, api);
const filters = new FiltersController(mainElement, models.films);

filters.render();
mainContainer.render(filters);

showTitle(TITLE_MESSAGE.LOADING);

api.getFilms()
  .then((filmsData) => {
    models.films.setFilms(filmsData);
    hideTitle();
    renderElement(footerStatisticsElement, new FooterStatistics(filmsData.length));
  })
  .catch((err) => showError(err));
