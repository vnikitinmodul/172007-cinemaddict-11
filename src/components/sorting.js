import * as util from "../utils/common.js";
import AbstractComponent from "./abstract.js";

const SORT_CLASSES = {
  ELEMENT: `sort__button`,
  ACTIVE_MOD: `--active`,
};

const classActive = `${SORT_CLASSES.ELEMENT}${SORT_CLASSES.ACTIVE_MOD}`;

const sortTypes = [
  {
    name: `default`,
    fn: () => {},
  },
  {
    name: `date`,
    fn: (a, b) => (Date.parse(b.date) - Date.parse(a.date)),
  },
  {
    name: `rating`,
    fn: (a, b) => util.sortNum([a, b], `rating`),
  },
];

const getSortMarkup = () => (
  `<ul class="sort">
    ${sortTypes.map((item, i) => (
    `<li><a href="#" class="${SORT_CLASSES.ELEMENT}${ i === 0 ? ` ${classActive}` : ``}" data-sort="${item.name}">Sort by ${item.name}</a></li>`
  )).join(``)}
  </ul>`
);

export default class Sorting extends AbstractComponent {
  constructor() {
    super();

    this._sortTypes = sortTypes;
  }

  getTemplate() {
    return getSortMarkup();
  }

  setHandler(handler) {
    this.getElement()
      .querySelectorAll(`.${SORT_CLASSES.ELEMENT}`)
      .forEach((item) => {
        item.addEventListener(`click`, handler);
      });
  }

  getType(type) {
    return this._sortTypes.find((item) => (item.name === type));
  }

  setActiveMod(type) {
    this._clearActiveMod();
    this.getElement()
      .querySelector(`.${SORT_CLASSES.ELEMENT}[data-sort=${type}]`)
      .classList.add(classActive);
  }

  _clearActiveMod() {
    this.getElement()
      .querySelectorAll(`.${classActive}`)
      .forEach((item) => {
        item.classList.remove(classActive);
      });
  }
}
