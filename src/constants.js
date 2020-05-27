import moment from "moment";

import * as util from "./utils/common.js";

const POSTERS_PATH = `./`;

const KeyCode = {
  ESC: `Escape`,
  ENTER: `Enter`
};

const BODY_HIDE_OVERFLOW_CLASS = `hide-overflow`;

const TitleMessage = {
  NO_MOVIES: `There are no movies in our database`,
  LOADING: `Loading...`,
};

const ErrorMessage = {
  SYNC_FAILED: `Sync data failed`,
  OFFLINE_LOGIC: `offline logic is not implemented`,
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
    checkLoser: (item) => !item.rating,
  },
  COMMENTED: {
    NUM: 2,
    method: (a, b) => util.sortNum([a, b], `comments`, true),
    checkLoser: (item) => !item.comments.length,
  },
};

const COMMENT_EMOJIES = [
  `smile`,
  `sleeping`,
  `puke`,
  `angry`,
];

const EncodeParam = {
  encodeEverything: true,
  strict: true,
};

const ActionProperty = {
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
    method: (item) => (item[ActionProperty.WATCHLIST.PROPERTY]),
  },
  {
    HREF: `#history`,
    NAME: `History`,
    method: (item) => (item[ActionProperty.WATCHED.PROPERTY]),
  },
  {
    HREF: `#favorites`,
    NAME: `Favorites`,
    method: (item) => (item[ActionProperty.FAVORITE.PROPERTY]),
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
  KeyCode,
  BODY_HIDE_OVERFLOW_CLASS,
  TitleMessage,
  ErrorMessage,
  CardsOther,
  COMMENT_EMOJIES,
  EncodeParam,
  ActionProperty,
  FILTERS,
  FILTERS_STATISTICS,
};
