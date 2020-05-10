import FilmsAdapter from "./models/films-adapter.js";
import CommentsAdapter from "./models/comments-adapter.js";

const URL_BASE = `https://11.ecmascript.pages.academy/cinemaddict`;
const QUERY_FILMS = `/movies`;
const QUERY_COMMENTS = `/comments`;

const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response.json();
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};

export default class Api {
  constructor(authorization) {
    this._authorization = authorization;
  }

  _load(url, param) {
    param.headers.append(`Authorization`, this._authorization);

    return fetch(url, param)
      .then(checkStatus);
  }

  getFilms() {
    const param = {
      headers: new Headers()
    };

    return this._load(`${URL_BASE}${QUERY_FILMS}`, param)
      .then(FilmsAdapter.parseFilms);
  }

  updateFilm(id, data) {
    const param = {
      method: `PUT`,
      body: JSON.stringify(data.toRAW()),
      headers: new Headers()
    };
    param.headers.append(`Content-Type`, `application/json`);

    return this._load(`${URL_BASE}${QUERY_FILMS}/${id}`, param)
      .then(FilmsAdapter.parseFilm);
  }

  getComments(id) {
    const param = {
      headers: new Headers()
    };

    return this._load(`${URL_BASE}${QUERY_COMMENTS}/${id}`, param)
      .then(CommentsAdapter.parseComments);
  }
}
