export default class CommentsAdapter {
  constructor(comment) {
    this.commentId = Number(comment.id);
    this.emoji = comment.emotion;
    this.author = comment.author;
    this.date = comment.date;
    this.text = comment.comment;
  }

  static parseComment(comment) {
    return new CommentsAdapter(comment);
  }

  static parseComments(comments) {
    return comments.map(CommentsAdapter.parseComment);
  }
}
