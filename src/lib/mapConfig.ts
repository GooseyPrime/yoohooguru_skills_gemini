/**
 * Universal Map Provider Config
 * Supports Mapbox GL tiles (via VITE_MAPBOX_TOKEN / NEXT_PUBLIC_MAPBOX_TOKEN / MAPBOX_TOKEN)
 * with automatic, rock-solid fallback to CartoDB Voyager/Dark/Positron basemaps.
 */

export function getMapboxToken(): string {
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    const meta = import.meta.env as Record<string, string | undefined>;
    if (meta.VITE_MAPBOX_TOKEN && meta.VITE_MAPBOX_TOKEN.trim().length > 0) return meta.VITE_MAPBOX_TOKEN.trim();
    if (meta.NEXT_PUBLIC_MAPBOX_TOKEN && meta.NEXT_PUBLIC_MAPBOX_TOKEN.trim().length > 0) return meta.NEXT_PUBLIC_MAPBOX_TOKEN.trim();
    if (meta.MAPBOX_TOKEN && meta.MAPBOX_TOKEN.trim().length > 0) return meta.MAPBOX_TOKEN.trim();
  }
  if (typeof process !== 'undefined' && process.env) {
    if (process.env.VITE_MAPBOX_TOKEN && process.env.VITE_MAPBOX_TOKEN.trim().length > 0) return process.env.VITE_MAPBOX_TOKEN.trim();
    if (process.env.NEXT_PUBLIC_MAPBOX_TOKEN && process.env.NEXT_PUBLIC_MAPBOX_TOKEN.trim().length > 0) return process.env.NEXT_PUBLIC_MAPBOX_TOKEN.trim();
    if (process.env.MAPBOX_TOKEN && process.env.MAPBOX_TOKEN.trim().length > 0) return process.env.MAPBOX_TOKEN.trim();
  }
  return '';
}

export interface MapLayerConfig {
  url: string;
  options: {
    attribution: string;
    maxZoom: number;
    subdomains?: string;
    tileSize?: number;
    zoomOffset?: number;
  };
  fallbackUrl: string;
}

export function getTileLayerConfig(theme: 'standard' | 'ultra-dark' | 'high-contrast-light' = 'standard'): MapLayerConfig {
  const token = getMapboxToken();

  if (token && token.startsWith('pk.')) {
    const style =
      theme === 'ultra-dark'
        ? 'mapbox/dark-v11'
        : theme === 'high-contrast-light'
          ? 'mapbox/light-v11'
          : 'mapbox/streets-v12';

    return {
      url: `https://api.mapbox.com/styles/v1/${style}/tiles/256/{z}/{x}/{y}@2x?access_token=${token}`,
      options: {
        attribution:
          '&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
        tileSize: 256,
        zoomOffset: 0,
      },
      fallbackUrl:
        theme === 'ultra-dark'
          ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
          : theme === 'high-contrast-light'
            ? 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
            : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    };
  }

  // CartoDB CDN basemaps: fast, free, open, never blocks web referrers
  const cartoUrl =
    theme === 'ultra-dark'
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : theme === 'high-contrast-light'
        ? 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

  return {
    url: cartoUrl,
    options: {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19,
    },
    fallbackUrl: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
  };
}
