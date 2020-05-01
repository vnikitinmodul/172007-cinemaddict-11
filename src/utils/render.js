const renderElement = (container, component, method = `append`) => {
  component.container = container;
  if (container.contains(component.getElement())) {
    const oldElement = component.getElement();
    component.removeElement();
    container.replaceChild(component.getElement(), oldElement);
  } else {
    container[method](component.getElement());
  }
};

const createElement = (template, isWrapped) => {
  const element = document.createElement(`div`);
  element.innerHTML = template;
  return isWrapped ? element : element.firstChild;
};

export {
  renderElement,
  createElement,
};
