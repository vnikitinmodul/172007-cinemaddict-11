import {renderElement} from "../utils/render.js";
import AbstractComponent from "./abstract.js";

export default class AbstractSmartComponent extends AbstractComponent {
  recoveryListeners() {
    throw new Error(`Abstract method not implemented: recoveryListeners`);
  }

  rerender() {
    renderElement(this.container, this);
    this.recoveryListeners();
  }
}
