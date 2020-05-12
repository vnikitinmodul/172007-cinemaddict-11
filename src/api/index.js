import FilmsAdapter from "../models/films-adapter.js";
import CommentsAdapter from "../models/comments-adapter.js";

const ValidStatusCode = {
  MIN: 200,
  MAX: 300,
};

const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`,
};

export default class Api {
  constructor(authorization) {
    this._authorization = authorization;
    this._urlBase = `https://11.ecmascript.pages.academy/cinemaddict`;
    this._queryFilms = `/movies`;
    this._queryComments = `/comments`;
  }

  _checkStatus(response) {
    if (response.status >= ValidStatusCode.MIN && response.status < ValidStatusCode.MAX) {
      return response.json();
    } else {
      throw new Error(`${response.status}: ${response.statusText}`);
    }
  }

  _load(url, param) {
    param.headers.append(`Authorization`, this._authorization);

    return fetch(url, param)
      .then(this._checkStatus);
  }

  getFilms() {
    const param = {
      headers: new Headers()
    };

    return this._load(`${this._urlBase}${this._queryFilms}`, param)
      .then(FilmsAdapter.parseFilms);
  }

  updateFilm(id, data) {
    const param = {
      method: Method.PUT,
      body: JSON.stringify(data.toRAW()),
      headers: new Headers({'Content-Type': `application/json`})
    };

    return this._load(`${this._urlBase}${this._queryFilms}/${id}`, param)
      .then(FilmsAdapter.parseFilm);
  }

  getComments(id) {
    const param = {
      headers: new Headers()
    };

    return this._load(`${this._urlBase}${this._queryComments}/${id}`, param)
      .then(CommentsAdapter.parseComments);
  }
}
