import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Guru } from '../types/index.ts';
import { getTileLayerConfig } from '../lib/mapConfig.ts';
import { MapPin, Star, Video, Compass, Navigation } from 'lucide-react';

interface MapListingViewProps {
  gurus: Guru[];
  userLocation: { lat: number; lng: number; city: string };
  radiusMiles: number;
  onSelectGuru: (guru: Guru) => void;
  selectedGuruId?: string;
}

export const MapListingView: React.FC<MapListingViewProps> = ({
  gurus,
  userLocation,
  radiusMiles,
  onSelectGuru,
  selectedGuruId,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const radiusCircleRef = useRef<L.Circle | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Initialize map with clean OpenStreetMap tiles
      const map = L.map(mapContainerRef.current, {
        center: [userLocation.lat, userLocation.lng],
        zoom: radiusMiles <= 15 ? 12 : radiusMiles <= 35 ? 11 : 9,
        zoomControl: false,
        attributionControl: false,
      });

      const config = getTileLayerConfig('standard');
      L.tileLayer(config.url, {
        ...config.options,
      })
        .on('tileerror', () => {
          L.tileLayer(config.fallbackUrl, {
            subdomains: 'abcd',
            maxZoom: 19,
          }).addTo(map);
        })
        .addTo(map);

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // User location marker
      const userIcon = L.divIcon({
        className: 'custom-user-marker',
        html: `
          <div style="background-color: #F59E0B; width: 22px; height: 22px; border-radius: 50%; border: 3px solid #0B0F17; box-shadow: 0 0 14px rgba(245,158,11,0.8); display: flex; align-items: center; justify-content: center;">
            <div style="background-color: #FFFFFF; width: 6px; height: 6px; border-radius: 50%;"></div>
          </div>
        `,
        iconSize: [22, 22],
        iconAnchor: [11, 11],
      });

      L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
        .addTo(map)
        .bindTooltip(`<b>Your Location</b><br/>${userLocation.city}`, { direction: 'top' });

      // Layer group for Guru pins
      const markersLayer = L.layerGroup().addTo(map);
      markersLayerRef.current = markersLayer;

      mapInstanceRef.current = map;

      const resizeObserver = new ResizeObserver(() => {
        map.invalidateSize();
      });
      if (mapContainerRef.current) {
        resizeObserver.observe(mapContainerRef.current);
      }

      setTimeout(() => map.invalidateSize(), 80);
      setTimeout(() => map.invalidateSize(), 300);

    return () => {
      // Cleanup handled on unmount
    };
  }, []);

  // Update center, radius circle, and markers when props change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    map.setView([userLocation.lat, userLocation.lng], radiusMiles <= 15 ? 12 : radiusMiles <= 35 ? 11 : 9);

    if (radiusCircleRef.current) {
      radiusCircleRef.current.remove();
    }

    if (radiusMiles < 500) {
      radiusCircleRef.current = L.circle([userLocation.lat, userLocation.lng], {
        radius: radiusMiles * 1609.34,
        color: '#F59E0B',
        fillColor: '#F59E0B',
        fillOpacity: 0.05,
        weight: 1.5,
        dashArray: '6, 6',
      }).addTo(map);
    }

    // Refresh Guru markers
    if (markersLayerRef.current) {
      markersLayerRef.current.clearLayers();

      gurus.forEach((guru) => {
        const isSelected = guru.id === selectedGuruId;
        const iconHtml = `
          <div style="
            background: ${isSelected ? '#F59E0B' : '#0B0F17'};
            color: ${isSelected ? '#0F172A' : '#FFFFFF'};
            padding: 5px 10px;
            border-radius: 20px;
            font-size: 11px;
            font-weight: 800;
            display: flex;
            align-items: center;
            gap: 4px;
            box-shadow: 0 4px 16px rgba(0,0,0,0.6);
            border: 2px solid ${isSelected ? '#FFFFFF' : '#F59E0B'};
            transform: scale(${isSelected ? '1.15' : '1'});
            transition: transform 0.15s ease;
            cursor: pointer;
            white-space: nowrap;
          ">
            <span>$${guru.hourlyRate}/h</span>
            <svg viewBox="0 0 24 24" width="11" height="11" fill="${isSelected ? '#0F172A' : '#FBBF24'}" style="display:inline-block;"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <span>${guru.rating.toFixed(1)}</span>
          </div>
        `;

        const guruIcon = L.divIcon({
          className: 'custom-guru-marker',
          html: iconHtml,
          iconSize: [80, 30],
          iconAnchor: [40, 30],
        });

        const marker = L.marker([guru.location.lat, guru.location.lng], { icon: guruIcon });

        // Popup content in dark styling
        const popupHtml = `
          <div style="font-family: inherit; min-width: 210px; padding: 6px; background: #131927; color: #FFFFFF; border-radius: 12px;">
            <div style="display: flex; gap: 10px; align-items: center; margin-bottom: 8px;">
              <img src="${guru.avatar}" alt="${guru.name}" style="width: 44px; height: 44px; border-radius: 10px; object-fit: cover; border: 2px solid #F59E0B;" />
              <div>
                <div style="font-weight: 800; font-size: 13px; color: #FFFFFF;">${guru.name}</div>
                <div style="font-size: 11px; color: #94A3B8;">${guru.location.city}, ${guru.location.state}</div>
                <div style="font-size: 11px; font-weight: 700; color: #FBBF24;">$${guru.hourlyRate}/hr · ${guru.rating} ★ (${guru.reviewCount})</div>
              </div>
            </div>
            <div style="font-size: 11px; color: #CBD5E1; margin-bottom: 10px; line-height: 1.3;">
              ${guru.skills[0]?.title || 'Expert Guru'}
            </div>
            <button id="book-btn-${guru.id}" style="
              width: 100%;
              background: #F59E0B;
              color: #0F172A;
              border: none;
              border-radius: 8px;
              padding: 7px 10px;
              font-size: 11px;
              font-weight: 800;
              cursor: pointer;
            ">
              View Profile & Book
            </button>
          </div>
        `;

        marker.bindPopup(popupHtml, { offset: [0, -25] });

        marker.on('popupopen', () => {
          const btn = document.getElementById(`book-btn-${guru.id}`);
          if (btn) {
            btn.onclick = () => onSelectGuru(guru);
          }
        });

        marker.on('click', () => {
          onSelectGuru(guru);
        });

        markersLayerRef.current?.addLayer(marker);
      });
    }
  }, [gurus, userLocation, radiusMiles, selectedGuruId, onSelectGuru]);

  return (
    <div className="relative w-full h-[460px] md:h-[540px] rounded-3xl overflow-hidden border border-slate-800 shadow-2xl bg-[#0f1523]">
      {/* Map surface container */}
      <div
        ref={mapContainerRef}
        style={{ height: '540px', minHeight: '440px', width: '100%', position: 'relative' }}
        className="w-full h-full relative z-10"
        tabIndex={0}
        aria-label="Interactive Local Gurus Map"
      />

      {/* Floating Map HUD overlay */}
      <div className="absolute top-4 left-4 z-20 bg-[#0b0f17]/90 backdrop-blur-xl px-4 py-2.5 rounded-2xl border border-slate-800 shadow-xl flex items-center gap-3 text-xs">
        <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse shadow-sm shadow-amber-400/50" />
        <div className="flex flex-col">
          <span className="font-bold text-white flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            {radiusMiles >= 500 ? 'Nationwide / Remote Gurus' : `${radiusMiles} Mile Radius from ${userLocation.city}`}
          </span>
          <span className="text-slate-400 text-[11px]">
            {gurus.length} {gurus.length === 1 ? 'expert' : 'experts'} available for in-person & video
          </span>
        </div>
      </div>

      {/* Legend & Location hint */}
      <div className="absolute bottom-4 left-4 z-20 hidden sm:flex items-center gap-4 bg-[#0b0f17]/90 backdrop-blur-xl px-3.5 py-2 rounded-xl border border-slate-800 shadow-lg text-[11px] text-slate-300">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-amber-400 border border-slate-900 shadow-xs" />
          <span>Your Location</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-2.5 rounded bg-slate-950 border border-amber-400" />
          <span>Local Guru Pin</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Video className="w-3.5 h-3.5 text-emerald-400" />
          <span>Google Meet Supported</span>
        </div>
      </div>
    </div>
  );
};
