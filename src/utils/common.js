import moment from "moment";

const HIDDEN_CLASS = `visually-hidden`;

const RATING_NAMES = [
  `Novice`,
  `Fan`,
  `Movie Buff`,
];

const getRandomNum = (min, max) => (
  Math.floor(Math.random() * (max - min + 1) + min)
);

const getRandomFromArray = (array, removeSelected) => (
  removeSelected ? array.splice(getRandomNum(0, array.length - 1), 1)[0] : array[getRandomNum(0, array.length - 1)]
);

const getSomeFromArray = (array, min = 1, max = array.length) => {
  let result = [];
  let tempArray = array.slice();

  for (let i = 0; i < getRandomNum(min, max); i++) {
    const itemPos = getRandomNum(min, tempArray.length - 1);
    result.push(tempArray.splice(itemPos, 1));
  }

  return result;
};

const addZeroBefore = (value) => {
  return value < 10 ? `0${value}` : value;
};

const generateArrayData = (num, generator, iterator) => {
  return [...Array(num).keys()].reduce((accumulator, item, i) => {
    accumulator.push(generator());

    if (iterator) {
      accumulator[i][iterator] = i;
    }

    return accumulator;
  }, []);
};

const showElement = (element) => {
  element.classList.remove(HIDDEN_CLASS);
};

const hideElement = (element) => {
  element.classList.add(HIDDEN_CLASS);
};

const getDurationMoment = (duration, isUnitShow) => {
  const durationMoment = moment.duration(duration, `minutes`);

  return [durationMoment.hours() || !isUnitShow ? `${durationMoment.hours()}${isUnitShow ? `h` : ``}` : ``, durationMoment.minutes() || !isUnitShow ? `${durationMoment.minutes()}${isUnitShow ? `m` : ``}` : ``];
};

const getRandomBoolean = (chance = 0.5) => (
  Math.floor(Math.random() - chance)
);

const getRatingName = (rating) => (RATING_NAMES[Math.ceil(rating / 10) - 1]);

const sortNum = (items, property, isLength) => {
  const [a, b] = isLength ? [items[0][property].length, items[1][property].length] : [items[0][property], items[1][property]];
  return parseFloat(b) - parseFloat(a);
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
  getRandomFromArray,
  getSomeFromArray,
  addZeroBefore,
  generateArrayData,
  showElement,
  hideElement,
  getDurationMoment,
  getRandomBoolean,
  getRatingName,
  sortNum,
  setInputsChangeHandler,
  getFilterMethod,
};
