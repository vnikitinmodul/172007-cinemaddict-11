import moment from "moment";

import * as util from "./utils/common.js";

const POSTERS_PATH = `./`;

const KEY_CODE = {
  ESC: `Escape`,
  ENTER: `Enter`
};

const BODY_HIDE_OVERFLOW_CLASS = `hide-overflow`;

const TITLE_MESSAGE = {
  NO_MOVIES: `There are no movies in our database`,
  LOADING: `Loading...`,
};

const CardsOther = {
  START: {
    NUM: 5,
  },
  MORE: {
    NUM: 5,
  },
  TOP: {
    NUM: 2,
    method: (a, b) => util.sortNum([a, b], `rating`),
  },
  COMMENTED: {
    NUM: 2,
    method: (a, b) => util.sortNum([a, b], `comments`, true),
  },
};

const COMMENT_EMOJIES = [
  `smile`,
  `sleeping`,
  `puke`,
  `angry`,
];

const ENCODE_PARAM = {
  encodeEverything: true,
  strict: true,
};

const ACTION_PROPERTIES = {
  WATCHLIST: {
    MODIFIER: `add-to-watchlist`,
    PROPERTY: `isAddedToWatchlist`,
  },
  WATCHED: {
    MODIFIER: `mark-as-watched`,
    PROPERTY: `isMarkedAsWatched`,
  },
  FAVORITE: {
    MODIFIER: `favorite`,
    PROPERTY: `isFavorite`,
  },
};

const FILTERS = [
  {
    HREF: `#all`,
    NAME: `All movies`,
    method: (item) => (item),
  },
  {
    HREF: `#watchlist`,
    NAME: `Watchlist`,
    method: (item) => (item[ACTION_PROPERTIES.WATCHLIST.PROPERTY]),
  },
  {
    HREF: `#history`,
    NAME: `History`,
    method: (item) => (item[ACTION_PROPERTIES.WATCHED.PROPERTY]),
  },
  {
    HREF: `#favorites`,
    NAME: `Favorites`,
    method: (item) => (item[ACTION_PROPERTIES.FAVORITE.PROPERTY]),
  },
];

const statsWatchingDateFilter = (item, startOfValue) => (
  startOfValue ? moment(item.watchingDate).isAfter(moment(0, `HH`).startOf(startOfValue)) : moment(item.watchingDate).isAfter(moment(0, `HH`))
);

const FILTERS_STATISTICS = [
  {
    NAME: `All time`,
    method: (item) => (item),
  },
  {
    NAME: `Today`,
    method: (item) => statsWatchingDateFilter(item),
  },
  {
    NAME: `Week`,
    method: (item) => statsWatchingDateFilter(item, `isoWeek`),
  },
  {
    NAME: `Month`,
    method: (item) => statsWatchingDateFilter(item, `month`),
  },
  {
    NAME: `Year`,
    method: (item) => statsWatchingDateFilter(item, `year`),
  },
];

export {
  POSTERS_PATH,
  KEY_CODE,
  BODY_HIDE_OVERFLOW_CLASS,
  TITLE_MESSAGE,
  CardsOther,
  COMMENT_EMOJIES,
  ENCODE_PARAM,
  ACTION_PROPERTIES,
  FILTERS,
  FILTERS_STATISTICS,
};
