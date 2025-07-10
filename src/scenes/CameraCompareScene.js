import { setupCanvas } from '../engine/canvasSetup.js';
import { Shapes } from '../engine/shapes.js';
import Camera from '../engine/camera.js';
import Scene from '../engine/scene.js';
import object from '../engine/object.js';
import { m4 } from '../engine/matrix.js';
import { VERTEX_SHADER, FRAGMENT_SHADER } from '../engine/helpers.js';

export function CameraCompareScene({
  mainCanvas,
  previewCanvas,
  projectionType,
  setViewMatrix,
  setProjMatrix,
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  PREVIEW_WIDTH,
  PREVIEW_HEIGHT
}) {
  const gl = setupCanvas(mainCanvas, CANVAS_WIDTH, CANVAS_HEIGHT);
  const previewGl = setupCanvas(previewCanvas, PREVIEW_WIDTH, PREVIEW_HEIGHT);
  const scene = new Scene(gl, VERTEX_SHADER, FRAGMENT_SHADER);

  // Add static cubes and ground (all aligned at z = -200)
  scene.add(Shapes.cube(100, [-150, 60, -200], [0, 0, 0], [1, 1, 1], [1, 0, 0])); // red
  scene.add(Shapes.cube(100, [0, 60, -200], [0, 0, 0], [1, 1, 1], [0, 1, 0]));   // green
  scene.add(Shapes.cube(100, [150, 60, -200], [0, 0, 0], [1, 1, 1], [0, 0, 1])); // blue
  scene.add(Shapes.sphere(40, 16, 16, [0, 60, -200], [0, 0, 0], [1, 1, 1], [1, 1, 1])); // white sphere
  scene.add(Shapes.ground(1200, [0, -300, -200], [0.3, 0.6, 0.3])); // green ground

  // --- Preview Camera Setup ---
  const previewPos = [0, 180, 100];
  const previewTarget = [0, 60, -200];
  const previewCamera = new Camera(previewPos, previewTarget);

  // Add yellow preview pyramid (camera visual)
  const angleY = Math.atan2(previewTarget[0] - previewPos[0], previewTarget[2] - previewPos[2]);
  const previewObj = Shapes.pyramid(40, 60, previewPos, [0, angleY, 0], [1, 1, 1], [1, 1, 0]);
  previewObj.meshData.isWireFrame = true;
  scene.add(previewObj);

  // Add green direction box in front of preview camera
  const forward = [
    previewTarget[0] - previewPos[0],
    previewTarget[1] - previewPos[1],
    previewTarget[2] - previewPos[2]
  ];
  const len = Math.hypot(...forward);
  const norm = forward.map(v => v / len);
  const boxPos = [
    previewPos[0] + norm[0] * 30,
    previewPos[1] + norm[1] * 30,
    previewPos[2] + norm[2] * 30
  ];
  const dirBox = Shapes.box(10, 10, 80, boxPos, [0, angleY, 0], [1, 1, 1], [0, 1, 0]);
  scene.add(dirBox);

  // --- Main Camera Setup ---
  const mainCamPos = [0, 800, 1000];
  const mainCamTarget = [0, 60, -200];
  const camera = new Camera(mainCamPos, mainCamTarget);

  // Add main camera visual (white wireframe pyramid)
  const mainAngleY = Math.atan2(mainCamTarget[0] - mainCamPos[0], mainCamTarget[2] - mainCamPos[2]);
  const mainCamObj = Shapes.pyramid(60, 90, mainCamPos, [0, mainAngleY, 0], [1, 1, 1], [1, 1, 1]);
  mainCamObj.meshData.isWireFrame = true;
  scene.add(mainCamObj);

  // Debug lines for both cameras
  function addLine(start, end, color) {
    const mesh = {
      verts: [...start, ...end],
      color,
      isWireFrame: true,
      showNormals: false,
      clockwise: false,
      normals: [0, 1, 0, 0, 1, 0]
    };
    const line = new object(mesh, [0, 0, 0], [0, 0, 0], [1, 1, 1]);
    scene.add(line);
  }
  addLine(mainCamPos, mainCamTarget, [0, 1, 0]); // green line for main cam
  addLine(previewPos, previewTarget, [0, 0.5, 1]); // blue line for preview cam

  // --- Render Main View ---
  scene.activeCamera = camera;
  setViewMatrix(camera.getViewMatrix());

  const aspect = CANVAS_WIDTH / CANVAS_HEIGHT;
  let proj = projectionType === 'perspective'
    ? m4.perspectiveProjection(60, aspect, 10, 4000)
    : m4.orthographicProjection(-800 * aspect, 800 * aspect, -800, 800, -4000, 4000);

  scene.setProjection(projectionType === 'perspective');
  scene.projectionMatrix = proj;
  setProjMatrix(proj);
  scene.render();

  // --- Render Preview View ---
  previewGl.viewport(0, 0, PREVIEW_WIDTH, PREVIEW_HEIGHT);
  const previewProj = m4.perspectiveProjection(60, PREVIEW_WIDTH / PREVIEW_HEIGHT, 10, 4000);
  scene.setProjection(true);
  scene.projectionMatrix = previewProj;
  scene.activeCamera = previewCamera;
  scene.render();

  return () => {}; // No animation
}
