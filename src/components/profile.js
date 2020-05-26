import * as util from "../utils/common.js";
import AbstractSmartComponent from "./abstract-smart.js";

const getProfileMarkup = (rating) => (
  `<section class="header__profile profile">
    <p class="profile__rating">${util.getRatingName(rating)}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`
);

export default class Profile extends AbstractSmartComponent {
  constructor() {
    super();

    this._rating = null;
  }

  recoveryListeners() {}

  getTemplate() {
    return this._rating ? getProfileMarkup(this._rating) : ``;
  }

  updateRating(rating) {
    this._rating = rating;
    if (this._rating) {
      this.rerender();
    } else {
      this.removeElement(true);
    }
  }
}
