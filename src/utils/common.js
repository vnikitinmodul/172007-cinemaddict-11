import moment from "moment";

const RATING_NAMES = [
  `Novice`,
  `Fan`,
  `Movie Buff`,
];

const getRandomNum = (min, max) => (
  Math.floor(Math.random() * (max - min + 1) + min)
);

const getDurationMoment = (duration, isUnitShow) => {
  const durationMoment = moment.duration(duration, `minutes`);

  return [durationMoment.hours() || !isUnitShow ? `${durationMoment.hours()}${isUnitShow ? `h` : ``}` : ``, durationMoment.minutes() || !isUnitShow ? `${durationMoment.minutes()}${isUnitShow ? `m` : ``}` : ``];
};

const getRatingName = (rating) => (RATING_NAMES[Math.ceil(rating / 10) - 1]);

const sortNum = (items, property, isLength) => {
  const [a, b] = isLength ? [items[0][property].length, items[1][property].length] : [items[0][property], items[1][property]];
  return b === a ? getRandomNum(-1, 1) : parseFloat(b) - parseFloat(a);
};

const setInputsChangeHandler = (handler, container, selector) => {
  container.querySelectorAll(selector).forEach((item) => {
    item.addEventListener(`change`, handler);
  });
};

const getFilterMethod = (filtersList, findFunction) => {
  const currentFilter = filtersList.find(findFunction);
  return currentFilter && currentFilter.method;
};

export {
  getRandomNum,
  getDurationMoment,
  getRatingName,
  sortNum,
  setInputsChangeHandler,
  getFilterMethod,
};
