import AbstractComponent from "./abstract.js";

const getFooterStatisticsMarkup = (statistics) => (
  `<p>${statistics.toLocaleString()} movies inside</p>`
);

export default class FooterStatistics extends AbstractComponent {
  constructor(statistics) {
    super();

    this._statistics = statistics;
  }

  getTemplate() {
    return getFooterStatisticsMarkup(this._statistics);
  }
}
