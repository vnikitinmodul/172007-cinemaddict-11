import * as util from "../utils/common.js";
import {renderElement} from "../utils/render.js";

import Button from "../components/button.js";
import Films from "../components/films.js";
import Sort from "../components/sort.js";

import FilmController from "../controllers/film.js";

import {
  TITLE_MESSAGE,
  CardsNum,
} from "../constants.js";

export default class MainController {
  constructor(container, models, statistics) {
    this._container = container;
    this._filmsLength = 0;
    this._filmsLoadedLength = 0;
    this._filmsModel = models.films;
    this._commentsModel = models.comments;
    this._filmsComponents = null;
    this._statistics = statistics;
    this._showMore = null;
    this._navigation = null;
    this._sortComponent = new Sort();
    this._defaultSort = `default`;
    this._currentSort = this._defaultSort;
    this._filmsMain = [];
    this._filmsOther = [];
    this._filmsListElements = {};

    this._handlers = {
      onDataChange: this._onDataChange.bind(this),
      onViewChange: this._onViewChange.bind(this),
      onCommentsDataChange: this._onCommentsDataChange.bind(this),
    };

    this._onFilterActivate = this._onFilterActivate.bind(this);
    this._dataChangeModelUpdate = this._dataChangeModelUpdate.bind(this);
    this._dataCommentsChangeModelUpdate = this._dataCommentsChangeModelUpdate.bind(this);

    this._filmsModel.setFilterChangeHandler(this._onFilterActivate);
  }

  _renderSort() {
    this._currentSort = this._defaultSort;
    renderElement(this._container, this._sortComponent);
    this._sortComponent.setSortHandler(this._onSortClick.bind(this));
  }

  _showMainScreen() {
    util.hideElement(this._statistics.getElement());
    util.showElement(this._filmsComponent.getElement());
    this._renderSort();
  }

  _renderCardsAll() {
    const {
      top,
      commented,
    } = this._filmsListElements;

    this._renderCardsMain();
    this._renderCards(top, CardsNum.TOP);
    this._renderCards(commented, CardsNum.COMMENTED);
  }

  _renderCardsMain(range, sortType = this._currentSort) {
    if (this._checkMainEmpty()) {
      return;
    }

    if (!range) {
      this._resetCardsMain();
    }

    const [start, num] = range || [0, CardsNum.START];
    const data = this._filmsModel.getFilms().slice().sort(this._sortComponent.getSortType(sortType).fn);

    this._filmsLoadedLength += num;

    if (!this._showMore && (this._filmsLength > this._filmsLoadedLength)) {
      this._renderButton();
    }

    data.slice(start, start + num)
      .forEach((item) => {
        const film = new FilmController(this._filmsListElements.main, this._handlers);
        film.render(item, this._commentsModel.getComments(item.id));
        this._collectFilmsMain(film);
      });
  }

  _rerenderCardsMain(type = this._defaultSort) {
    this._clearCardsMain();
    this._renderCardsMain(null, type);
  }

  _resetCardsMain() {
    this._filmsLoadedLength = 0;
    this._checkButton();
  }

  _renderCards(container, num) {
    const filmsDataCopy = this._filmsModel.getFilms().slice();

    for (let i = 0; i < Math.min(num, this._filmsLength); i++) {
      const film = new FilmController(container, this._handlers);
      const currentFilm = util.getRandomFromArray(filmsDataCopy, true);
      film.render(currentFilm, this._commentsModel.getComments(currentFilm.id));
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

  _checkMainEmpty() {
    return !this._getFilmsLength() ? this._showTitle(this._filmsListElements.title, TITLE_MESSAGE.NO_MOVIES) : util.hideElement(this._filmsListElements.title) && false;
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
    this._getFilmsLength();

    if (this._filmsLoadedLength + CardsNum.MORE >= this._filmsLength && this._showMore) {
      this._showMore.removeElement(true);
      this._showMore = null;
    }
  }

  _showTitle(element, message) {
    util.showElement(element);
    element.textContent = message;
  }

  _updateFilmsLength() {
    this._filmsLength = this._filmsModel.getFilms().length;
  }

  _getFilmsLength() {
    this._updateFilmsLength();

    return this._filmsLength;
  }

  _onSortClick(evt) {
    evt.preventDefault();
    const type = evt.target.getAttribute(`data-sort`);
    if (type === this._currentSort) {
      return;
    }

    this._currentSort = type;

    this._sortComponent.setActiveMod(type);
    this._rerenderCardsMain(type);
  }

  _dataChangeHandler(data, newData, functions) {
    const id = data.id;
    const {updateModel, filmHandler} = functions;

    updateModel(newData);

    this._filmsOther
      .concat(this._filmsMain)
      .filter((film) => film.getData().id === id)
      .forEach((filteredFilm) => {
        filmHandler(filteredFilm, newData);
      });
  }

  _dataChangeModelUpdate(newData) {
    this._filmsModel.updateFilm(newData);
  }

  _dataCommentsChangeModelUpdate(newData) {
    this._commentsModel.setComments(newData);
  }

  _filteredFilmHandler(filteredFilm, newData) {
    filteredFilm.render(newData);
  }

  _filteredFilmCommentsHandler(filteredFilm, newData) {
    filteredFilm.setCommentsData(newData);
    filteredFilm.getFilmInfo().rerender();
  }

  _onDataChange(data, newData) {
    const functions = {
      updateModel: this._dataChangeModelUpdate,
      filmHandler: this._filteredFilmHandler,
    };
    return this._dataChangeHandler(data, newData, functions);
  }

  _onCommentsDataChange(data, newData) {
    const functions = {
      updateModel: this._dataCommentsChangeModelUpdate,
      filmHandler: this._filteredFilmCommentsHandler,
    };
    return this._dataChangeHandler(data, newData, functions);
  }

  _onViewChange() {
    this._filmsOther.concat(this._filmsMain).forEach((item) => {
      item.closeFilmInfo();
    });
  }

  _onFilterActivate() {
    this._showMainScreen();
    this._rerenderCardsMain();
  }

  _onStatsClick() {
    util.showElement(this._statistics);
  }

  render() {
    this._getFilmsLength();

    this._filmsComponent = new Films();
    this._showMainScreen();
    renderElement(this._container, this._filmsComponent);

    this._filmsListElements = {
      wrapper: document.querySelector(`.films-list`),
      main: document.querySelector(`#filmsList`),
      top: document.querySelector(`#filmsListTop`),
      commented: document.querySelector(`#filmsListCommented`),
      title: document.querySelector(`.films-list__title`),
    };

    this._renderCardsAll();
  }
}
