import * as util from "../utils/common.js";
import {renderElement} from "../utils/render.js";

import Button from "../components/button.js";
import Films from "../components/films.js";
import Navigation from "../components/navigation.js";
import Sort from "../components/sort.js";

import FilmController from "../controllers/film.js";

import {
  TITLE_MESSAGE,
  CardsNum,
} from "../constants.js";

export default class MainController {
  constructor(container) {
    this._container = container;
    this._filmsLength = 0;
    this._filmsLoadedLength = 0;
    this._filmsData = null;
    this._showMore = null;
    this._sortComponent = new Sort();
    this._currentSort = `default`;
    this._filmsMain = [];
    this._filmsOther = [];
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
        const film = new FilmController(this._filmsListElements.main, this._onDataChange, this._onViewChange.bind(this));
        film.render(item);
        this._collectFilmsMain(film);
      });
  }

  _resetCardsMain() {
    this._filmsLoadedLength = 0;
    this._checkButton();
  }

  _renderCards(container, num) {
    const filmsDataCopy = this._filmsData.slice();

    for (let i = 0; i < Math.min(num, this._filmsLength); i++) {
      const film = new FilmController(container, this._onDataChange, this._onViewChange.bind(this));
      film.render(util.getRandomFromArray(filmsDataCopy, true));
      this._collectFilmsOther(film);
    }
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

  _collectFilmsMain(item) {
    this._filmsMain.push(item);
  }

  _collectFilmsOther(item) {
    this._filmsOther.push(item);
  }

  _clearCardsMain() {
    this._filmsMain.forEach((item) => {
      item.getCard().removeElement(true);
    });

    this._filmsMain = [];
  }

  _checkButton() {
    if (this._filmsLoadedLength + CardsNum.MORE >= this._filmsLength && this._showMore) {
      this._showMore.removeElement(true);
      this._showMore = null;
    }
  }

  _showTitle(element, message) {
    util.showElement(element);
    element.textContent = message;
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

  _onDataChange(oldData, newData) {
    this.render(newData);
  }

  _onViewChange() {
    this._filmsOther.concat(this._filmsMain).forEach((item) => {
      item.closeFilmInfo(item.getFilmInfo());
    });
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
