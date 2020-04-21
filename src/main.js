import {renderElement} from "./utils/render.js";

import {generateFilms} from "./mock/films.js";
import {generateFilters} from "./mock/filters.js";
import {generateFooterStatistics} from "./mock/footer-statistics.js";
import {generateProfile} from "./mock/profile.js";

import MainController from "./controllers/main-container.js";

import Profile from "./components/profile.js";
import FooterStatistics from "./components/footer-statistics.js";


const filmsData = generateFilms();
const filtersData = generateFilters();
const profileData = generateProfile();
const footerStatisticsData = generateFooterStatistics();

const headerElement = document.querySelector(`.header`);
const mainElement = document.querySelector(`.main`);
const footerElement = document.querySelector(`.footer`);
const footerStatisticsElement = footerElement.querySelector(`.footer__statistics`);

const mainContainer = new MainController(mainElement);


renderElement(headerElement, new Profile(profileData));
renderElement(footerStatisticsElement, new FooterStatistics(footerStatisticsData));

mainContainer.render(filmsData, filtersData);
