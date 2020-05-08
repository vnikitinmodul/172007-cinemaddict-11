import * as util from "./common.js";

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

const showTitle = (element, message) => {
  util.showElement(element);
  element.textContent = message;
};

export {
  renderElement,
  createElement,
  showTitle,
};
