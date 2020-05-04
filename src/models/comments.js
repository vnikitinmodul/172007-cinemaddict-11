export default class Comments {
  constructor() {
    this._commentsData = null;
  }

  getCommentsAll() {
    return this._commentsData;
  }

  getComments(id) {
    return this._commentsData.find((item) => (item.id === id));
  }

  setComments(data) {
    this._commentsData = data;
  }
}
