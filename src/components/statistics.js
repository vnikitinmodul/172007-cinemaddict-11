import Chart from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import * as util from "../utils/common.js";
import AbstractSmartComponent from "./abstract-smart.js";

import {
  FILTERS,
  FILTERS_STATISTICS,
} from "../constants.js";

const STATS_FILTER_NAME = `History`;
const STATS_TYPE = `horizontalBar`;
const STATS_COLORS = {
  BG_COLOR: `#ffe800`,
  TEXT_COLOR: `#ffffff`,
};
const STATS_POSITIONS = {
  ANCHOR: `start`,
  ALIGN: `start`,
};
const StatSize = {
  FONT: 20,
  OFFSET: 40,
  PADDING: 100,
  BAR_THICKNESS: 24,
  BAR_HEIGHT: 50,
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

const getStaticticsMarkup = (stats, rating, filter) => (
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

export default class Statictics extends AbstractSmartComponent {
  constructor(filmsModel) {
    super();

    this._filmsModel = filmsModel;
    this._data = null;
    this._rating = null;
    this._statChart = null;
    this._statsFilterChangeHandler = null;
    this._defaultFilter = getFilterName(FILTERS_STATISTICS[0].NAME);
    this._currentFilter = this._defaultFilter;
  }

  _renderChart() {
    const statisticCtx = document.querySelector(`.statistic__chart`);

    statisticCtx.height = StatSize.BAR_HEIGHT * this._data.genres.length;

    this._statChart = new Chart(statisticCtx, {
      plugins: [ChartDataLabels],
      type: STATS_TYPE,
      data: {
        labels: this._data.genres.map((item) => (item.name)),
        datasets: [
          {
            data: this._data.genres.map((item) => (item.num)),
            backgroundColor: STATS_COLORS.BG_COLOR,
            hoverBackgroundColor: STATS_COLORS.BG_COLOR,
            anchor: STATS_POSITIONS.ANCHOR
          }
        ]
      },
      options: {
        plugins: {
          datalabels: {
            font: {
              size: StatSize.FONT
            },
            color: STATS_COLORS.TEXT_COLOR,
            anchor: STATS_POSITIONS.ANCHOR,
            align: STATS_POSITIONS.ALIGN,
            offset: StatSize.OFFSET
          }
        },
        scales: {
          yAxes: [
            {
              ticks: {
                fontColor: STATS_COLORS.TEXT_COLOR,
                padding: StatSize.PADDING,
                fontSize: StatSize.FONT
              },
              gridLines: {
                display: false,
                drawBorder: false
              },
              barThickness: StatSize.BAR_THICKNESS
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

  _getGenres(films) {
    return films.reduce(
        (accum, film) => {
          film.genres.forEach(
              (genre) => {
                const currentGenre = accum.find((item) => (item.name === genre));
                if (currentGenre) {
                  ++currentGenre.num;
                } else {
                  accum.push({
                    name: genre,
                    num: 1,
                  });
                }
              }
          );
          return accum;
        }, []).sort((a, b) => (parseFloat(b.num) - parseFloat(a.num)));
  }

  recoveryListeners() {
    this.setStatsFilterChangeHandler(this._statsFilterChangeHandler);
  }

  rerender() {
    this.updateData();
    super.rerender();
    this._renderChart();
  }

  getTemplate() {
    return getStaticticsMarkup(this._data, this._rating, this._currentFilter);
  }

  updateData() {
    const filmsWatched = this._filmsModel.getFilms(FILTERS.find((item) => (item.NAME === STATS_FILTER_NAME)).FUNCTION);
    const filteredFilms = filmsWatched.filter(
        FILTERS_STATISTICS.find(
            (item) => (getFilterName(item.NAME) === this._currentFilter)
        ).FUNCTION
    );
    this._data = {
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

  setStatsFilterChangeHandler(handler) {
    this._statsFilterChangeHandler = handler;
    this.getElement().querySelectorAll(`.statistic__filters-input`).forEach((item) => {
      item.addEventListener(`change`, handler);
    });
  }
}
