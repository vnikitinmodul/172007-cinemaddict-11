import * as util from "../utils/common.js";

const DatabaseNum = {
  MIN: 10,
  MAX: 10000000,
};

export const generateFooterStatistics = () => util.getRandomNum(DatabaseNum.MIN, DatabaseNum.MAX);
