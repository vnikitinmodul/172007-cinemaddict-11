const POSTERS_PATH = `./images/posters/`;

const KEY_CODE = {
  ESC: `Escape`,
  ENTER: `Enter`
};

const BODY_HIDE_OVERFLOW_CLASS = `hide-overflow`;

const TITLE_MESSAGE = {
  NO_MOVIES: `There are no movies in our database`
};

const CardsNum = {
  START: 5,
  MORE: 5,
  TOP: 2,
  COMMENTED: 2
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

export {
  POSTERS_PATH,
  KEY_CODE,
  BODY_HIDE_OVERFLOW_CLASS,
  TITLE_MESSAGE,
  CardsNum,
  ACTION_PROPERTIES,
};
