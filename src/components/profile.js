import AbstractComponent from "./abstract.js";

const getProfileMarkup = (rating) => (
  `<section class="header__profile profile">
    <p class="profile__rating">${rating}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`
);

export default class Profile extends AbstractComponent {
  constructor(rating) {
    super();

    this._rating = rating;
  }

  getTemplate() {
    return getProfileMarkup(this._rating);
  }
}
