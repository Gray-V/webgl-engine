import Transform from './Transform.js';

export default class GameObject {
  constructor(name = '') {
    this.name = name;
    this.transform = new Transform();
    this.components = [];
    this.active = true;
  }

  addComponent(component) {
    component.gameObject = this;
    this.components.push(component);
    return component;
  }

  getComponent(typeName) {
    return this.components.find(c => c.constructor.name === typeName);
  }

start(gl) {
  this.components.forEach(c => c.start?.(gl));
}


  render(gl) {
    for (const comp of this.components) {
      comp.render?.(gl);
    }
  }
}
