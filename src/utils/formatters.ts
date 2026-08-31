/**
 * Formats decimal latitude and longitude into navigational polar coordinate string
 * e.g., -70.767, 11.733 -> 70°46'S, 11°44'E
 */
export function formatCoordinates(lat: number, lng: number): string {
  const latDir = lat >= 0 ? 'N' : 'S';
  const absLat = Math.abs(lat);
  const latDeg = Math.floor(absLat);
  const latMin = Math.floor((absLat - latDeg) * 60);

  const lngDir = lng >= 0 ? 'E' : 'W';
  const absLng = Math.abs(lng);
  const lngDeg = Math.floor(absLng);
  const lngMin = Math.floor((absLng - lngDeg) * 60);

  return `${latDeg}°${latMin.toString().padStart(2, '0')}'${latDir}, ${lngDeg}°${lngMin.toString().padStart(2, '0')}'${lngDir}`;
}

export function formatCompactCoords(lat: number, lng: number): string {
  const latDir = lat >= 0 ? 'N' : 'S';
  const lngDir = lng >= 0 ? 'E' : 'W';
  return `${Math.abs(lat).toFixed(2)}°${latDir}, ${Math.abs(lng).toFixed(2)}°${lngDir}`;
}

export function formatDistance(distanceKm: number): string {
  return `${distanceKm.toLocaleString('en-US', { maximumFractionDigits: 0 })} km (${(distanceKm * 0.539957).toFixed(0)} NM)`;
}

export function formatNumber(num: number, maxDecimals = 1): string {
  return num.toLocaleString('en-US', { maximumFractionDigits: maxDecimals });
}

export function getRiskColor(level: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL'): { text: string; bg: string; border: string; glow: string } {
  switch (level) {
    case 'LOW':
      return { text: 'text-emerald-400', bg: 'bg-emerald-500/15', border: 'border-emerald-500/30', glow: 'shadow-[0_0_12px_rgba(16,185,129,0.3)]' };
    case 'MODERATE':
      return { text: 'text-amber-400', bg: 'bg-amber-500/15', border: 'border-amber-500/30', glow: 'shadow-[0_0_12px_rgba(245,158,11,0.3)]' };
    case 'HIGH':
      return { text: 'text-orange-400', bg: 'bg-orange-500/15', border: 'border-orange-500/30', glow: 'shadow-[0_0_12px_rgba(249,115,22,0.35)]' };
    case 'CRITICAL':
      return { text: 'text-rose-400', bg: 'bg-rose-500/20', border: 'border-rose-500/40', glow: 'shadow-[0_0_15px_rgba(244,63,94,0.45)]' };
  }
}
