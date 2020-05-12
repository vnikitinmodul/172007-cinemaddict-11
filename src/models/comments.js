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

  setCommentsAll(comments) {
    this._commentsData = comments;
  }

  setComments(comment) {
    const index = this._commentsData.findIndex((item) => (item.id === comment.id));

    this._commentsData[index] = comment;
  }
}
