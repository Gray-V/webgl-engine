export function formatMatrix(mat) {
  return (
    <table style={{ fontSize: '0.9em', borderCollapse: 'collapse' }}>
      <tbody>
        {[0, 4, 8, 12].map(row => (
          <tr key={row}>
            {[0, 1, 2, 3].map(col => (
              <td key={col} style={{ border: '1px solid #ccc', padding: '2px 6px' }}>{mat[row + col].toFixed(3)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export function getProjectionMath(type) {
  if (type === 'perspective') {
    return (
      <div style={{ background: '#f5f5f5', padding: 10, borderRadius: 4, fontFamily: 'monospace' }}>
        <div><b>Perspective Projection Formula:</b></div>
        <div style={{ marginTop: 8 }}>
          <span>
            {`
            [ P = Begin{bmatrix} Brac{f}{a} & 0 & 0 & 0 \\ 0 & f & 0 & 0 \\ 0 & 0 & Brac{n+f}{n-f} & -1 \\ 0 & 0 & Brac{2nf}{n-f} & 0 End{bmatrix} ]
            `}
          </span>
        </div>
        <div style={{ marginTop: 8 }}>
          <span>
            {`
            where: [ f = frac{1}{ an( ext{fov}/2)} \ a = ext{aspect ratio} \ n = ext{near plane} \ f = ext{far plane} ]
            `}
          </span>
        </div>
      </div>
    )
  } else {
    return (
      <div style={{ background: '#f5f5f5', padding: 10, borderRadius: 4, fontFamily: 'monospace' }}>
        <div><b>Orthographic Projection Formula:</b></div>
        <div style={{ marginTop: 8 }}>
          <span>
            {`
            [ O = Begin{bmatrix} frac{2}{r-l} & 0 & 0 & 0 \\ 0 & frac{2}{t-b} & 0 & 0 \\ 0 & 0 & frac{-2}{f-n} & 0 \\ -frac{r+l}{r-l} & -frac{t+b}{t-b} & -frac{f+n}{f-n} & 1 End{bmatrix} ]
            `}
          </span>
        </div>
        <div style={{ marginTop: 8 }}>
          <span>
            {`
            where: [ l = ext{left}, r = ext{right}, b = ext{bottom}, t = ext{top}, n = ext{near}, f = ext{far} ]
            `}
          </span>
        </div>
      </div>
    )
  }
} 