import Chart from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import * as util from "../utils/common.js";
import AbstractSmartComponent from "./abstract-smart.js";

import {
  FILTERS,
  FILTERS_STATISTICS,
} from "../constants.js";

const STATS_PARAM = {
  FILTER_NAME: `History`,
  TYPE: `horizontalBar`,
  COLORS: {
    BG_COLOR: `#ffe800`,
    TEXT_COLOR: `#ffffff`,
  },
  POSITIONS: {
    ANCHOR: `start`,
    ALIGN: `start`,
  },
  SIZE: {
    FONT: 20,
    OFFSET: 40,
    PADDING: 100,
    BAR_THICKNESS: 24,
    BAR_HEIGHT: 50,
  },
};

const getFilterName = (name) => name.toLowerCase().replace(` `, `-`);

const getRankMarkup = (rating) => (
  `<p class="statistic__rank">
    Your rank
    <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    <span class="statistic__rank-label">${util.getRatingName(rating)}</span>
  </p>`
);

const getFiltersStatisticsMarkup = (filter) => (
  FILTERS_STATISTICS.map((item) => {
    const itemName = getFilterName(item.NAME);
    return `<input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-${itemName}" value="${itemName}" ${itemName === filter ? `checked` : ``}>
    <label for="statistic-${itemName}" class="statistic__filters-label">${item.NAME}</label>`;
  }).join(``)
);

const getTopGenreMarkup = (dataGenres) => (
  `<li class="statistic__text-item">
    <h4 class="statistic__item-title">Top genre</h4>
    <p class="statistic__item-text">${dataGenres[0].name}</p>
  </li>`
);

const getStatisticsMarkup = (stats, rating, filter) => (
  `<section class="statistic">
    ${rating ? getRankMarkup(rating) : ``}

    <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
      <p class="statistic__filters-description">Show stats:</p>

      ${getFiltersStatisticsMarkup(filter)}
    </form>

    <ul class="statistic__text-list">
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">You watched</h4>
        <p class="statistic__item-text">${stats.rating} <span class="statistic__item-description">movies</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Total duration</h4>
        <p class="statistic__item-text">${util.getDurationMoment(stats.duration)[0]} <span class="statistic__item-description">h</span> ${util.getDurationMoment(stats.duration)[1]} <span class="statistic__item-description">m</span></p>
      </li>
      ${stats.genres.length ? getTopGenreMarkup(stats.genres) : ``}
    </ul>

    <div class="statistic__chart-wrap">
      <canvas class="statistic__chart" width="1000"></canvas>
    </div>

  </section>`
);

export default class Statistics extends AbstractSmartComponent {
  constructor(filmsModel) {
    super();

    this._filmsModel = filmsModel;
    this._statsData = null;
    this._rating = null;
    this._statChart = null;
    this._filterChangeHandler = null;
    this._defaultFilter = getFilterName(FILTERS_STATISTICS[0].NAME);
    this._currentFilter = this._defaultFilter;
  }

  rerender() {
    this.updateData();
    super.rerender();
    this._renderChart();
  }

  recoveryListeners() {
    this.setFilterChangeHandler(this._filterChangeHandler);
  }

  getTemplate() {
    return getStatisticsMarkup(this._statsData, this._rating, this._currentFilter);
  }

  updateData() {
    const findFilter = (item) => (item.NAME === STATS_PARAM.FILTER_NAME);
    const findStatsFilter = (item) => (getFilterName(item.NAME) === this._currentFilter);

    const filmsWatched = this._filmsModel.getData(util.getFilterMethod(FILTERS, findFilter));
    const filteredFilms = filmsWatched.filter(util.getFilterMethod(FILTERS_STATISTICS, findStatsFilter));
    this._statsData = {
      rating: filteredFilms.length,
      duration: filteredFilms.reduce((accum, item) => (accum + item.duration), 0),
      genres: this._getGenres(filteredFilms)
    };
    this._rating = filmsWatched.length;
  }

  activateFilter(filter) {
    if (this._currentFilter === filter) {
      return;
    }

    this._currentFilter = filter;
    this.updateData();
    this.rerender();
  }

  setFilterChangeHandler(handler) {
    this._filterChangeHandler = handler;
    util.setInputsChangeHandler(handler, this.getElement(), `.statistic__filters-input`);
  }

  _renderChart() {
    const statisticCtx = document.querySelector(`.statistic__chart`);

    statisticCtx.height = STATS_PARAM.SIZE.BAR_HEIGHT * this._statsData.genres.length;

    this._statChart = new Chart(statisticCtx, {
      plugins: [ChartDataLabels],
      type: STATS_PARAM.TYPE,
      data: {
        labels: this._statsData.genres.map((item) => (item.name)),
        datasets: [
          {
            data: this._statsData.genres.map((item) => (item.num)),
            backgroundColor: STATS_PARAM.COLORS.BG_COLOR,
            hoverBackgroundColor: STATS_PARAM.COLORS.BG_COLOR,
            anchor: STATS_PARAM.POSITIONS.ANCHOR
          }
        ]
      },
      options: {
        plugins: {
          datalabels: {
            font: {
              size: STATS_PARAM.SIZE.FONT
            },
            color: STATS_PARAM.COLORS.TEXT_COLOR,
            anchor: STATS_PARAM.POSITIONS.ANCHOR,
            align: STATS_PARAM.POSITIONS.ALIGN,
            offset: STATS_PARAM.SIZE.OFFSET
          }
        },
        scales: {
          yAxes: [
            {
              ticks: {
                fontColor: STATS_PARAM.COLORS.TEXT_COLOR,
                padding: STATS_PARAM.SIZE.PADDING,
                fontSize: STATS_PARAM.SIZE.FONT
              },
              gridLines: {
                display: false,
                drawBorder: false
              },
              barThickness: STATS_PARAM.SIZE.BAR_THICKNESS
            }
          ],
          xAxes: [
            {
              ticks: {
                display: false,
                beginAtZero: true
              },
              gridLines: {
                display: false,
                drawBorder: false
              }
            }
          ]
        },
        legend: {
          display: false
        },
        tooltips: {
          enabled: false
        }
      }
    });
  }

  _getFilmGenres(accum) {
    return (genre) => {
      const currentGenre = accum.find((item) => (item.name === genre));
      if (currentGenre) {
        ++currentGenre.num;
      } else {
        accum.push({
          name: genre,
          num: 1,
        });
      }
    };
  }

  _getGenres(films) {
    return films.reduce(
        (accum, film) => {
          film.genres.forEach(
              this._getFilmGenres(accum)
          );
          return accum;
        }, []).sort((a, b) => util.sortNum([a, b], `num`));
  }
}
