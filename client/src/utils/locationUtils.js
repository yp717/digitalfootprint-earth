function deg2rad(deg) {
  return deg * (Math.PI / 180)
}

export function getDistance(x, y) {
  const a = x.lat - y.lat
  const b = x.lon - y.lon
  const dist = Math.sqrt(a * a + b * b)
  return dist
}

export function getDistanceInKM(x, y) {
  let { lat: lat1, lon: lon1 } = x
  let { lat: lat2, lon: lon2 } = y
  const R = 6371
  const dLat = deg2rad(lat2 - lat1)
  const dLon = deg2rad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const d = R * c
  return d
}
