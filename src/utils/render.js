const renderElement = (container, component, method = `append`) => {
  container[method](component.getElement());
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
