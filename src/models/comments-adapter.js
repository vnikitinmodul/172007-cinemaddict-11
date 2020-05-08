export default class CommentsAdapter {
  constructor(data) {
    this.commentId = Number(data.id);
    this.emoji = data.emotion;
    this.author = data.author;
    this.date = data.date;
    this.text = data.comment;
  }

  static parseComment(data) {
    return new CommentsAdapter(data);
  }

  static parseComments(data) {
    return data.map(CommentsAdapter.parseComment);
  }
}
