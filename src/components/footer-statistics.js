import * as util from "../util.js";

const getFooterStatisticsMarkup = (statistics) => (
  `<p>${statistics.toLocaleString()} movies inside</p>`
);

export default class FooterStatistics {
  constructor(statistics) {
    this._statistics = statistics;
    this._element = null;
  }

  getTemplate() {
    return getFooterStatisticsMarkup(this._statistics);
  }

  getElement() {
    if (this._element === null) {
      this._element = util.createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
