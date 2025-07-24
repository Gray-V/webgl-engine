import Component from '../../core/Component.js';

export default class AreaLight extends Component {
  constructor({ color = [1, 1, 1], size = 5.0, intensity = 1.0, enabled = true } = {}) {
    super();
    this.color = color;
    this.size = size;
    this.intensity = intensity;
    this.enabled = enabled;
  }

  render(gl, camera) {
    if (!this.enabled) return;

    const pos = this.gameObject.transform.position;

    const shader = camera?.activeMaterial?.shader; // optional
    if (!shader) return;

    shader.setUniform('u_areaLightPos', pos);
    shader.setUniform('u_areaLightColor', this.color.map(c => c * this.intensity));
    shader.setUniform('u_areaLightSize', this.size);
  }
}
