import * as util from "../utils/common.js";


const COMMENT_AUTHORS = [
  `John Doe`,
  `Tim Macoveev`,
  `John Smith`,
  `Judy Doe`,
];

const COMMENT_EMOJIES = [
  `angry`,
  `puke`,
  `sleeping`,
  `smile`,
];

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
  commentsList: util.generateArrayData(util.getRandomNum(...Object.values(CommentsRangeNum)), generateComment)
});

export const generateComments = (num) => (util.generateArrayData(num, generateCommentsList, true));
