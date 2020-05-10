import * as util from "./utils/common.js";
import {renderElement} from "./utils/render.js";
import {FilmsRangeNum} from "./constants.js";

import {generateFilms} from "./mock/films.js";
import {generateComments} from "./mock/comments.js";
import {generateFooterStatistics} from "./mock/footer-statistics.js";
import {generateProfile} from "./mock/profile.js";

import MainController from "./controllers/main-container.js";
import FiltersController from "./controllers/filters.js";

import Films from "./models/films.js";
import Comments from "./models/comments.js";

import Profile from "./components/profile.js";
import FooterStatistics from "./components/footer-statistics.js";
import Statistics from "./components/statistics.js";


const filmsLength = util.getRandomNum(...Object.values(FilmsRangeNum));

const profileData = generateProfile();
const footerStatisticsData = generateFooterStatistics();

const headerElement = document.querySelector(`.header`);
const mainElement = document.querySelector(`.main`);
const footerElement = document.querySelector(`.footer`);
const footerStatisticsElement = footerElement.querySelector(`.footer__statistics`);

const models = {
  films: new Films(),
  comments: new Comments(),
};

models.films.setFilms(generateFilms(filmsLength));
models.comments.setCommentsAll(generateComments(filmsLength));

const statistics = new Statistics();
const mainContainer = new MainController(mainElement, models, statistics);
const filters = new FiltersController(mainElement, models.films);

renderElement(headerElement, new Profile(profileData));
renderElement(footerStatisticsElement, new FooterStatistics(footerStatisticsData));

filters.render();
mainContainer.render();
renderElement(mainElement, statistics);
