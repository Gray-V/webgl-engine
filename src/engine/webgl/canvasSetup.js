export function setupCanvas(canvas, width = 800, height = 800) {
  canvas.width = width
  canvas.height = height
  // Try to get a WebGL2 context first
  let gl = canvas.getContext('webgl2')
  if (!gl) {
    gl = canvas.getContext('webgl')
  }
  if (!gl) throw new Error('WebGL not supported')
  gl.viewport(0, 0, canvas.width, canvas.height)
  return gl
}