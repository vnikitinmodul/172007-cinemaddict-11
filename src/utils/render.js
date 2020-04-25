const renderElement = (container, component, method = `append`) => {
  if (container.contains(component.getElement())) {
    const oldElement = component.getElement();
    component.removeElement();
    container.replaceChild(component.getElement(), oldElement);
  } else {
    container[method](component.getElement());
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
