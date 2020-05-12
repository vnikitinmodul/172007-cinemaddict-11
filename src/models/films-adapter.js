export default class FilmsAdapter {
  constructor(film) {
    this.id = Number(film.id);
    this.title = film.film_info.title;
    this.titleOriginal = film.film_info.alternative_title;
    this.age = film.film_info.age_rating;
    this.country = film.film_info.release.release_country;
    this.director = film.film_info.director;
    this.writers = film.film_info.writers;
    this.actors = film.film_info.actors;
    this.poster = film.film_info.poster;
    this.rating = film.film_info.total_rating;
    this.date = film.film_info.release.date;
    this.duration = film.film_info.runtime;
    this.genres = film.film_info.genre;
    this.description = film.film_info.description;
    this.isAddedToWatchlist = film.user_details.watchlist;
    this.isMarkedAsWatched = film.user_details.already_watched;
    this.isFavorite = film.user_details.favorite;
    this.watchingDate = new Date(film.user_details.watching_date);
    this.comments = film.comments;
  }

  toRAW() {
    return {
      "film_info": {
        "title": this.title,
        "alternative_title": this.titleOriginal,
        "age_rating": this.age,
        "release": {
          "release_country": this.country,
          "date": this.date,
        },
        "director": this.director,
        "writers": this.writers,
        "actors": this.actors,
        "total_rating": this.rating,
        "poster": this.poster,
        "runtime": this.duration,
        "genre": this.genres,
        "description": this.description,
      },
      "user_details": {
        "watchlist": this.isAddedToWatchlist,
        "already_watched": this.isMarkedAsWatched,
        "favorite": this.isFavorite,
        "watching_date": this.watchingDate,
      },
      "comments": this.comments,
      "id": this.id.toString(),
    };
  }

  static parseFilm(film) {
    return new FilmsAdapter(film);
  }

  static parseFilms(films) {
    return films.map(FilmsAdapter.parseFilm);
  }
}
