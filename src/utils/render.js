const TITLE_ELEMENT_CLASS = `films-list__title`;
const TITLE_ERROR_CLASS = `${TITLE_ELEMENT_CLASS}--error`;
const HIDDEN_CLASS = `visually-hidden`;

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

const showElement = (element) => {
  element.classList.remove(HIDDEN_CLASS);
};

const hideElement = (element) => {
  element.classList.add(HIDDEN_CLASS);
};

const showTitle = (message, element = document.querySelector(`.${TITLE_ELEMENT_CLASS}`)) => {
  showElement(element);
  element.textContent = message;
};

const hideTitle = (element = document.querySelector(`.${TITLE_ELEMENT_CLASS}`)) => {
  element.classList.remove(TITLE_ERROR_CLASS);
  hideElement(element);
};

const showError = (message) => {
  document.querySelector(`.${TITLE_ELEMENT_CLASS}`).classList.add(TITLE_ERROR_CLASS);
  showTitle(message);
};

export {
  renderElement,
  createElement,
  showElement,
  hideElement,
  showTitle,
  hideTitle,
  showError,
};
