import {util} from "../util.js";

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


const generateComment = () => {
  return {
    emoji: util.getRandomFromArray(COMMENT_EMOJIES),
    author: util.getRandomFromArray(COMMENT_AUTHORS),
    day: util.getRandomDate(),
    text: util.getRandomFromArray(COMMENT_TEXTS),
  };
};

export const generateComments = () => {
  const commentsNum = util.getRandomNum(CommentsRangeNum.MIN, CommentsRangeNum.MAX);
  let comments = [];

  for (let j = 0; j < commentsNum; j++) {
    comments.push(generateComment());
  }

  return comments;
};
