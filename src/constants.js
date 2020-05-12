import moment from "moment";

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
    method: (a, b) => (parseFloat(b.rating) - parseFloat(a.rating)),
  },
  COMMENTED: {
    NUM: 2,
    method: (a, b) => (parseFloat(b.comments.length) - parseFloat(a.comments.length)),
  },
};

const COMMENT_AUTHORS = [
  `John Doe`,
  `Tim Macoveev`,
  `John Smith`,
  `Judy Doe`,
];

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

const FILTERS_STATISTICS = [
  {
    NAME: `All time`,
    method: (item) => (item),
  },
  {
    NAME: `Today`,
    method: (item) => (moment(item.watchingDate).isAfter(moment(0, `HH`))),
  },
  {
    NAME: `Week`,
    method: (item) => (moment(item.watchingDate).isAfter(moment(0, `HH`).startOf(`isoWeek`))),
  },
  {
    NAME: `Month`,
    method: (item) => (moment(item.watchingDate).isAfter(moment(0, `HH`).startOf(`month`))),
  },
  {
    NAME: `Year`,
    method: (item) => (moment(item.watchingDate).isAfter(moment(0, `HH`).startOf(`year`))),
  },
];

export {
  POSTERS_PATH,
  KEY_CODE,
  BODY_HIDE_OVERFLOW_CLASS,
  TITLE_MESSAGE,
  CardsOther,
  COMMENT_AUTHORS,
  COMMENT_EMOJIES,
  ENCODE_PARAM,
  ACTION_PROPERTIES,
  FILTERS,
  FILTERS_STATISTICS,
};
