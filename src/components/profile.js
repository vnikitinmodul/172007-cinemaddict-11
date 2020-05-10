import AbstractSmartComponent from "./abstract-smart.js";

const RATING_NAMES = [
  `Novice`,
  `Fan`,
  `Movie Buff`,
];

const getRatingName = (rating) => (RATING_NAMES[Math.ceil(rating / 10) - 1]);

const getProfileMarkup = (rating) => (
  `<section class="header__profile profile">
    <p class="profile__rating">${getRatingName(rating)}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`
);

export default class Profile extends AbstractSmartComponent {
  constructor() {
    super();

    this._rating = null;
  }

  updateRating(rating) {
    this._rating = rating;
    if (this._rating) {
      this.rerender();
    } else {
      this.removeElement(true);
    }
  }

  recoveryListeners() {}

  getTemplate() {
    return this._rating ? getProfileMarkup(this._rating) : ``;
  }
}
