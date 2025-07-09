import { describe, it, expect } from 'vitest';
import m4 from './matrix.js';


describe('m4: Matrix Library Test Suite', () => {
  // Identity Matrix
  it('generates a correct identity matrix', () => {
    const id = m4.identityMatrix();
    expect(id).toEqual([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ]);
  });

  it('identity matrix multiplication leaves matrix unchanged', () => {
    const t = m4.translationMatrix(1, 2, 3);
    const result = m4.multiply(t, m4.identityMatrix());
    expect(result).toEqual(t);
  });

  // Multiplication
  it('multiplies two matrices correctly (translation * rotation)', () => {
    const t = m4.translationMatrix(1, 2, 3);
    const r = m4.xRotationMatrix(Math.PI / 2);
    const combined = m4.multiply(t, r);

    expect(combined).toHaveLength(16);
    expect(combined[12]).toBeCloseTo(1);
    expect(combined[13]).toBeCloseTo(2);
    expect(combined[14]).toBeCloseTo(3);
  });

  it('A * B !== B * A for non-commutative transforms', () => {
    const a = m4.translationMatrix(5, 0, 0);
    const b = m4.zRotationMatrix(Math.PI / 2);
    const ab = m4.multiply(a, b);
    const ba = m4.multiply(b, a);
    expect(ab).not.toEqual(ba);
  });

  // Individual and Team Matrix Transforms
  it('creates and combines individual transformations correctly', () => {
    const t = m4.translationMatrix(1, 2, 3);
    const s = m4.scalingMatrix(2, 2, 2);
    const combined = m4.multiply(t, s);
    expect(combined[0]).toBeCloseTo(2);
    expect(combined[5]).toBeCloseTo(2);
    expect(combined[10]).toBeCloseTo(2);
    expect(combined[12]).toBeCloseTo(1);
  });

  it('uses team transform helper correctly', () => {
    const teamMatrix = m4.translate(
      m4.xRotate(
        m4.scale(m4.identityMatrix(), 2, 2, 2),
        Math.PI / 2
      ),
      5, 0, 0
    );
    expect(teamMatrix[12]).toBeCloseTo(10); 
  });
  

  // === WebGL and GLSL Conversion ===
  it('can be passed directly into gl.uniformMatrix4fv format (column-major)', () => {
    const mat = m4.translationMatrix(1, 2, 3);
    const floatArray = new Float32Array(mat);

    expect(floatArray).toBeInstanceOf(Float32Array);
    expect(floatArray.length).toBe(16);
    expect(floatArray[12]).toBeCloseTo(1);
    expect(floatArray[13]).toBeCloseTo(2);
    expect(floatArray[14]).toBeCloseTo(3);
  });
});
