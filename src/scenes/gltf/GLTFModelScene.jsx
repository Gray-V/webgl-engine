import { useEffect, useRef, useState } from 'react';
import { setupCanvas } from '../../engine/canvasSetup.js';
import { loadGLTF } from '../../engine/gltfLoader.js';
import Camera from '../../engine/camera.js';
import { m4 } from '../../engine/matrix.js';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

// Helper to list available scene glTF files
const AVAILABLE_MODELS = [
  'resources/scene.gltf',
  'resources/house.gltf'

];

// Minimal vertex and fragment shaders for triangles, with projection/view and optional texturing
const VERTEX_SHADER_SRC = `
  attribute vec3 position;
  attribute vec2 uv;
  uniform mat4 uProjection;
  uniform mat4 uView;
  varying vec2 vUv;
  void main() {
    gl_Position = uProjection * uView * vec4(position, 1.0);
    vUv = uv;
  }
`;
const FRAGMENT_SHADER_SRC = `
  precision mediump float;
  varying vec2 vUv;
  uniform sampler2D uTexture;
  uniform bool uHasTexture;
  void main() {
    if (uHasTexture) {
      gl_FragColor = texture2D(uTexture, vUv);
    } else {
      gl_FragColor = vec4(1, 1, 1, 1);
    }
  }
`;
function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(shader));
  }
  return shader;
}
function createProgram(gl, vsSource, fsSource) {
  const vs = createShader(gl, gl.VERTEX_SHADER, vsSource);
  const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
  const program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(program));
  }
  return program;
}

const SLIDER_RANGES = {
  position: { min: -10, max: 10, step: 0.01 },
  rotation: { min: -Math.PI, max: Math.PI, step: 0.01 },
  scale: { min: 0.1, max: 3, step: 0.01 }
};

const TRANSFORM_LABELS = {
  position: 'Position',
  rotation: 'Rotation (rad)',
  scale: 'Scale'
};
const AXIS_LABELS = ['X', 'Y', 'Z'];

const UNIT_MARKERS = {
  position: '(units)',
  rotation: '(rad)',
  scale: '(x)'
};

const DIRECTION_HINTS = {
  position: [
    'Left (−) / Right (+)',
    'Down (−) / Up (+)',
    'Back (−) / Forward (+)'
  ],
  rotation: [
    'Pitch Down (−) / Pitch Up (+)',
    'Yaw Left (−, CCW) / Yaw Right (+, CW)',
    'Roll Left (−, CCW) / Roll Right (+, CW)'
  ],
  scale: [
    'Shrink (−) / Grow (+)',
    'Shrink (−) / Grow (+)',
    'Shrink (−) / Grow (+)'
  ]
};

const GLTFModelScene = () => {
  const canvasRef = useRef();
  // Remove gizmoCanvasRef and all gizmo code
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedModel, setSelectedModel] = useState(AVAILABLE_MODELS[0]);
  const [currentModel, setCurrentModel] = useState(AVAILABLE_MODELS[0]);
  const [spin, setSpin] = useState(false);

  // Central transform state
  const [transform, setTransform] = useState({
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1]
  });

  // Local input state for text entry (to allow '-', etc)
  const [inputValues, setInputValues] = useState({
    position: ['0', '0', '0'],
    rotation: ['0', '0', '0'],
    scale: ['1', '1', '1']
  });

  // Dropdown for which transform to edit
  const [selectedTransform, setSelectedTransform] = useState('position');

  // Keep inputValues in sync with transform when switching transform type or when transform changes externally
  useEffect(() => {
    setInputValues(prev => ({
      ...prev,
      [selectedTransform]: transform[selectedTransform].map(v => String(v))
    }));
  }, [selectedTransform, transform]);

  useEffect(() => {
    let animationId;
    let gl, mesh, texture, camera, program;
    let primitives;
    let cachedBuffers = [];
    let cachedLocations = {};
    let angle = 0;

    async function init() {
      setLoading(true);
      setError(null);
      try {
        gl = setupCanvas(canvasRef.current, CANVAS_WIDTH, CANVAS_HEIGHT);
        program = createProgram(gl, VERTEX_SHADER_SRC, FRAGMENT_SHADER_SRC);
        const result = await loadGLTF(currentModel, gl);
        primitives = result.primitives;
        texture = result.texture;
        camera = new Camera([0, 0, 8], [0, 0, 0]);
        cachedLocations = {
          uProjLoc: gl.getUniformLocation(program, 'uProjection'),
          uViewLoc: gl.getUniformLocation(program, 'uView'),
          uTexLoc: gl.getUniformLocation(program, 'uTexture'),
          uHasTexLoc: gl.getUniformLocation(program, 'uHasTexture'),
          posLoc: gl.getAttribLocation(program, 'position'),
          uvLoc: gl.getAttribLocation(program, 'uv'),
        };
        cachedBuffers = primitives.map(prim => {
          const posBuffer = gl.createBuffer();
          gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
          gl.bufferData(gl.ARRAY_BUFFER, prim.positions, gl.STATIC_DRAW);
          let uvBuffer = null;
          if (prim.uvs && cachedLocations.uvLoc !== -1) {
            uvBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, prim.uvs, gl.STATIC_DRAW);
          }
          let idxBuffer = null;
          let idxType = null;
          if (prim.indices) {
            idxBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, idxBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, prim.indices, gl.STATIC_DRAW);
            idxType = (prim.indices instanceof Uint32Array) ? gl.UNSIGNED_INT : gl.UNSIGNED_SHORT;
          }
          return { posBuffer, uvBuffer, idxBuffer, idxType, prim };
        });
        setLoading(false);
        if (spin) renderLoop();
        else renderOnce();
        // --- Draw gizmo overlay after render ---
        // Removed gizmo drawing logic
      } catch (e) {
        setError(e.message);
        setLoading(false);
      }
    }

    function renderScene(angle = 0) {
      gl.clearColor(0.1, 0.1, 0.15, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.enable(gl.DEPTH_TEST);
      gl.useProgram(program);
      const aspect = CANVAS_WIDTH / CANVAS_HEIGHT;
      const proj = m4.perspectiveProjection(45, aspect, 0.1, 100);
      // Compose model matrix from transform
      let model = m4.identityMatrix();
      model = m4.translate(model, ...transform.position);
      model = m4.xRotate(model, transform.rotation[0]);
      model = m4.yRotate(model, transform.rotation[1]);
      model = m4.zRotate(model, transform.rotation[2]);
      model = m4.scale(model, ...transform.scale);
      // Camera view
      let view = camera.getViewMatrix();
      // Lower the model in the frame
      const transDown = m4.translationMatrix(0, -1.5, 0);
      view = m4.multiply(view, transDown);
      if (spin && angle !== 0) {
        const spinY = m4.yRotationMatrix(angle);
        view = m4.multiply(view, spinY);
      }
      // Pass matrices
      gl.uniformMatrix4fv(cachedLocations.uProjLoc, false, proj);
      gl.uniformMatrix4fv(cachedLocations.uViewLoc, false, m4.multiply(view, model));
      for (const { posBuffer, uvBuffer, idxBuffer, idxType, prim } of cachedBuffers) {
        gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
        gl.enableVertexAttribArray(cachedLocations.posLoc);
        gl.vertexAttribPointer(cachedLocations.posLoc, 3, gl.FLOAT, false, 0, 0);
        if (prim.uvs && uvBuffer && cachedLocations.uvLoc !== -1) {
          gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
          gl.enableVertexAttribArray(cachedLocations.uvLoc);
          gl.vertexAttribPointer(cachedLocations.uvLoc, 2, gl.FLOAT, false, 0, 0);
        } else {
          if (cachedLocations.uvLoc !== -1) gl.disableVertexAttribArray(cachedLocations.uvLoc);
        }
        // Bind the correct texture for this primitive
        if (prim.texture) {
          gl.activeTexture(gl.TEXTURE0);
          gl.bindTexture(gl.TEXTURE_2D, prim.texture);
          gl.uniform1i(cachedLocations.uTexLoc, 0);
          gl.uniform1i(cachedLocations.uHasTexLoc, true);
        } else {
          gl.bindTexture(gl.TEXTURE_2D, null);
          gl.uniform1i(cachedLocations.uHasTexLoc, false);
        }
        if (prim.indices && idxBuffer) {
          gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, idxBuffer);
          gl.drawElements(gl.TRIANGLES, prim.indices.length, idxType, 0);
        } else {
          gl.drawArrays(gl.TRIANGLES, 0, prim.positions.length / 3);
        }
      }
    }

    function renderLoop() {
      angle += 0.01;
      renderScene(angle);
      animationId = requestAnimationFrame(renderLoop);
    }
    function renderOnce() {
      renderScene(0);
    }

    init();
    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
      }, [currentModel, spin, transform, selectedTransform]);

  function handleModelChange(e) {
    setCurrentModel(e.target.value);
  }

  function handleInputChange(type, axis, value) {
    setInputValues(prev => {
      const next = { ...prev };
      next[type] = [...prev[type]];
      next[type][axis] = value;
      return next;
    });
    // Only update transform if value is a valid number
    if (value === '' || value === '-' || value === '-.' || value === '.' || value === '+') return;
    const num = parseFloat(value);
    if (!isNaN(num)) {
      setTransform(prev => {
        const next = { ...prev };
        next[type] = [...prev[type]];
        next[type][axis] = num;
        return next;
      });
    }
  }

  function handleInputBlur(type, axis, value) {
    // On blur, if value is not a valid number, reset to last valid value
    const num = parseFloat(value);
    if (isNaN(num)) {
      setInputValues(prev => {
        const next = { ...prev };
        next[type] = [...prev[type]];
        next[type][axis] = String(transform[type][axis]);
        return next;
      });
    }
  }

  return (
    <article>
      <h2>glTF Model Scene</h2>
      <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 24 }}>
        <label>
          <span style={{ marginRight: 8 }}>Select Model:</span>
          <select value={currentModel} onChange={handleModelChange}>
            {AVAILABLE_MODELS.map((model, idx) => (
              <option value={model} key={model}>{model.replace('resources/', '')}</option>
            ))}
          </select>
        </label>
        <label style={{ marginLeft: 16 }}>
          <input type="checkbox" checked={spin} onChange={e => setSpin(e.target.checked)} />
          <span style={{ marginLeft: 4 }}>Spin Model</span>
        </label>
        <button onClick={() => setTransform({ position: [0,0,0], rotation: [0,0,0], scale: [1,1,1] })} style={{ marginLeft: 16 }}>
          Reset Transform
        </button>
        <label style={{ marginLeft: 32 }}>
          <span style={{ marginRight: 8 }}>Transform:</span>
          <select value={selectedTransform} onChange={e => setSelectedTransform(e.target.value)}>
            <option value="position">Position</option>
            <option value="rotation">Rotation</option>
            <option value="scale">Scale</option>
          </select>
        </label>
      </div>
      {loading && <p>Loading model...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', width: CANVAS_WIDTH + 220 }}>
        <div style={{ position: 'relative', width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}>
          <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} style={{ border: '2px solid #333', background: '#222', display: 'block' }} />
        </div>
        <div style={{
          width: 200,
          marginLeft: 20,
          background: '#f5f5f5',
          borderRadius: 8,
          padding: 24,
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          gap: 32
        }}>
          <h3 style={{ margin: 0, marginBottom: 16, fontSize: 18, textAlign: 'center' }}>{TRANSFORM_LABELS[selectedTransform]}</h3>
          {['x', 'y', 'z'].map((axis, i) => (
            <div key={axis} style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: 8 }}>
                {AXIS_LABELS[i]}:
                <input
                  type="text"
                  min={SLIDER_RANGES[selectedTransform].min}
                  max={SLIDER_RANGES[selectedTransform].max}
                  step={SLIDER_RANGES[selectedTransform].step}
                  value={inputValues[selectedTransform][i]}
                  onChange={e => handleInputChange(selectedTransform, i, e.target.value)}
                  onBlur={e => handleInputBlur(selectedTransform, i, e.target.value)}
                  style={{ width: 90, marginLeft: 8, fontSize: 18, padding: '4px 8px' }}
                  inputMode="decimal"
                  autoComplete="off"
                />
                <span style={{ marginLeft: 8, color: '#888', fontSize: 14 }}>{UNIT_MARKERS[selectedTransform]}</span>
                <span style={{ marginLeft: 8, color: '#aaa', fontSize: 12, fontStyle: 'italic' }}>{DIRECTION_HINTS[selectedTransform][i]}</span>
              </label>
            </div>
          ))}
        </div>
      </div>
      <p>Currently displaying: <code>{currentModel}</code></p>
    </article>
  );
};

export default GLTFModelScene; 