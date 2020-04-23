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
    this._filmsData = null;
    this._showMore = null;
    this._sortComponent = new Sort();
    this._currentSort = `default`;
    this._cardInstancesMain = [];
    this._filmsListElements = {};
  }

  _renderSort() {
    renderElement(this._container, this._sortComponent);
    this._sortComponent.setSortHandler(this._onSortClick.bind(this));
  }

  _renderCardsAll() {
    const {
      title,
      top,
      commented,
    } = this._filmsListElements;

    util.hideElement(title);

    this._renderCardsMain();
    this._renderCards(top, CardsNum.TOP);
    this._renderCards(commented, CardsNum.COMMENTED);
  }

  _renderCardsMain(range, sortType = this._currentSort) {
    if (!range) {
      this._resetCardsMain();
    }

    const [start, num] = range || [0, CardsNum.START];
    const data = this._filmsData.slice().sort(this._sortComponent.getSortType(sortType).fn);

    this._filmsLoadedLength += num;

    if (!this._showMore && (this._filmsLength > this._filmsLoadedLength)) {
      this._renderButton();
    }

    data.slice(start, start + num)
      .forEach((item) => {
        this._renderCard(this._filmsListElements.main, item, true);
      });
  }

  _resetCardsMain() {
    this._filmsLoadedLength = 0;
    this._checkButton();
  }

  _renderCards(container, num) {
    const filmsDataCopy = this._filmsData.slice();

    for (let i = 0; i < Math.min(num, this._filmsLength); i++) {
      this._renderCard(container, util.getRandomFromArray(filmsDataCopy, true));
    }
  }

  _renderCard(container, data, isMain) {
    const card = new Card(data);

    if (isMain) {
      this._collectCardInstanceMain(card);
    }

    renderElement(container, card);

    const filmInfo = new FilmDetails(data);

    card.setClickHandler(this._showFilmInfo(filmInfo));
  }

  _renderButton() {
    this._showMore = new Button();
    renderElement(this._filmsListElements.wrapper, this._showMore);

    const onShowMoreElementClick = () => {
      this._checkButton();

      const filmsRangeMore = [this._filmsLoadedLength, CardsNum.MORE];

      this._renderCardsMain(filmsRangeMore);
    };

    this._showMore.setClickHandler(onShowMoreElementClick);
  }

  _renderFilmInfo(info) {
    this._updateBodyClassList(BODY_HIDE_OVERFLOW_CLASS);
    renderElement(this._bodyElement, info);

    const filmCommentsList = info.getElement().querySelector(`.film-details__comments-list`);
    renderElement(filmCommentsList, new Comments(info.getComments()));
  }

  _collectCardInstanceMain(item) {
    this._cardInstancesMain.push(item);
  }

  _clearCardsMain() {
    this._cardInstancesMain.forEach((item) => {
      item.removeElement();
    });

    this._cardInstancesMain = [];
  }

  _checkButton() {
    if (this._filmsLoadedLength + CardsNum.MORE >= this._filmsLength && this._showMore) {
      this._showMore.removeElement();
      this._showMore = null;
    }
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

  _onSortClick(evt) {
    evt.preventDefault();
    const type = evt.target.getAttribute(`data-sort`);
    if (type === this._currentSort) {
      return;
    }

    this._currentSort = type;

    this._sortComponent.setActiveMod(type);
    this._clearCardsMain();
    this._renderCardsMain(null, type);
  }

  render(filmsData, filtersData) {
    this._filmsLength = filmsData.length;
    this._filmsData = filmsData;

    renderElement(this._container, new Navigation(filtersData));
    this._renderSort(this._filmsData);
    renderElement(this._container, new Films());

    this._filmsListElements = {
      wrapper: document.querySelector(`.films-list`),
      main: document.querySelector(`#filmsList`),
      top: document.querySelector(`#filmsListTop`),
      commented: document.querySelector(`#filmsListCommented`),
      title: document.querySelector(`.films-list__title`),
    };

    if (this._filmsLength) {
      this._renderCardsAll();
    } else {
      this._showTitle(this._filmsListElements.title, TITLE_MESSAGE.NO_MOVIES);
    }
  }
}
