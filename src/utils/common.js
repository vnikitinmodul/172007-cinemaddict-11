import moment from "moment";

const HIDDEN_CLASS = `visually-hidden`;

const MONTH_NAMES = [
  `January`,
  `February`,
  `March`,
  `April`,
  `May`,
  `June`,
  `July`,
  `August`,
  `September`,
  `October`,
  `November`,
  `December`
];

const Time = {
  DAYS_PER_YEAR: 365,
  HOURS_PER_DAY: 24,
  MINUTES_PER_HOUR: 60,
  SECONDS_PER_MINUTE: 60,
  MILLISECONDS_PER_SECOND: 1000,
};

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

const getRandomDate = (yearsAgo = 1) => {
  return new Date(new Date() - new Date(getRandomNum(0, Object.values(Time).reduce((acc, item) => (acc * item), yearsAgo))));
};

const getMonthName = (num) => {
  return MONTH_NAMES[num];
};

const addZeroBefore = (value) => {
  return value < 10 ? `0${value}` : value;
};

const generateArrayData = (min, max, generator) => (
  [...Array(getRandomNum(min, max)).keys()].reduce((accumulator) => {
    accumulator.push(generator());
    return accumulator;
  }, [])
);

const showElement = (element) => {
  element.classList.remove(HIDDEN_CLASS);
};

const hideElement = (element) => {
  element.classList.add(HIDDEN_CLASS);
};

const getDurationMoment = (duration) => {
  const durationMoment = moment.duration(duration, `minutes`);

  return `${durationMoment.hours() ? `${durationMoment.hours()}h ` : ``}${durationMoment.minutes() ? `${durationMoment.minutes()}m ` : ``}`;
};

export {
  getRandomNum,
  getRandomFromArray,
  getSomeFromArray,
  getRandomDate,
  getMonthName,
  addZeroBefore,
  generateArrayData,
  showElement,
  hideElement,
  getDurationMoment,
};
