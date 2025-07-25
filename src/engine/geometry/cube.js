export function createCubeVertices(width = 1, height = 1, depth = 1) {
  const hw = width / 2;
  const hh = height / 2;
  const hd = depth / 2;

  return [
    // -Z (back)
    -hw, -hh, -hd,
     hw, -hh, -hd,
    -hw,  hh, -hd,
     hw, -hh, -hd,
    -hw,  hh, -hd,
     hw,  hh, -hd,

    // +Z (front)
    -hw, -hh,  hd,
    -hw,  hh,  hd,
     hw, -hh,  hd,
     hw, -hh,  hd,
    -hw,  hh,  hd,
     hw,  hh,  hd,

    // -Y (bottom)
    -hw, -hh, -hd,
    -hw, -hh,  hd,
     hw, -hh, -hd,
     hw, -hh, -hd,
    -hw, -hh,  hd,
     hw, -hh,  hd,

    // +Y (top)
    -hw,  hh, -hd,
     hw,  hh, -hd,
    -hw,  hh,  hd,
     hw,  hh, -hd,
     hw,  hh,  hd,
    -hw,  hh,  hd,

    // -X (left)
    -hw, -hh, -hd,
    -hw,  hh, -hd,
    -hw, -hh,  hd,
    -hw, -hh,  hd,
    -hw,  hh, -hd,
    -hw,  hh,  hd,

    // +X (right)
     hw, -hh, -hd,
     hw, -hh,  hd,
     hw,  hh, -hd,
     hw, -hh,  hd,
     hw,  hh,  hd,
     hw,  hh, -hd,
  ];
}
