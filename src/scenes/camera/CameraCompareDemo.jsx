import React, { useEffect, useRef, useState } from 'react';
import { setupCanvas } from '../../engine/webgl/canvasSetup.js';
import { Shapes } from '../../engine/geometry/shapes.js';
import Camera from '../../engine/camera/camera.js';
import Scene from '../../engine/scene.js';
import { m4 } from '../../engine/math/matrix.js';
import object from '../../engine/objects/object.js';
import { VERTEX_SHADER, FRAGMENT_SHADER } from '../../engine/shaders/helpers.js';

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 450;

const CameraCompareDemo = () => {
  const leftCanvasRef = useRef();
  const rightCanvasRef = useRef();
  const [projectionType, setProjectionType] = useState('perspective');

  useEffect(() => {
    if (!leftCanvasRef.current || !rightCanvasRef.current) return;

    // Helper to create a scene with identical objects
    function createScene(gl) {
      const scene = new Scene(gl, VERTEX_SHADER, FRAGMENT_SHADER);
      // Remove the ground plane for a cleaner view
      return scene;
    }

    // --- Left Scene: Fixed Wide Camera ---
    const leftGl = setupCanvas(leftCanvasRef.current, CANVAS_WIDTH, CANVAS_HEIGHT);
    const leftScene = createScene(leftGl);
    // Create moving sphere (main target)
    const sphere = Shapes.sphere(40, 16, 16, [0, 60, -200], [0, 0, 0], [1, 1, 1], [1, 1, 1]);
    leftScene.add(sphere);
    // Remove the cube, add a dynamic line object for the view direction
    // We'll keep a reference to the line object so we can update its verts each frame
    // --- Right Scene: Camera View from Cube ---
    const rightGl = setupCanvas(rightCanvasRef.current, CANVAS_WIDTH, CANVAS_HEIGHT);
    const rightScene = createScene(rightGl);
    // Add sphere to right scene as well
    const sphereR = Shapes.sphere(40, 16, 16, [0, 60, -200], [0, 0, 0], [1, 1, 1], [1, 1, 1]);
    rightScene.add(sphereR);
    // --- Dynamic line objects for both scenes ---
    // We'll create them once and update their verts each frame
    const makeLineObj = (color) => {
      return new object({
        verts: [0,0,0, 0,0,0],
        color,
        isWireFrame: true,
        showNormals: false,
        clockwise: false,
        normals: [0,1,0, 0,1,0]
      }, [0,0,0], [0,0,0], [1,1,1]);
    };
    const viewLine = makeLineObj([1, 1, 0]); // yellow for left scene
    leftScene.add(viewLine);
    const viewLineR = makeLineObj([0, 1, 1]); // cyan for right scene (not visible in camera view, but for completeness)
    rightScene.add(viewLineR);

    // --- Add background planets ---
    // Define planet parameters: [radius, orbitRadius, speed, height, color]
    const planetParams = [
      [18, 320, 0.18, 40, [0.7, 0.7, 1]],    // blue
      [24, 420, 0.11, 120, [1, 0.8, 0.2]],   // yellow
      [14, 500, 0.23, -60, [0.8, 0.3, 0.3]], // red
      [30, 600, 0.09, 200, [0.3, 1, 0.7]],   // teal
      [20, 700, 0.15, -180, [0.9, 0.5, 1]],  // purple
      [12, 350, 0.21, 90, [0.2, 0.9, 0.9]],  // cyan
      [16, 480, 0.13, -120, [1, 0.5, 0.2]],  // orange
      [22, 800, 0.07, 250, [0.5, 0.5, 1]],   // indigo
      [10, 900, 0.19, -220, [0.7, 1, 0.7]],  // light green
      [28, 1000, 0.08, 300, [1, 0.7, 0.7]],  // pink
      [15, 1100, 0.16, -300, [0.6, 0.3, 1]], // violet
      [13, 1200, 0.12, 350, [0.3, 0.8, 0.2]],// green
      [19, 1300, 0.10, -350, [1, 1, 0.5]],   // pale yellow
      [17, 1400, 0.14, 400, [0.5, 1, 1]],    // aqua
      [21, 1500, 0.09, -400, [1, 0.3, 0.6]], // magenta
    ];
    // Create planet spheres for both scenes
    const planets = planetParams.map(([rad, , , , color]) => Shapes.sphere(rad, 16, 16, [0,0,0], [0,0,0], [1,1,1], color));
    planets.forEach(p => leftScene.add(p));
    const planetsR = planetParams.map(([rad, , , , color]) => Shapes.sphere(rad, 16, 16, [0,0,0], [0,0,0], [1,1,1], color));
    planetsR.forEach(p => rightScene.add(p));

    // --- Cameras ---
    // Move both cameras closer for a zoomed-in view
    const mainCamPos = [0, 400, 600]; // was [0, 800, 1000]
    const mainCamTarget = [0, 60, -200];
    const mainCamera = new Camera(mainCamPos, mainCamTarget);
    // Right: camera will be set to just behind the sphere, looking at the sphere
    const previewCamera = new Camera([0, 180, 100], [0, 60, -200]);

    // --- Animation Loop ---
    let running = true;
    function animate() {
      if (!running) return;
      const now = performance.now();
      const t = now * 0.0005;
      const radius = 200;
      // Animate sphere in a circle
      const spherePos = [Math.cos(t) * radius, 60, -200 + Math.sin(t) * radius];
      sphere.setPosition(spherePos);
      sphereR.setPosition(spherePos);
      // Animate background planets
      planetParams.forEach(([rad, orbitR, speed, height, color], i) => {
        const angle = t * speed + i * 1.2;
        const px = Math.cos(angle) * orbitR;
        const py = height;
        const pz = -200 + Math.sin(angle) * orbitR;
        planets[i].setPosition([px, py, pz]);
        planetsR[i].setPosition([px, py, pz]);
      });
      // Compute direction of motion (tangent)
      const tangent = [-Math.sin(t), 0, Math.cos(t)];
      // Offset for camera: behind and above the sphere
      const offset = [tangent[0] * -120, 80, tangent[2] * -120];
      const camPos = [spherePos[0] + offset[0], spherePos[1] + offset[1], spherePos[2] + offset[2]];
      // Optionally, rotate a dummy object to look at sphere (not needed now)
      // Update right camera to be just behind the sphere (at the edge)
      const cubeDepth = 60;
      const epsilon = 2;
      const forward = [
        spherePos[0] - camPos[0],
        spherePos[1] - camPos[1],
        spherePos[2] - camPos[2]
      ];
      const len = Math.hypot(...forward);
      const norm = forward.map(v => v / len);
      const camEdgePos = [
        camPos[0] - norm[0] * (cubeDepth / 2 + epsilon),
        camPos[1] - norm[1] * (cubeDepth / 2 + epsilon),
        camPos[2] - norm[2] * (cubeDepth / 2 + epsilon)
      ];
      previewCamera.setPosition(...camEdgePos);
      previewCamera.setTarget(...spherePos);
      // Update the view direction line in both scenes
      viewLine.meshData.verts = [...camEdgePos, ...spherePos];
      viewLineR.meshData.verts = [...camEdgePos, ...spherePos];
      // Render both scenes
      // Left: main camera
      leftScene.activeCamera = mainCamera;
      let proj = projectionType === 'perspective'
        ? m4.perspectiveProjection(60, CANVAS_WIDTH / CANVAS_HEIGHT, 10, 2000) // reduce far for tighter frustum
        : m4.orthographicProjection(-400 * (CANVAS_WIDTH / CANVAS_HEIGHT), 400 * (CANVAS_WIDTH / CANVAS_HEIGHT), -400, 400, -2000, 2000);
      leftScene.setProjection(projectionType === 'perspective');
      leftScene.projectionMatrix = proj;
      leftScene.render();
      // Right: camera at camEdgePos, looking at sphere
      rightScene.activeCamera = previewCamera;
      const previewProj = m4.perspectiveProjection(60, CANVAS_WIDTH / CANVAS_HEIGHT, 10, 2000);
      rightScene.setProjection(true);
      rightScene.projectionMatrix = previewProj;
      rightScene.render();
      requestAnimationFrame(animate);
    }
    animate();
    return () => { running = false; };
  }, [projectionType]);

  return (
    <article>
      <h2>Camera Comparison Demo</h2>
      <div style={{ display: 'flex', gap: 40 }}>
        <div>
          <h3 style={{ textAlign: 'center' }}>Wide Camera</h3>
          <canvas ref={leftCanvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} style={{ border: '2px solid #333', background: '#222', display: 'block' }} />
        </div>
        <div>
          <h3 style={{ textAlign: 'center' }}>Preview/Follow Camera</h3>
          <canvas ref={rightCanvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} style={{ border: '2px solid #2196F3', background: '#111', display: 'block' }} />
        </div>
      </div>
      <div style={{ marginTop: 24 }}>
        <label>
          <strong>Projection Type: </strong>
          <select value={projectionType} onChange={e => setProjectionType(e.target.value)}>
            <option value="perspective">Perspective</option>
            <option value="orthographic">Orthographic</option>
          </select>
        </label>
      </div>
      <p style={{ marginTop: 24 }}>
        <strong>Demo:</strong> The red cube moves in a circle. The left view is a fixed wide camera. The right view is a preview/follow camera that tracks the red cube from behind and above.
      </p>
    </article>
  );
};

export default CameraCompareDemo;
