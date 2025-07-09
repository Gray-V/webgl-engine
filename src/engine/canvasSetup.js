export function setupCanvas(canvas, width = 800, height = 800) {
  canvas.width = width
  canvas.height = height
  const gl = canvas.getContext('webgl')
  if (!gl) throw new Error('WebGL not supported')
  gl.viewport(0, 0, canvas.width, canvas.height)
  return gl
}