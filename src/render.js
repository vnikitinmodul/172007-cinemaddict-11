const renderElement = (container, component, isAfterBegin) => {
  if (isAfterBegin) {
    container.prepend(component.getElement());
  } else {
    container.append(component.getElement());
  }
};

const createElement = (template, isWrapped) => {
  let element = document.createElement(`div`);
  element.innerHTML = template;
  return isWrapped ? element : element.firstChild;
};

export {
  renderElement,
  createElement,
};
