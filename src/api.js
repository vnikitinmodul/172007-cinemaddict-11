import FilmsAdapter from "./models/films-adapter.js";
import CommentsAdapter from "./models/comments-adapter.js";

const URL_BASE = `https://11.ecmascript.pages.academy/cinemaddict`;
const QUERY_FILMS = `/movies`;
const QUERY_COMMENTS = `/comments/`;

export default class Api {
  constructor(authorization) {
    this._authorization = authorization;
  }

  getFilms() {
    const headers = new Headers();
    headers.append(`Authorization`, this._authorization);

    return fetch(`${URL_BASE}${QUERY_FILMS}`, {headers})
      .then((response) => response.json())
      .then(FilmsAdapter.parseFilms);
  }

  getComments(id) {
    const headers = new Headers();
    headers.append(`Authorization`, this._authorization);

    return fetch(`${URL_BASE}${QUERY_COMMENTS}${id}`, {headers})
      .then((response) => response.json())
      .then(CommentsAdapter.parseComments);
  }
}
