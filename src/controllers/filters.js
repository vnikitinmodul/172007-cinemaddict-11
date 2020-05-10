import {renderElement} from "../utils/render.js";

import Navigation from "../components/navigation.js";

export default class FiltersController {
  constructor(container, model) {
    this._container = container;
    this._model = model;
    this._component = null;
  }

  _onFilterActivate(evt) {
    const targetHref = evt.target.getAttribute(`href`);

    this._component.setFilterActive(targetHref);
    this._model.activateFilter(targetHref);
  }

  _onDataChange() {
    this._component.rerender();
    this._component.setFilterActive();
  }

  render() {
    this._component = this._component || new Navigation(this._model);
    renderElement(this._container, this._component);
    this._component.setFilterActive();

    this._component.setClickFilterHandler(this._onFilterActivate.bind(this));
    this._model.setDataChangeHandler(this._onDataChange.bind(this));
  }
}
