export default class Component {
    constructor() {
      this.gameObject = null; // assigned when added to GameObject
    }
  
    start() {}     // called once when added to scene
    update(dt) {}  // per-frame logic
    render(gl, camera) {} // optional, used by renderers
  }
  