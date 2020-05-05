export default class Comments {
  constructor() {
    this._commentsData = [];
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }

  getComments(id) {
    return this._commentsData.find((item) => (item.id === id));
  }

  setCommentsAll(data) {
    this._commentsData = data;
  }

  setComments(data) {
    const index = this._commentsData.findIndex((item) => (item.id === data.id));

    this._commentsData[index] = data;
  }
}
