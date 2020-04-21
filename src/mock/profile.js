import * as util from "../utils/common.js";

const RATING_NAMES = [
  `Novice`,
  `Fan`,
  `Movie Buff`,
];

export const generateProfile = () => util.getRandomFromArray(RATING_NAMES);
