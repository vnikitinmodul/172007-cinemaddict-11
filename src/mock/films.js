import {util} from "../util.js";
import {generateComments} from "./comments.js";


const FILM_TITLES = [
  `Созданы друг для друга`,
  `Моряк Попай встречает Синдбада Моряка`,
  `След полыни`,
  `Дед Мороз покоряет марсиан`,
  `Танец Жизни`,
  `Великий Фламарион`,
  `Человек с золотой рукой`,
];

const FILM_TITLES_ORIGINAL = [
  `Made for Each Other`,
  `Popeye the Sailor Meets Sindbad the Sailor`,
  `Sagebrush Trail`,
  `Santa Claus Conquers the Martians`,
  `The Dance of Life`,
  `The Great Flamarion`,
  `The Man with the Golden Arm`,
];

const FILM_GENRES = [
  `Action`,
  `Western`,
  `Detective`,
  `Drama`,
  `Comedy`,
  `Documentary`,
  `Horror`,
  `Mystery`,
  `Romance`,
  `Sci-Fi`,
];

const FILM_POSTERS = [
  `made-for-each-other.png`,
  `popeye-meets-sinbad.png`,
  `sagebrush-trail.jpg`,
  `santa-claus-conquers-the-martians.jpg`,
  `the-dance-of-life.jpg`,
  `the-great-flamarion.jpg`,
  `the-man-with-the-golden-arm.jpg`,
];

const COUNTRIES = [
  `USA`,
  `Russia`,
  `India`,
  `Germany`,
  `Poland`,
  `China`,
];

const FILM_DESCRIPTION_STRINGS = [
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
  `Cras aliquet varius magna, non porta ligula feugiat eget.`,
  `Fusce tristique felis at fermentum pharetra.`,
  `Aliquam id orci ut lectus varius viverra.`,
  `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
  `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
  `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
  `Sed sed nisi sed augue convallis suscipit in sed felis.`,
  `Aliquam erat volutpat.`,
  `Nunc fermentum tortor ac porta dapibus.`,
  `In rutrum ac purus sit amet tempus.`,
];

const AGE_VALUES = [
  `0+`,
  `6+`,
  `12+`,
  `16+`,
  `18+`,
];

const DIRECTORS = [
  `Steven Spielberg`,
  `Martin Scorsese`,
  `Ridley Scott`,
  `John Woo`,
  `Christopher Nolan`,
  `Tim Burton`,
  `Hayao Miyazaki`,
  `Peter Jackson`,
  `Quentin Tarantino`,
  `James Cameron`,
];

const WRITERS = [
  `Quentin Tarantino`,
  `Christopher Nolan`,
  `Joel Coen`,
  `Michael Mann`,
  `Frank Darabont`,
  `Sergio Leone`,
  `Wes Anderson`,
  `Martin Scorsese`,
  `Damien Chazelle`,
  `Drew Goddard`,
];

const ACTORS = [
  `John Ratzenberger`,
  `James Stewart`,
  `Robert De Niro`,
  `Harrison Ford`,
  `Cary Grant`,
  `Morgan Freeman`,
  `Steve Buscemi`,
  `Michael Caine`,
  `Alec Guinness`,
  `Brad Pitt`,
  `Bruce Willis`,
  `Charles Chaplin`,
  `Claude Rains`,
  `Clint Eastwood`,
];

const FILM_RATING_PRECISION = 10;

const FilmRating = {
  MIN: 5,
  MAX: 10
};

const FILM_YEAR_AGO = 100;

const FilmDurationHour = {
  MIN: 0,
  MAX: 2,
};

const FilmDurationMinute = {
  MIN: 0,
  MAX: 60,
};

const FilmDescriptionLength = {
  MIN: 1,
  MAX: 5,
};

const FilmsRangeNum = {
  MIN: 15,
  MAX: 20,
};

const filmsNum = util.getRandomNum(FilmsRangeNum.MIN, FilmsRangeNum.MAX);


const getDuration = (hours, minutes) => {
  return `${hours ? `${hours}h` : ``} ${minutes ? `${util.addZeroBefore(minutes)}m` : ``}`;
};


const generateCard = () => {
  const result = {
    title: util.getRandomFromArray(FILM_TITLES),
    titleOriginal: util.getRandomFromArray(FILM_TITLES_ORIGINAL),
    age: util.getRandomFromArray(AGE_VALUES),
    country: util.getRandomFromArray(COUNTRIES),
    director: util.getRandomFromArray(DIRECTORS),
    writers: util.getSomeFromArray(WRITERS),
    actors: util.getSomeFromArray(ACTORS),
    poster: util.getRandomFromArray(FILM_POSTERS),
    rating: (util.getRandomNum(FilmRating.MIN * FILM_RATING_PRECISION, FilmRating.MAX * FILM_RATING_PRECISION) / FILM_RATING_PRECISION).toFixed(1),
    date: util.getRandomDate(FILM_YEAR_AGO),
    duration: getDuration(util.getRandomNum(FilmDurationHour.MIN, FilmDurationHour.MAX), util.getRandomNum(FilmDurationMinute.MIN, FilmDurationMinute.MAX)),
    genres: util.getSomeFromArray(FILM_GENRES),
    description: util.getSomeFromArray(FILM_DESCRIPTION_STRINGS, FilmDescriptionLength.MIN, FilmDescriptionLength.MAX).join(` `),
    comments: generateComments(),
  };

  return result;
};

let films = [];

for (let j = 0; j < filmsNum; j++) {
  films.push(generateCard());
}

export const generateFilms = () => films;
