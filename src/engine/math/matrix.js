// Column row (need to remember)
const m4 = {
  identityMatrix() {
    return [1, 0, 0, 0,
            0, 1, 0, 0, 
            0, 0, 1, 0, 
            0, 0, 0, 1]
  },

  translationMatrix(tx, ty, tz) {
    return [1, 0, 0, 0, 
            0, 1, 0, 0, 
            0, 0, 1, 0, 
            tx, ty, tz, 1]
  },

  xRotationMatrix(rad) {
    const c = Math.cos(rad)
    const s = Math.sin(rad)
    return [1, 0, 0, 0, 
            0, c, -s, 0, 
            0, s, c, 0, 
            0, 0, 0, 1]
  },

  yRotationMatrix(rad) {
    const c = Math.cos(rad)
    const s = Math.sin(rad)
    return [c, 0, s, 0, 
            0, 1, 0, 0, 
            -s, 0, c, 0, 
            0, 0, 0, 1]
  },

  zRotationMatrix(rad) {
    const c = Math.cos(rad)
    const s = Math.sin(rad)
    return [c, s, 0, 0, 
            -s, c, 0, 0, 
            0, 0, 1, 0, 
            0, 0, 0, 1]
  },

  scalingMatrix(sx, sy, sz) {
    return [sx, 0, 0, 0,
            0, sy, 0, 0, 
            0, 0, sz, 0, 
            0, 0, 0, 1]
  },

  // Composite helpers to apply transformations
  translate(m, tx, ty, tz) {
    return m4.multiply(m, m4.translationMatrix(tx, ty, tz))
  },

  xRotate(m, rad) {
    return m4.multiply(m, m4.xRotationMatrix(rad))
  },

  yRotate(m, rad) {
    return m4.multiply(m, m4.yRotationMatrix(rad))
  },

  zRotate(m, rad) {
    return m4.multiply(m, m4.zRotationMatrix(rad))
  },

  scale(m, sx, sy, sz) {
    return m4.multiply(m, m4.scalingMatrix(sx, sy, sz))
  },

  transpose(m) {
    return [m[0], m[4], m[8], m[12], 
            m[1], m[5], m[9], m[13], 
            m[2], m[6], m[10], m[14], 
            m[3], m[7], m[11], m[15]]
  },

  inverse(m) {
    const m00 = m[0],
      m01 = m[1],
      m02 = m[2],
      m03 = m[3]
    const m10 = m[4],
      m11 = m[5],
      m12 = m[6],
      m13 = m[7]
    const m20 = m[8],
      m21 = m[9],
      m22 = m[10],
      m23 = m[11]
    const m30 = m[12],
      m31 = m[13],
      m32 = m[14],
      m33 = m[15]

    const tmp0 = m22 * m33
    const tmp1 = m32 * m23
    const tmp2 = m12 * m33
    const tmp3 = m32 * m13
    const tmp4 = m12 * m23
    const tmp5 = m22 * m13
    const tmp6 = m02 * m33
    const tmp7 = m32 * m03
    const tmp8 = m02 * m23
    const tmp9 = m22 * m03
    const tmp10 = m02 * m13
    const tmp11 = m12 * m03

    const t0 = tmp0 * m11 + tmp3 * m21 + tmp4 * m31 - (tmp1 * m11 + tmp2 * m21 + tmp5 * m31)
    const t1 = tmp1 * m01 + tmp6 * m21 + tmp9 * m31 - (tmp0 * m01 + tmp7 * m21 + tmp8 * m31)
    const t2 = tmp2 * m01 + tmp7 * m11 + tmp10 * m31 - (tmp3 * m01 + tmp6 * m11 + tmp11 * m31)
    const t3 = tmp5 * m01 + tmp8 * m11 + tmp11 * m21 - (tmp4 * m01 + tmp9 * m11 + tmp10 * m21)

    const det = 1.0 / (m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3)

    return [
      det * t0,
      det * t1,
      det * t2,
      det * t3,
      det * (tmp1 * m10 + tmp2 * m20 + tmp5 * m30 - (tmp0 * m10 + tmp3 * m20 + tmp4 * m30)),
      det * (tmp0 * m00 + tmp7 * m20 + tmp8 * m30 - (tmp1 * m00 + tmp6 * m20 + tmp9 * m30)),
      det * (tmp3 * m00 + tmp6 * m10 + tmp11 * m30 - (tmp2 * m00 + tmp7 * m10 + tmp10 * m30)),
      det * (tmp4 * m00 + tmp9 * m10 + tmp10 * m20 - (tmp5 * m00 + tmp8 * m10 + tmp11 * m20)),
      det *
        (m13 * m21 * m30 + m11 * m23 * m30 + m10 * m21 * m33 - (m10 * m23 * m31 + m11 * m20 * m33 + m13 * m20 * m31)),
      det *
        (m00 * m23 * m31 + m01 * m20 * m33 + m03 * m20 * m30 - (m03 * m21 * m30 + m01 * m23 * m30 + m00 * m21 * m33)),
      det *
        (m03 * m11 * m30 + m01 * m13 * m30 + m00 * m11 * m33 - (m00 * m13 * m31 + m01 * m10 * m33 + m03 * m10 * m31)),
      det *
        (m00 * m13 * m21 + m01 * m10 * m23 + m03 * m10 * m20 - (m03 * m11 * m20 + m01 * m13 * m20 + m00 * m11 * m23)),
      det *
        (m12 * m21 * m30 + m11 * m22 * m30 + m10 * m21 * m32 - (m10 * m22 * m31 + m11 * m20 * m32 + m12 * m20 * m31)),
      det *
        (m00 * m22 * m31 + m01 * m20 * m32 + m02 * m20 * m30 - (m02 * m21 * m30 + m01 * m22 * m30 + m00 * m21 * m32)),
      det *
        (m02 * m11 * m30 + m01 * m12 * m30 + m00 * m11 * m32 - (m00 * m12 * m31 + m01 * m10 * m32 + m02 * m10 * m31)),
      det *
        (m00 * m12 * m21 + m01 * m10 * m22 + m02 * m10 * m20 - (m02 * m11 * m20 + m01 * m12 * m20 + m00 * m11 * m22))
    ]
  },

  multiply(a, b) {
    const a00 = a[0],
      a01 = a[1],
      a02 = a[2],
      a03 = a[3]
    const a10 = a[4],
      a11 = a[5],
      a12 = a[6],
      a13 = a[7]
    const a20 = a[8],
      a21 = a[9],
      a22 = a[10],
      a23 = a[11]
    const a30 = a[12],
      a31 = a[13],
      a32 = a[14],
      a33 = a[15]

    const b00 = b[0],
      b01 = b[1],
      b02 = b[2],
      b03 = b[3]
    const b10 = b[4],
      b11 = b[5],
      b12 = b[6],
      b13 = b[7]
    const b20 = b[8],
      b21 = b[9],
      b22 = b[10],
      b23 = b[11]
    const b30 = b[12],
      b31 = b[13],
      b32 = b[14],
      b33 = b[15]

    return [
      b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30,
      b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31,
      b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32,
      b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33,
      b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30,
      b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31,
      b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32,
      b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33,
      b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30,
      b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31,
      b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32,
      b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33,
      b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30,
      b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31,
      b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32,
      b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33
    ]
  },
  

  orthographicProjection(left, right, bottom, top, near, far) {
  return [
    2 / (right - left), 0, 0, 0,
    0, 2 / (top - bottom), 0, 0,
    0, 0, -2 / (far - near), 0,
    -(right + left) / (right - left),
    -(top + bottom) / (top - bottom),
    -(far + near) / (far - near),
    1
  ]
},
  orthographic(left, right, bottom, top, near, far) {
  return [
    2 / (right - left), 0, 0, 0,
    0, 2 / (top - bottom), 0, 0,
    0, 0, -2 / (far - near), 0,
    -(right + left) / (right - left),
    -(top + bottom) / (top - bottom),
    -(far + near) / (far - near),
    1
  ]
},

  perspectiveProjection(fovDegrees, aspect, near, far) {
    fovDegrees *= Math.PI / 180
    const f = Math.tan(Math.PI * 0.5 - 0.5 * fovDegrees)
    const rangeInv = 1.0 / (near - far)

    return [f / aspect, 0, 0, 0, 
            0, -f, 0, 0, 
            0, 0, (near + far) * rangeInv, -1, 
            0, 0, near * far * rangeInv * 2, 0]
  },

  lookAt(eye, target, up) {
    const zAxis = v3.normalize([eye[0] - target[0], eye[1] - target[1], eye[2] - target[2]])
    const xAxis = v3.normalize(v3.cross(up, zAxis))
    const yAxis = v3.cross(zAxis, xAxis)

    return [
      xAxis[0],
      yAxis[0],
      zAxis[0],
      0,
      xAxis[1],
      yAxis[1],
      zAxis[1],
      0,
      xAxis[2],
      yAxis[2],
      zAxis[2],
      0,
      -v3.dot(xAxis, eye),
      -v3.dot(yAxis, eye),
      -v3.dot(zAxis, eye),
      1
    ]
  }
}

const v3 = {
  cross(a, b) {
    return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
  },

  dot(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
  },

  normalize(v) {
    //Adding by small number to prevent dividing by
    const length = Math.hypot(v[0], v[1], v[2]) + 5e-324
    return [v[0] / length, v[1] / length, v[2] / length]
  },

  subtract(a, b) {
    return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
  },
 scale(out, a, s) {
  out[0] = a[0] * s;
  out[1] = a[1] * s;
  out[2] = a[2] * s;
  return out;
}


}

export { m4, v3 }
