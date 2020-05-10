import * as util from "./common.js";

const TITLE_ELEMENT_CLASS = `films-list__title`;
const TITLE_ERROR_CLASS = `${TITLE_ELEMENT_CLASS}--error`;

const renderElement = (container, component, method = `append`) => {
  if (!container) {
    return;
  }
  component.container = container;
  if (container.contains(component.getElement())) {
    const oldElement = component.getElement();
    component.removeElement();
    container.replaceChild(component.getElement(), oldElement);
  } else if (component.getElement()) {
    container[method](component.getElement());
  }
};

const createElement = (template, isWrapped) => {
  const element = document.createElement(`div`);
  element.innerHTML = template;
  return isWrapped ? element : element.firstChild;
};

const showTitle = (message, element = document.querySelector(`.${TITLE_ELEMENT_CLASS}`)) => {
  util.showElement(element);
  element.textContent = message;
};

const hideTitle = (element = document.querySelector(`.${TITLE_ELEMENT_CLASS}`)) => {
  element.classList.remove(TITLE_ERROR_CLASS);
  util.hideElement(element);
};

const showError = (message) => {
  document.querySelector(`.${TITLE_ELEMENT_CLASS}`).classList.add(TITLE_ERROR_CLASS);
  showTitle(message);
};

export {
  renderElement,
  createElement,
  showTitle,
  hideTitle,
  showError,
};
