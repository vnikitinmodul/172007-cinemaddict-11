import {util} from "../util.js";

const FILTER_NAMES = [
  `All movies`,
  `Watchlist`,
  `History`,
  `Favorites`,
];

const FilterSum = {
  MIN: 1,
  MAX: 20
};

const filters = FILTER_NAMES
  .map((name, i) => {
    return {
      name,
      sum: util.getRandomNum(FilterSum.MIN, FilterSum.MAX),
      isChecked: i === 0,
      isSumOff: i === 0,
    };
  });

export const generateFilters = () => filters;
