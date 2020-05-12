import * as util from "../utils/common.js";
import {
  renderElement,
  showTitle,
  hideTitle,
} from "../utils/render.js";

import Profile from "../components/profile.js";
import Button from "../components/button.js";
import Films from "../components/films.js";
import Sorting from "../components/sorting.js";

import FilmController from "../controllers/film-controller.js";

import {
  FILTERS,
  TITLE_MESSAGE,
  CardsOther,
} from "../constants.js";

const DEFAULT_SORT = `default`;
const WATCHED_FILTER_NAME = `History`;

export default class MainController {
  constructor(container, models, statistics, api) {
    this._container = container;
    this._filmsLength = 0;
    this._filmsLoadedLength = 0;
    this._filmsModel = models.films;
    this._commentsModel = models.comments;
    this._filmsComponents = null;
    this._filters = null;
    this._statistics = statistics;
    this._api = api;
    this._showMore = null;
    this._profile = null;
    this._sortingComponent = new Sorting();
    this._defaultSort = DEFAULT_SORT;
    this._currentSort = this._defaultSort;
    this._filmsMain = [];
    this._filmsOther = [];
    this._filmsListElements = {};
    this._ratingUpdateFunction = FILTERS.find((item) => (item.NAME === WATCHED_FILTER_NAME)).method;

    this._handlers = {
      onDataChange: this._onDataChange.bind(this),
      onViewChange: this._onViewChange.bind(this),
      onCommentsDataChange: this._onCommentsDataChange.bind(this),
    };

    this._onFilterActivate = this._onFilterActivate.bind(this);
    this._dataChangeModelUpdate = this._dataChangeModelUpdate.bind(this);
    this._dataCommentsChangeModelUpdate = this._dataCommentsChangeModelUpdate.bind(this);
    this._filteredFilmHandler = this._filteredFilmHandler.bind(this);
    this._onStatsClick = this._onStatsClick.bind(this);
    this._onStatsFilterChange = this._onStatsFilterChange.bind(this);

    this._filmsModel.setFilterChangeHandler(this._onFilterActivate);
  }

  _renderSort() {
    this._currentSort = this._defaultSort;
    renderElement(this._container, this._sortingComponent);
    this._sortingComponent.setSortHandler(this._onSortClick.bind(this));
  }

  _showMainScreen() {
    util.hideElement(this._statistics.getElement());
    util.showElement(this._filmsComponent.getElement());
    util.showElement(this._sortingComponent.getElement());
    this._renderSort();
  }

  _renderCardsAll() {
    this._renderCardsMain();
    this._renderCardsOther();
    this._refreshProfile();
  }

  _renderCardsMain(range, sortType = this._currentSort) {
    if (this._checkMainEmpty()) {
      return;
    }

    const [start, num] = range || [0, CardsOther.START.NUM];

    if (!range) {
      this._resetCardsMain();
    }

    this._checkButton();

    const filmsMainSorted = this._filmsModel.getData().slice().sort(this._sortingComponent.getSortType(sortType).fn);

    this._filmsLoadedLength = start === null ? num : this._filmsLoadedLength + num;

    if (!this._showMore && (this._filmsLength > this._filmsLoadedLength)) {
      this._renderButton();
    }

    filmsMainSorted.slice(start, start + num)
      .forEach((item) => {
        const film = new FilmController(this._filmsListElements.main, this._handlers, this._api);
        film.render(item, this._commentsModel.getData(item.id));
        this._collectFilmsMain(film);
      });
  }

  _rerenderCardsMain(type = this._defaultSort, range) {
    this._clearCardsMain();
    this._renderCardsMain(range, type);
  }

  _resetCardsMain() {
    this._filmsLoadedLength = 0;
  }

  _renderCardsOther() {
    const {
      top,
      commented,
    } = this._filmsListElements;

    this._filmsOther.forEach((item) => {
      item.getCard().removeElement(true);
    });

    this._renderCards(top, CardsOther.TOP);
    this._renderCards(commented, CardsOther.COMMENTED);
  }

  _renderCards(container, cardsType) {
    const filmsDataCopy = this._filmsModel.getData().slice().sort(cardsType.method);

    for (let i = 0; i < Math.min(cardsType.NUM, this._filmsLength); i++) {
      const film = new FilmController(container, this._handlers, this._api);
      const currentFilm = filmsDataCopy[i];

      film.render(currentFilm, this._commentsModel.getData(currentFilm.id));
      this._collectFilmsOther(film);
    }
  }

  _renderButton() {
    this._showMore = new Button();
    renderElement(this._filmsListElements.wrapper, this._showMore);

    const onShowMoreElementClick = () => {
      this._checkButton();

      const filmsRangeMore = [this._filmsLoadedLength, CardsOther.MORE.NUM];

      this._renderCardsMain(filmsRangeMore);
    };

    this._showMore.setClickHandler(onShowMoreElementClick);
  }

  _checkMainEmpty() {
    return !this._getFilmsLength() ? showTitle(TITLE_MESSAGE.NO_MOVIES) : hideTitle() && false;
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

    if (this._filmsLoadedLength + CardsOther.MORE.NUM >= this._filmsLength && this._showMore) {
      this._showMore.removeElement(true);
      this._showMore = null;
    }
  }

  _updateFilmsLength() {
    this._filmsLength = this._filmsModel.getData().length;
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

    this._sortingComponent.setActiveMod(type);
    this._rerenderCardsMain(type);
  }

  _dataChangeHandler(oldData, newData, changeFunctions) {
    const id = newData.id;
    const {updateModel, filmHandler} = changeFunctions;

    updateModel(newData);

    this._filmsOther
      .concat(this._filmsMain)
      .filter((film) => film.getData().id === id)
      .forEach((filteredFilm) => {
        filmHandler(filteredFilm, newData);
      });
  }

  _dataChangeModelUpdate(newFilmData) {
    this._filmsModel.updateFilm(newFilmData);
  }

  _dataCommentsChangeModelUpdate(newCommentsData) {
    this._commentsModel.setData(newCommentsData);
  }

  _filteredFilmHandler(filteredFilm, newFilmData) {
    if (this._filmsModel.getCurrentFilter() === this._filmsModel.getDefaultFilter()) {
      filteredFilm.render(newFilmData);
    } else {
      this._rerenderCardsMain(this._currentSort, [null, this._filmsLoadedLength]);
    }
    this._refreshProfile();
  }

  _refreshProfile() {
    this._profile.updateRating(this._filmsModel.getNum(this._ratingUpdateFunction));
  }

  _filteredFilmCommentsHandler(filteredFilm, newCommentsData) {
    filteredFilm.setCommentsData(newCommentsData);
    filteredFilm.getFilmInfo().rerender();
  }

  _onDataChange(oldFilmData, newFilmData) {
    const functions = {
      updateModel: this._dataChangeModelUpdate,
      filmHandler: this._filteredFilmHandler,
    };
    return this._dataChangeHandler(oldFilmData, newFilmData, functions);
  }

  _onCommentsDataChange(oldCommentsData, newCommentsData) {
    const functions = {
      updateModel: this._dataCommentsChangeModelUpdate,
      filmHandler: this._filteredFilmCommentsHandler,
    };
    return this._dataChangeHandler(oldCommentsData, newCommentsData, functions);
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
    this._statistics.rerender();
    util.hideElement(this._filmsComponent.getElement());
    util.hideElement(this._sortingComponent.getElement());
    util.showElement(this._statistics.getElement());
    this._filmsModel.clearFilter();
    this._filters.getComponent().setStatsActive();
  }

  _onStatsFilterChange(evt) {
    this._statistics.activateFilter(evt.target.value);
  }

  render(filters) {
    this._profile = new Profile();
    this._filters = filters;
    this._getFilmsLength();

    renderElement(document.querySelector(`.header`), this._profile);
    this._filmsComponent = new Films();
    this._statistics.updateData();
    renderElement(this._container, this._statistics);
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

    this._filters.getComponent().setClickStats(this._onStatsClick);
    this._statistics.setStatsFilterChangeHandler(this._onStatsFilterChange);
    this._filmsModel.setDataLoadHandler(this._renderCardsAll.bind(this));
    this._filmsModel.setDataLoadHandler(
        this._filters.getComponent()
          .rerender.bind(this._filters.getComponent())
    );
    this._filmsModel.setDataLoadHandler(this._filters.getComponent().setFilterActive.bind(this._filters.getComponent()));
  }
}
