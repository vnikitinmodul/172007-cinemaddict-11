import {KEY_CODE} from "../config.js";
import * as util from "../utils/common.js";
import {renderElement} from "../utils/render.js";

import Button from "../components/button.js";
import Card from "../components/card.js";
import Comments from "../components/film-comments.js";
import FilmDetails from "../components/film-details.js";
import Films from "../components/films.js";
import Navigation from "../components/navigation.js";
import Sort from "../components/sort.js";


const BODY_HIDE_OVERFLOW_CLASS = `hide-overflow`;

const TITLE_MESSAGE = {
  NO_MOVIES: `There are no movies in our database`
};

const CardsNum = {
  START: 5,
  MORE: 5,
  TOP: 2,
  COMMENTED: 2
};

let currentFilmInfo;
let filmsLoadedLength = 0;

const bodyElement = document.body;


export default class MainController {
  constructor(container) {
    this._filmsLength = 0;
    this._container = container;
    this._filmsListElements = {};
  }

  _renderCardsAll(elements, data) {
    const filmsRangeStart = [0, CardsNum.START];

    util.hideElement(elements.title);

    this._renderCardsMain(elements.main, data, filmsRangeStart);
    this._renderCards(elements.top, data, CardsNum.TOP);
    this._renderCards(elements.commented, data, CardsNum.COMMENTED);
  }

  _renderCardsMain(container, data, range) {
    const [start, num] = range;

    filmsLoadedLength += num;

    data.slice(start, start + num)
      .forEach((item) => {
        this._renderCard(container, item);
      });
  }

  _renderCards(container, data, num) {
    for (let i = 0; i < num; i++) {
      this._renderCard(container, util.getRandomFromArray(data));
    }
  }

  _renderCard(container, data) {
    const card = new Card(data);

    renderElement(container, card);

    const filmInfo = new FilmDetails(data);

    card.setClickHandler(this._showFilmInfo(filmInfo));
  }

  _renderButton(elements, data) {
    const showMore = new Button();

    renderElement(elements.wrapper, showMore);

    const onShowMoreElementClick = () => {
      if (filmsLoadedLength + CardsNum.MORE >= this._filmsLength) {
        showMore.removeElement();
      }

      const filmsRangeMore = [filmsLoadedLength, CardsNum.MORE];

      this._renderCardsMain(elements.main, data, filmsRangeMore);
    };

    showMore.setClickHandler(onShowMoreElementClick);
  }

  _renderFilmInfo(info) {
    bodyElement.classList.add(BODY_HIDE_OVERFLOW_CLASS);
    renderElement(bodyElement, info);

    const filmCommentsList = info.getElement().querySelector(`.film-details__comments-list`);
    renderElement(filmCommentsList, new Comments(info.getComments()));
  }

  _showFilmInfo(info) {
    return () => {
      if (currentFilmInfo === info) {
        return;
      }

      this._closeFilmInfo(currentFilmInfo);

      currentFilmInfo = info;

      this._renderFilmInfo(info);

      info.onEscPress = this._onFilmInfoEscPress(info);

      document.addEventListener(`keydown`, info.onEscPress);
      info.setCloseButtonHandler(this._onFilmInfoCloseElementClick(info));
    };
  }

  _removeFilmInfo(info) {
    info.removeElement();
    bodyElement.classList.remove(BODY_HIDE_OVERFLOW_CLASS);
  }

  _closeFilmInfo(info) {
    if (!info) {
      return;
    }

    this._removeFilmInfo(info);

    document.removeEventListener(`keydown`, info.onEscPress);
  }

  _showTitle(element, message) {
    util.showElement(element);
    element.textContent = message;
  }

  _onFilmInfoCloseElementClick(info) {
    return () => {
      currentFilmInfo = null;
      this._closeFilmInfo(info);
    };
  }

  _onFilmInfoEscPress(info) {
    return (evt) => {
      if (evt.key === KEY_CODE.ESC) {
        currentFilmInfo = null;
        this._closeFilmInfo(info);
      }
    };
  }

  render(filmsData, filtersData) {
    this._filmsLength = filmsData.length;

    renderElement(this._container, new Navigation(filtersData));
    renderElement(this._container, new Sort());
    renderElement(this._container, new Films());

    const filmsListElements = {
      wrapper: document.querySelector(`.films-list`),
      main: document.querySelector(`#filmsList`),
      top: document.querySelector(`#filmsListTop`),
      commented: document.querySelector(`#filmsListCommented`),
      title: document.querySelector(`.films-list__title`),
    };

    if (this._filmsLength) {
      this._renderCardsAll(filmsListElements, filmsData);
    } else {
      this._showTitle(filmsListElements.title, TITLE_MESSAGE.NO_MOVIES);
    }

    if (this._filmsLength > CardsNum.START) {
      this._renderButton(filmsListElements, filmsData);
    }
  }
}
