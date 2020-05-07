import * as util from "../utils/common.js";
import {
  COMMENT_AUTHORS,
  COMMENT_EMOJIES,
} from "../constants.js";


const COMMENT_TEXTS = [
  `Interesting setting and a good cast`,
  `Booooooooooring`,
  `Very very old. Meh`,
  `Almost two hours? Seriously?`,
];

const CommentsRangeNum = {
  MIN: 0,
  MAX: 5,
};


const generateComment = () => (
  {
    emoji: util.getRandomFromArray(COMMENT_EMOJIES),
    author: util.getRandomFromArray(COMMENT_AUTHORS),
    date: util.getRandomDate(),
    text: util.getRandomFromArray(COMMENT_TEXTS),
  }
);

const generateCommentsList = () => ({
  commentsList: util.generateArrayData(util.getRandomNum(...Object.values(CommentsRangeNum)), generateComment, `commentId`)
});

export const generateComments = (num) => (util.generateArrayData(num, generateCommentsList, `id`));
