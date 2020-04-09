import {util} from "../util.js";

const RATING_NAMES = [
  `Novice`,
  `Fan`,
  `Movie Buff`,
];

export const generateProfile = () => util.getRandomFromArray(RATING_NAMES);
