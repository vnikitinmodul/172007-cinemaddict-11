export default class Comments {
  constructor() {
    this._commentsData = [];
  }

  getData(id) {
    return this._commentsData.find((item) => (item.id === id));
  }

  setData(comment) {
    const index = this._commentsData.findIndex((item) => (item.id === comment.id));

    this._commentsData[index] = comment;
  }
}
