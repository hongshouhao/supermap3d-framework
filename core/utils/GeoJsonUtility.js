//positions: [lon1,lat1,height1,lon2,lat2,height2....]
export function toSimplePolygon(positions, is3d) {
  let polygon = {
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: [[]],
    },
    properties: {},
  }

  let tuple = is3d ? 3 : 2
  let pt = []
  for (let i = 0; i < positions.length; i++) {
    // if (is3d && (i + 1) % tuple !== 0) {
    //   pt.push(positions[i])
    // }
    pt.push(positions[i])

    if ((i + 1) % tuple === 0) {
      polygon.geometry.coordinates[0].push(pt)
      pt = []
    }
  }

  return polygon
}
