import * as util from "../utils/common.js";
import {renderElement} from "../utils/render.js";

import Button from "../components/button.js";
import Card from "../components/card.js";
import Comments from "../components/film-comments.js";
import FilmDetails from "../components/film-details.js";
import Films from "../components/films.js";
import Navigation from "../components/navigation.js";
import Sort from "../components/sort.js";

import {
  KEY_CODE,
  BODY_HIDE_OVERFLOW_CLASS,
  TITLE_MESSAGE,
  CardsNum,
} from "../constants.js";

export default class MainController {
  constructor(container) {
    this._container = container;
    this._bodyElement = document.body;
    this._filmsLength = 0;
    this._filmsLoadedLength = 0;
    this._currentFilmInfo = null;
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

    this._filmsLoadedLength += num;

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
      if (this._filmsLoadedLength + CardsNum.MORE >= this._filmsLength) {
        showMore.removeElement();
      }

      const filmsRangeMore = [this._filmsLoadedLength, CardsNum.MORE];

      this._renderCardsMain(elements.main, data, filmsRangeMore);
    };

    showMore.setClickHandler(onShowMoreElementClick);
  }

  _renderFilmInfo(info) {
    this._updateBodyClassList(BODY_HIDE_OVERFLOW_CLASS);
    renderElement(this._bodyElement, info);

    const filmCommentsList = info.getElement().querySelector(`.film-details__comments-list`);
    renderElement(filmCommentsList, new Comments(info.getComments()));
  }

  _updateBodyClassList(className, method = `add`) {
    this._bodyElement.classList[method](className);
  }

  _showFilmInfo(info) {
    return () => {
      if (this._currentFilmInfo === info) {
        return;
      }

      this._closeFilmInfo(this._currentFilmInfo);

      this._currentFilmInfo = info;

      this._renderFilmInfo(info);

      info.onEscPress = this._onFilmInfoEscPress(info);

      document.addEventListener(`keydown`, info.onEscPress);
      info.setCloseButtonHandler(this._onFilmInfoCloseElementClick(info));
    };
  }

  _removeFilmInfo(info) {
    info.removeElement();
    this._updateBodyClassList(BODY_HIDE_OVERFLOW_CLASS, `remove`);
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
      this._currentFilmInfo = null;
      this._closeFilmInfo(info);
    };
  }

  _onFilmInfoEscPress(info) {
    return (evt) => {
      if (evt.key === KEY_CODE.ESC) {
        this._currentFilmInfo = null;
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
