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

const FILM_ACTION = {
  ADD_TO_WATCHLIST: `addToWatchlist`,
  MARK_AS_WATCHED: `markAsWatched`,
  FAVORITE: `favorite`,
};

const FILM_INFO_ACTION_HANDLER = {
  ADD_TO_WATCHLIST: `_onChangeAddToWatchlist`,
  MARK_AS_WATCHED: `_onChangeMarkAsWatched`,
  FAVORITE: `_onChangeFavorite`,
};

export {
  POSTERS_PATH,
  KEY_CODE,
  BODY_HIDE_OVERFLOW_CLASS,
  TITLE_MESSAGE,
  CardsNum,
  FILM_ACTION,
  FILM_INFO_ACTION_HANDLER,
};
