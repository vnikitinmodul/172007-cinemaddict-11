export default class Comments {
  constructor() {
    this._commentsData = [];
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }

  getData(id) {
    return this._commentsData.find((item) => (item.id === id));
  }

  setData(comment) {
    const index = this._commentsData.findIndex((item) => (item.id === comment.id));

    this._commentsData[index] = comment;
  }
}
