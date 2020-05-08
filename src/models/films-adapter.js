export default class FilmsAdapter {
  constructor(data) {
    this.id = Number(data.id);
    this.title = data.film_info.title;
    this.titleOriginal = data.film_info.alternative_title;
    this.age = `+${data.film_info.age_rating}`;
    this.country = data.film_info.release.release_country;
    this.director = data.film_info.director;
    this.writers = data.film_info.writers;
    this.actors = data.film_info.actors;
    this.poster = data.film_info.poster;
    this.rating = data.film_info.total_rating;
    this.date = data.film_info.release.date;
    this.duration = data.film_info.runtime;
    this.genres = data.film_info.genre;
    this.description = data.film_info.description;
    this.isAddedToWatchlist = data.user_details.watchlist;
    this.isMarkedAsWatched = data.user_details.already_watched;
    this.isFavorite = data.user_details.favorite;
    this.comments = data.comments;
  }

  static parseFilm(data) {
    return new FilmsAdapter(data);
  }

  static parseFilms(data) {
    return data.map(FilmsAdapter.parseFilm);
  }
}
