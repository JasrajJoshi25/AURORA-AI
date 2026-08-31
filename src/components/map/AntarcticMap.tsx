import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useApp } from '../../context/AppContext';
import { SEA_ICE_FORECAST_SNAPSHOTS } from '../../data/seaIceGrid';
import { generateOptimizedRoutes } from '../../utils/routeOptimizer';
import { formatCoordinates } from '../../utils/formatters';
import { generateIcebergGeoPolygon, interpolateIcebergPosition } from '../../utils/geoGeometry';
import { ParticleCanvasOverlay } from './ParticleCanvasOverlay';
import { LayerControl } from './LayerControl';
import { TelemetryBar } from './TelemetryBar';
import { TimeLapsePlayer } from './TimeLapsePlayer';
import { CustomRouteDrawer } from './CustomRouteDrawer';
import { ShieldAlert, RefreshCw, Compass, Crosshair, FileText, Layers, Globe, Anchor } from 'lucide-react';

export type MapProvider = 'POLAR_DARK' | 'ESRI_SATELLITE' | 'ESRI_OCEAN' | 'OSM' | 'CARTO_DARK';

interface TileConfig {
  name: string;
  url: string;
  subdomains?: string;
  maxZoom: number;
  attribution: string;
  icon: string;
}

const MAP_TILES: Record<MapProvider, TileConfig> = {
  POLAR_DARK: {
    name: 'Polar Dark GIS',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
    maxZoom: 18,
    attribution: '&copy; Esri &copy; HERE &copy; Garmin',
    icon: '🌑'
  },
  ESRI_SATELLITE: {
    name: 'ESRI Satellite',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    maxZoom: 18,
    attribution: '&copy; Esri &copy; Maxar &copy; Earthstar Geographics',
    icon: '🛰️'
  },
  ESRI_OCEAN: {
    name: 'Ocean Bathymetry',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}',
    maxZoom: 16,
    attribution: '&copy; Esri &copy; GEBCO &copy; NOAA',
    icon: '🌊'
  },
  OSM: {
    name: 'OpenStreetMap',
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors',
    icon: '🗺️'
  },
  CARTO_DARK: {
    name: 'Carto Dark Matter',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    subdomains: 'abcd',
    maxZoom: 19,
    attribution: '&copy; CartoDB &copy; OpenStreetMap',
    icon: '⚡'
  }
};

export const AntarcticMap: React.FC<{ onNavigateToNavPage?: () => void }> = ({ onNavigateToNavPage }) => {
  const {
    vessels,
    activeVessel,
    setActiveVesselId,
    icebergs,
    selectedIceberg,
    setSelectedIcebergId,
    stations,
    layerVisibility,
    forecastHorizon,
    activeRouteId,
    setActiveRouteId,
    isRerouteModalOpen,
    setIsRerouteModalOpen,
    acceptReroute,
    simulationHours,
    isCustomRouteMode,
    addCustomWaypoint,
    customRouteOption,
    setIsVoyageReportOpen
  } = useApp();

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const baseTileLayerRef = useRef<L.TileLayer | null>(null);
  const seamarkLayerRef = useRef<L.TileLayer | null>(null);
  const layersGroupRef = useRef<L.LayerGroup | null>(null);

  const [mapProvider, setMapProvider] = useState<MapProvider>('POLAR_DARK');
  const [showSeamarks, setShowSeamarks] = useState<boolean>(true);
  const [isTileSelectorOpen, setIsTileSelectorOpen] = useState<boolean>(false);
  const [cursorCoords, setCursorCoords] = useState<{ lat: number; lng: number } | null>({ lat: -60.42, lng: -42.85 });
  const [showDriftPlayer, setShowDriftPlayer] = useState<boolean>(false);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [-64.5, -25.0],
      zoom: 3,
      minZoom: 2,
      maxZoom: 18,
      zoomControl: true,
      attributionControl: false
    });

    // Initial Base Tile Layer
    const tileCfg = MAP_TILES['POLAR_DARK'];
    const baseLayer = L.tileLayer(tileCfg.url, {
      subdomains: tileCfg.subdomains || 'abc',
      maxZoom: tileCfg.maxZoom,
      attribution: tileCfg.attribution
    }).addTo(map);
    baseTileLayerRef.current = baseLayer;

    // OpenSeaMap Seamarks Nautical Overlay
    const seamarks = L.tileLayer('https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png', {
      maxZoom: 18,
      opacity: 0.8
    });
    if (showSeamarks) {
      seamarks.addTo(map);
    }
    seamarkLayerRef.current = seamarks;

    const layerGroup = L.layerGroup().addTo(map);
    layersGroupRef.current = layerGroup;
    mapInstanceRef.current = map;

    // Invalidate map size after initialization to render all tiles edge-to-edge
    setTimeout(() => {
      map.invalidateSize();
    }, 200);

    // Track mouse coordinates
    map.on('mousemove', (e: L.LeafletMouseEvent) => {
      setCursorCoords({ lat: +e.latlng.lat.toFixed(4), lng: +e.latlng.lng.toFixed(4) });
    });

    // Click handler for custom route mode
    map.on('click', (e: L.LeafletMouseEvent) => {
      if (isCustomRouteMode) {
        addCustomWaypoint({ lat: +e.latlng.lat.toFixed(4), lng: +e.latlng.lng.toFixed(4) });
      }
    });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [isCustomRouteMode, addCustomWaypoint]);

  // Handle Base Map Tile Provider Changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (baseTileLayerRef.current) {
      map.removeLayer(baseTileLayerRef.current);
    }

    const tileCfg = MAP_TILES[mapProvider];
    const newBaseLayer = L.tileLayer(tileCfg.url, {
      subdomains: tileCfg.subdomains || 'abc',
      maxZoom: tileCfg.maxZoom,
      attribution: tileCfg.attribution
    }).addTo(map);
    baseTileLayerRef.current = newBaseLayer;

    // Ensure layerGroup remains on top
    if (layersGroupRef.current && map.hasLayer(layersGroupRef.current)) {
      layersGroupRef.current.eachLayer(layer => {
        if ('bringToFront' in layer && typeof (layer as any).bringToFront === 'function') {
          (layer as any).bringToFront();
        }
      });
    }
  }, [mapProvider]);

  // Handle OpenSeaMap overlay toggle
  useEffect(() => {
    const map = mapInstanceRef.current;
    const seamarks = seamarkLayerRef.current;
    if (!map || !seamarks) return;

    if (showSeamarks) {
      if (!map.hasLayer(seamarks)) seamarks.addTo(map);
    } else {
      if (map.hasLayer(seamarks)) map.removeLayer(seamarks);
    }
  }, [showSeamarks]);

  // Ensure map is resized when window changes
  useEffect(() => {
    const handleResize = () => {
      mapInstanceRef.current?.invalidateSize();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Center helpers
  const centerOnVessel = () => {
    if (mapInstanceRef.current && activeVessel) {
      mapInstanceRef.current.flyTo([activeVessel.lat, activeVessel.lng], 6, { duration: 1.2 });
    }
  };

  const centerOnA23A = () => {
    if (mapInstanceRef.current) {
      const a23a = icebergs.find(i => i.id === 'A23A');
      if (a23a) {
        mapInstanceRef.current.flyTo([a23a.lat, a23a.lng], 6, { duration: 1.2 });
        setSelectedIcebergId('A23A');
      }
    }
  };

  const centerAntarcticOverview = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([-68.0, 0.0], 3, { duration: 1.2 });
    }
  };

  // Main Map Render Loop: Update Layers, Polygons, Routes, Radar, and Vessels
  useEffect(() => {
    const map = mapInstanceRef.current;
    const group = layersGroupRef.current;
    if (!map || !group) return;

    group.clearLayers();

    // 1. SEA-ICE CONCENTRATION GRID (SQUARE RASTER CELLS)
    if (layerVisibility.seaIce) {
      const snapshot = SEA_ICE_FORECAST_SNAPSHOTS[forecastHorizon] || SEA_ICE_FORECAST_SNAPSHOTS.NOW;
      
      const halfLat = 0.85;
      const halfLng = 2.4;

      snapshot.gridData.forEach(cell => {
        let fillColor = '#0891b2';
        let borderColor = '#0e7490';
        let fillOpacity = 0.25;

        if (cell.concentrationPercent > 80) {
          fillColor = '#e0f2fe';
          borderColor = '#bae6fd';
          fillOpacity = 0.70;
        } else if (cell.concentrationPercent > 60) {
          fillColor = '#38bdf8';
          borderColor = '#0284c7';
          fillOpacity = 0.50;
        } else if (cell.concentrationPercent > 35) {
          fillColor = '#06b6d4';
          borderColor = '#0891b2';
          fillOpacity = 0.35;
        }

        const bounds: L.LatLngBoundsExpression = [
          [cell.lat - halfLat, cell.lng - halfLng],
          [cell.lat + halfLat, cell.lng + halfLng]
        ];

        const square = L.rectangle(bounds, {
          color: borderColor,
          weight: 1,
          fillColor,
          fillOpacity
        });

        square.bindTooltip(
          `<div class="p-1 text-[11px] font-mono">
            <div class="font-bold text-cyan-300">Sea-Ice Grid Pixel (${cell.concentrationPercent}%)</div>
            <div>Thickness: ${cell.thicknessMeters}m</div>
            <div>Stage: ${cell.stage.replace(/_/g, ' ')}</div>
            <div>Risk Index: ${cell.riskScore}/100</div>
          </div>`,
          { className: 'leaflet-popup-content-wrapper', sticky: true }
        );

        group.addLayer(square);
      });
    }

    // 2. RESEARCH STATIONS
    if (layerVisibility.stations) {
      stations.forEach(stn => {
        const isIndia = stn.countryCode === 'IN';
        const stnIcon = L.divIcon({
          className: 'custom-station-icon',
          html: `<div class="flex items-center justify-center w-7 h-7 rounded-full ${
            isIndia ? 'bg-amber-500/30 border-2 border-amber-400 text-amber-300' : 'bg-emerald-500/20 border border-emerald-400 text-emerald-300'
          } shadow-[0_0_12px_rgba(245,158,11,0.5)]">
            <span class="text-[11px] font-bold">${isIndia ? '🇮🇳' : '📍'}</span>
          </div>`,
          iconSize: [28, 28],
          iconAnchor: [14, 14]
        });

        const marker = L.marker([stn.lat, stn.lng], { icon: stnIcon });
        marker.bindPopup(
          `<div class="p-2.5 space-y-1.5 text-xs font-mono">
            <div class="font-bold text-sm text-cyan-300">${stn.name}</div>
            <div class="text-slate-300 text-[11px]">${stn.country} • ${stn.iceShelfOrCoast}</div>
            <div class="text-[10px] text-slate-400">${formatCoordinates(stn.lat, stn.lng)}</div>
            <p class="text-[11px] text-slate-300 font-sans mt-1">${stn.description}</p>
          </div>`
        );
        group.addLayer(marker);
      });
    }

    // 3. EXACT-SHAPE REALISTIC ICEBERG POLYGONS & TRAJECTORIES
    if (layerVisibility.icebergs) {
      icebergs.forEach(berg => {
        const isCritical = berg.riskLevel === 'CRITICAL';
        const isSelected = selectedIceberg?.id === berg.id;

        // Compute simulated drift position based on timeline hours
        const simPos = interpolateIcebergPosition(berg, simulationHours);
        const dynamicBerg: typeof berg = { ...berg, lat: simPos.lat, lng: simPos.lng };

        // Generate True Geographic Polygon scaled to real kilometers and rotated by heading
        const geoPolygonCoords = generateIcebergGeoPolygon(dynamicBerg);

        if (layerVisibility.icebergPolygons && geoPolygonCoords.length > 2) {
          const polygon = L.polygon(geoPolygonCoords, {
            color: isCritical ? '#f43f5e' : isSelected ? '#00f0ff' : '#38bdf8',
            weight: isSelected ? 3 : isCritical ? 2.5 : 1.5,
            fillColor: isCritical ? '#fb7185' : '#7dd3fc',
            fillOpacity: isCritical ? 0.45 : 0.35,
            dashArray: isCritical ? '6, 3' : undefined,
            className: isCritical ? 'animate-pulse' : ''
          });

          polygon.on('click', () => {
            setSelectedIcebergId(berg.id);
          });

          polygon.bindTooltip(
            `<div class="p-1.5 font-mono text-xs">
              <div class="font-bold text-cyan-300">${berg.name}</div>
              <div class="text-[10px] text-slate-300">Dimensions: ${berg.lengthKm} km × ${berg.widthKm} km (${berg.sizeKm2} km²)</div>
              <div class="text-[10px] text-slate-300">Draft: ${berg.draftDepthMeters}m • Mass: ${berg.estimatedMassGt} Gt</div>
              <div class="text-[10px] text-rose-400 font-bold">Collision Hazard: ${berg.collisionProbabilityPercent}%</div>
            </div>`,
            { sticky: true }
          );

          group.addLayer(polygon);
        }

        // Center Iceberg Marker with Badge & Heading Vector
        const bergIcon = L.divIcon({
          className: 'custom-iceberg-pin',
          html: `<div class="relative flex items-center justify-center px-2 py-0.5 rounded-lg ${
            isCritical
              ? 'bg-rose-950/90 border-2 border-rose-500 text-rose-200 shadow-[0_0_15px_rgba(244,63,94,0.7)]'
              : 'bg-[#091a38]/90 border border-cyan-400 text-cyan-200 shadow-[0_0_12px_rgba(0,240,255,0.4)]'
          } font-mono text-[10px] font-bold cursor-pointer whitespace-nowrap">
            <span class="mr-1">🧊</span>
            <span>${berg.id} (${berg.lengthKm}×${berg.widthKm}km)</span>
            ${isCritical ? '<div class="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></div>' : ''}
          </div>`,
          iconSize: [90, 24],
          iconAnchor: [45, 12]
        });

        const marker = L.marker([dynamicBerg.lat, dynamicBerg.lng], { icon: bergIcon });
        marker.on('click', () => setSelectedIcebergId(berg.id));

        marker.bindPopup(
          `<div class="p-2.5 space-y-2 text-xs font-mono">
            <div class="flex items-center justify-between border-b border-slate-700 pb-1.5">
              <span class="font-bold text-sm text-rose-400">${berg.name}</span>
              <span class="px-1.5 py-0.2 rounded text-[10px] bg-rose-500/20 text-rose-300 font-bold">${berg.riskLevel}</span>
            </div>
            <div class="text-[11px] text-slate-300">Origin: ${berg.sourceIceShelf} (${berg.calvingYear})</div>
            <div class="text-[10px] text-slate-400">Position: ${formatCoordinates(dynamicBerg.lat, dynamicBerg.lng)}</div>
            <div class="grid grid-cols-2 gap-1.5 text-[11px] pt-1 border-t border-slate-700">
              <div>Drift: <span class="text-cyan-300 font-bold">${berg.velocityKnots} kts (${berg.headingCompass})</span></div>
              <div>Mass: <span class="text-slate-200 font-bold">${berg.estimatedMassGt} Gt</span></div>
              <div>Area: <span class="text-slate-200 font-bold">${berg.sizeKm2} km²</span></div>
              <div>Draft: <span class="text-cyan-300 font-bold">${berg.draftDepthMeters}m</span></div>
              <div>SAR Echo: <span class="text-teal-300">${berg.sarReflectivityDb} dB</span></div>
              <div>Collision: <span class="text-rose-400 font-bold">${berg.collisionProbabilityPercent}%</span></div>
            </div>
            <div class="pt-1.5 text-center">
              <span class="text-cyan-400 text-[10px] underline cursor-pointer">Click to inspect 3D Keel Cross-Section</span>
            </div>
          </div>`
        );
        group.addLayer(marker);

        // 3.1 DYNAMIC TARGET LOCK & HAZARD BUFFER CIRCLE AROUND EACH ICEBERG
        const bergRadiusMeters = Math.max(berg.lengthKm, berg.widthKm) * 500 + 8000;
        
        // Hazard Buffer Ring
        const hazardRing = L.circle([dynamicBerg.lat, dynamicBerg.lng], {
          radius: bergRadiusMeters,
          color: isCritical ? '#f43f5e' : isSelected ? '#00f0ff' : '#0ea5e9',
          weight: isSelected ? 2.5 : isCritical ? 2.0 : 1.2,
          fillColor: isCritical ? '#f43f5e' : '#00f0ff',
          fillOpacity: isCritical ? 0.12 : 0.06,
          dashArray: isCritical ? '4, 4' : '6, 6'
        });
        hazardRing.bindTooltip(
          `<div class="p-1 font-mono text-xs text-rose-300">
            <span class="font-bold">${berg.name} Safety Buffer:</span> ${(bergRadiusMeters / 1852).toFixed(1)} NM
          </div>`,
          { sticky: true }
        );
        group.addLayer(hazardRing);

        // Pulsating Target Acquisition Reticle for A23A / Selected Icebergs
        if (isCritical || isSelected) {
          const targetLockIcon = L.divIcon({
            className: 'custom-radar-lock',
            html: `<div class="relative flex items-center justify-center w-24 h-24 pointer-events-none">
              <div class="absolute inset-0 rounded-full border-2 ${isCritical ? 'border-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.8)]' : 'border-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.8)]'} animate-ping opacity-60"></div>
              <div class="absolute inset-2 rounded-full border ${isCritical ? 'border-rose-400' : 'border-cyan-300'} animate-spin-slow opacity-80" style="border-style: dashed;"></div>
              <div class="absolute w-full h-[1px] ${isCritical ? 'bg-rose-500/60' : 'bg-cyan-400/60'}"></div>
              <div class="absolute h-full w-[1px] ${isCritical ? 'bg-rose-500/60' : 'bg-cyan-400/60'}"></div>
              <div class="absolute -top-3 left-1/2 -translate-x-1/2 px-1.5 py-0.2 rounded bg-slate-950/90 border ${isCritical ? 'border-rose-500 text-rose-300' : 'border-cyan-400 text-cyan-300'} font-mono text-[9px] font-bold">
                ${isCritical ? 'RADAR LOCK' : 'TARGET'}
              </div>
            </div>`,
            iconSize: [96, 96],
            iconAnchor: [48, 48]
          });

          const lockMarker = L.marker([dynamicBerg.lat, dynamicBerg.lng], { icon: targetLockIcon, zIndexOffset: 500 });
          group.addLayer(lockMarker);
        }

        // Radar Intercept Vector Line from Active Vessel to Iceberg
        if (activeVessel && layerVisibility.radarSweep) {
          const distKm = Math.sqrt(
            Math.pow((dynamicBerg.lat - activeVessel.lat) * 111, 2) +
            Math.pow((dynamicBerg.lng - activeVessel.lng) * 111 * Math.cos((activeVessel.lat * Math.PI) / 180), 2)
          );
          const distNM = distKm / 1.852;

          // If within radar horizon (under 90 NM)
          if (distNM < 90) {
            const interceptLine = L.polyline(
              [[activeVessel.lat, activeVessel.lng], [dynamicBerg.lat, dynamicBerg.lng]],
              {
                color: isCritical ? '#f43f5e' : '#00f0ff',
                weight: isCritical ? 2.0 : 1.2,
                dashArray: '3, 6',
                opacity: isCritical ? 0.9 : 0.6
              }
            );
            interceptLine.bindTooltip(
              `<div class="p-1 font-mono text-[10px] ${isCritical ? 'text-rose-300' : 'text-cyan-300'}">
                Radar Contact: ${distNM.toFixed(1)} NM to ${berg.name}
              </div>`,
              { sticky: true }
            );
            group.addLayer(interceptLine);
          }
        }

        // Historical Track (Dashed Gray)
        if (berg.historicalTrack.length > 1) {
          const histLine = L.polyline(
            berg.historicalTrack.map(p => [p.lat, p.lng]),
            { color: '#94a3b8', weight: 1.5, dashArray: '4, 4', opacity: 0.5 }
          );
          group.addLayer(histLine);
        }

        // Predicted Trajectory (Glowing Neon Track)
        if (berg.predictedTrajectory.length > 1) {
          const predLine = L.polyline(
            berg.predictedTrajectory.map(p => [p.lat, p.lng]),
            {
              color: isCritical ? '#fb7185' : '#38bdf8',
              weight: isCritical ? 2.8 : 2.0,
              dashArray: '6, 6',
              opacity: 0.9
            }
          );
          group.addLayer(predLine);

          // 72h Uncertainty Corridor Polygon
          if (layerVisibility.uncertaintyCones && isCritical) {
            const leftSide: [number, number][] = [];
            const rightSide: [number, number][] = [];

            berg.predictedTrajectory.forEach(pt => {
              const rDeg = pt.uncertaintyRadiusNM / 60;
              leftSide.push([pt.lat + rDeg * 0.7, pt.lng - rDeg * 1.5]);
              rightSide.push([pt.lat - rDeg * 0.7, pt.lng + rDeg * 1.5]);
            });

            const coneCoords = [...leftSide, ...rightSide.reverse()];
            const uncertaintyPolygon = L.polygon(coneCoords, {
              color: '#f43f5e',
              weight: 1.2,
              fillColor: '#f43f5e',
              fillOpacity: 0.15,
              dashArray: '4, 4'
            });
            uncertaintyPolygon.bindTooltip('A23A 72h Trajectory Kalman Uncertainty Cone', { sticky: true });
            group.addLayer(uncertaintyPolygon);
          }
        }
      });
    }

    // 4. AIS VESSELS, RADAR CONE & TRAIL
    if (layerVisibility.vessels) {
      vessels.forEach(vessel => {
        const isActive = activeVessel?.id === vessel.id;
        const heading = vessel.headingDeg;

        // Custom High-Visibility Vessel Hull Icon
        const vesselIcon = L.divIcon({
          className: 'custom-vessel-icon',
          html: `<div class="relative flex items-center justify-center w-9 h-9 rounded-full ${
            isActive
              ? 'bg-cyan-500/30 border-2 border-cyan-400 shadow-[0_0_25px_rgba(0,240,255,0.8)]'
              : 'bg-slate-900/90 border border-slate-600'
          } cursor-pointer">
            <svg class="w-5 h-5 text-cyan-300 transform" style="transform: rotate(${heading}deg);" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="12,2 20,22 12,18 4,22" />
            </svg>
            ${isActive ? '<div class="absolute -inset-1.5 rounded-full border-2 border-cyan-400 animate-ping opacity-50"></div>' : ''}
          </div>`,
          iconSize: [36, 36],
          iconAnchor: [18, 18]
        });

        const marker = L.marker([vessel.lat, vessel.lng], { icon: vesselIcon });
        marker.on('click', () => setActiveVesselId(vessel.id));

        marker.bindPopup(
          `<div class="p-2.5 space-y-1.5 text-xs font-mono">
            <div class="flex items-center justify-between border-b border-slate-700 pb-1">
              <span class="font-bold text-sm text-cyan-300">${vessel.name}</span>
              <span class="text-[10px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-200">${vessel.polarClass}</span>
            </div>
            <div class="text-[11px] text-slate-300">Flag: ${vessel.flag} (${vessel.callSign})</div>
            <div class="text-[10px] text-slate-400">Position: ${formatCoordinates(vessel.lat, vessel.lng)}</div>
            <div class="grid grid-cols-2 gap-1 text-[11px] pt-1 border-t border-slate-700">
              <div>Speed: <span class="text-cyan-300 font-bold">${vessel.speedKnots} kts</span></div>
              <div>Heading: <span class="text-slate-200 font-bold">${vessel.headingDeg}°</span></div>
              <div>Fuel: <span class="text-emerald-400 font-bold">${vessel.fuelLevelPercent}%</span></div>
              <div>ETA: <span class="text-slate-200 font-bold">${vessel.etaString}</span></div>
            </div>
            <div class="text-[10px] text-slate-400">Dest: ${vessel.destination}</div>
          </div>`
        );
        group.addLayer(marker);

        // Vessel Marine Radar Range Ring & Buffer Zone (24 NM)
        if (layerVisibility.radarSweep && isActive) {
          const radarRing = L.circle([vessel.lat, vessel.lng], {
            radius: 44448, // 24 Nautical Miles in meters
            color: '#00f0ff',
            weight: 1,
            fillColor: '#00f0ff',
            fillOpacity: 0.04,
            dashArray: '3, 6'
          });
          radarRing.bindTooltip('Vessel Marine Radar Horizon (24 NM)', { sticky: true });
          group.addLayer(radarRing);

          // Safety Critical Buffer Ring (5 NM)
          const safetyBuffer = L.circle([vessel.lat, vessel.lng], {
            radius: 9260, // 5 NM
            color: '#f43f5e',
            weight: 1.5,
            fillColor: '#f43f5e',
            fillOpacity: 0.08
          });
          group.addLayer(safetyBuffer);
        }

        // Recent AIS Wake Trail with Glowing Polyline
        if (vessel.recentAisTrail.length > 1) {
          const trail = L.polyline(
            vessel.recentAisTrail.map(p => [p.lat, p.lng]),
            { color: '#0ea5e9', weight: 2.5, opacity: 0.85 }
          );
          group.addLayer(trail);
        }
      });
    }

    // 5. HIGH-VISIBILITY ROUTE CORRIDORS & HAZARD MARKERS
    if (layerVisibility.routes && activeVessel) {
      const routes = generateOptimizedRoutes(
        { lat: activeVessel.lat, lng: activeVessel.lng },
        { lat: -70.767, lng: 11.733 }, // Maitri Station
        activeVessel.speedKnots
      );

      routes.forEach(route => {
        const isSelected = activeRouteId === route.id;

        // Background Glow Underlay
        const glowLine = L.polyline(
          route.waypoints.map(w => [w.lat, w.lng]),
          {
            color: route.color,
            weight: isSelected ? 8 : 4,
            opacity: isSelected ? 0.35 : 0.15
          }
        );
        group.addLayer(glowLine);

        // Foreground Sharp Line
        const polyline = L.polyline(
          route.waypoints.map(w => [w.lat, w.lng]),
          {
            color: route.color,
            weight: isSelected ? 3.5 : 2.0,
            opacity: isSelected ? 1.0 : 0.5,
            dashArray: route.type === 'FASTEST' ? '6, 6' : undefined
          }
        );

        polyline.on('click', () => setActiveRouteId(route.id));

        polyline.bindTooltip(
          `<div class="p-1.5 text-xs font-mono">
            <div class="font-bold text-sm" style="color: ${route.color}">${route.name}</div>
            <div>Distance: ${route.distanceKm} km (${route.distanceNM} NM)</div>
            <div>ETA: ${route.etaString} • Fuel: ${route.fuelTons}t</div>
            <div class="font-bold ${route.icebergRisk === 'CRITICAL' ? 'text-rose-400' : 'text-emerald-400'}">
              Collision Hazard: ${route.icebergRisk}
            </div>
          </div>`,
          { sticky: true }
        );

        group.addLayer(polyline);

        // CPA Hazard Beacon Marker (flashing warning on dangerous Route A intersection)
        if (route.cpaHazard && route.cpaHazard.isHazard) {
          const cpaIcon = L.divIcon({
            className: 'custom-cpa-icon',
            html: `<div class="relative flex items-center justify-center px-2 py-1 rounded-lg bg-rose-600 text-white font-mono text-[10px] font-black shadow-[0_0_20px_rgba(244,63,94,1)] animate-bounce border border-rose-300">
              <span>⚠️ CPA: 12.4 NM</span>
            </div>`,
            iconSize: [95, 26],
            iconAnchor: [47, 13]
          });
          const cpaMarker = L.marker([route.cpaHazard.cpaLat, route.cpaHazard.cpaLng], { icon: cpaIcon });
          cpaMarker.bindTooltip('Closest Point of Approach Hazard with Iceberg A23A (12.4 NM clearance)', { sticky: true });
          group.addLayer(cpaMarker);
        }

        // Waypoint Markers for Selected Route
        if (isSelected) {
          route.waypoints.forEach((wp, idx) => {
            if (idx === 0 || idx === route.waypoints.length - 1) return;
            const wpMarker = L.circleMarker([wp.lat, wp.lng], {
              radius: 5,
              color: route.color,
              fillColor: '#030712',
              fillOpacity: 1,
              weight: 2.5
            });
            wpMarker.bindTooltip(
              `<div class="p-1 font-mono text-[10px]">
                <div class="font-bold text-cyan-300">${wp.name || `Waypoint ${idx}`}</div>
                <div>ETA: ${wp.eta} • Sea-Ice: ${wp.iceConcentration}%</div>
              </div>`,
              { sticky: true }
            );
            group.addLayer(wpMarker);
          });
        }
      });
    }

    // 6. CUSTOM DRAWN ROUTE (If active)
    if (customRouteOption && customRouteOption.waypoints.length > 1) {
      const customGlow = L.polyline(
        customRouteOption.waypoints.map(w => [w.lat, w.lng]),
        { color: '#a855f7', weight: 7, opacity: 0.3 }
      );
      group.addLayer(customGlow);

      const customPoly = L.polyline(
        customRouteOption.waypoints.map(w => [w.lat, w.lng]),
        { color: '#c084fc', weight: 3.5, dashArray: '4, 4' }
      );
      group.addLayer(customPoly);

      customRouteOption.waypoints.forEach((wp) => {
        const wpPin = L.circleMarker([wp.lat, wp.lng], {
          radius: 6,
          color: '#a855f7',
          fillColor: '#581c87',
          fillOpacity: 1,
          weight: 2
        });
        group.addLayer(wpPin);
      });
    }

  }, [
    layerVisibility,
    forecastHorizon,
    activeRouteId,
    vessels,
    activeVessel,
    icebergs,
    selectedIceberg,
    stations,
    simulationHours,
    customRouteOption,
    setActiveVesselId,
    setSelectedIcebergId,
    setActiveRouteId
  ]);

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] flex flex-col bg-[#02050e] overflow-hidden select-none">
      
      {/* Map Container */}
      <div className="relative flex-1 w-full h-full">
        
        {/* Leaflet Map Div */}
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Dynamic Ocean Current Particle Overlay */}
        <ParticleCanvasOverlay visible={layerVisibility.oceanCurrents} />

        {/* Floating Layer & Sensor Control Panel */}
        <LayerControl />

        {/* Custom Route Drawer Tool */}
        <CustomRouteDrawer />

        {/* Top-Right Quick Route Status & Controls Pill */}
        <div className="absolute top-4 right-4 z-20 hidden sm:flex items-center space-x-2 p-2 rounded-xl bg-[#061124]/95 backdrop-blur-md border border-cyan-500/30 shadow-[0_8px_32px_rgba(0,0,0,0.5)] text-xs font-mono">
          <span className="text-slate-400">ACTIVE CORRIDOR:</span>
          <span className={`font-bold px-2 py-0.5 rounded ${
            activeRouteId === 'ROUTE-C-AI-BALANCED'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40'
              : activeRouteId === 'ROUTE-B-SAFEST'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
              : activeRouteId === 'ROUTE-CUSTOM'
              ? 'bg-purple-500/20 text-purple-300 border border-purple-400/40'
              : 'bg-rose-500/20 text-rose-300 border border-rose-400/40'
          }`}>
            {activeRouteId === 'ROUTE-C-AI-BALANCED'
              ? 'ROUTE C (AI BALANCED)'
              : activeRouteId === 'ROUTE-B-SAFEST'
              ? 'ROUTE B (SAFEST)'
              : activeRouteId === 'ROUTE-CUSTOM'
              ? 'CUSTOM ROUTE'
              : 'ROUTE A (FASTEST)'}
          </span>

          <button
            onClick={() => setIsVoyageReportOpen(true)}
            className="flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer text-[11px]"
            title="Generate Printable Voyage Plan"
          >
            <FileText className="w-3.5 h-3.5 text-cyan-400" />
            <span>REPORT</span>
          </button>

          {onNavigateToNavPage && (
            <button
              onClick={onNavigateToNavPage}
              className="flex items-center space-x-1 px-2.5 py-1 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-colors cursor-pointer text-[11px]"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>OPTIMIZER</span>
            </button>
          )}
        </div>

        {/* Floating Map Tile & Quick Focus Controls (Top Right) */}
        <div className="absolute top-16 right-4 z-20 flex flex-col space-y-1.5 items-end">
          
          {/* Base Map Tile Selector Button & Popover */}
          <div className="relative">
            <button
              onClick={() => setIsTileSelectorOpen(!isTileSelectorOpen)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#061124]/95 hover:bg-slate-800 border border-cyan-500/40 text-cyan-300 text-xs font-mono shadow-[0_0_15px_rgba(0,240,255,0.2)] transition-colors cursor-pointer"
              title="Select Base Map Layer"
            >
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span>{MAP_TILES[mapProvider].icon} {MAP_TILES[mapProvider].name}</span>
            </button>

            {isTileSelectorOpen && (
              <div className="absolute top-full right-0 mt-1.5 w-56 rounded-xl bg-[#091529]/95 backdrop-blur-xl border border-cyan-500/40 shadow-[0_8px_32px_rgba(0,0,0,0.8)] p-2 space-y-1 z-30 font-mono text-xs">
                <div className="text-[10px] text-slate-400 font-bold px-2 py-1 uppercase tracking-wider border-b border-slate-800">
                  BASE MAP LAYERS
                </div>
                {(Object.keys(MAP_TILES) as MapProvider[]).map((key) => {
                  const cfg = MAP_TILES[key];
                  const isSelected = mapProvider === key;
                  return (
                    <button
                      key={key}
                      onClick={() => {
                        setMapProvider(key);
                        setIsTileSelectorOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 font-bold'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <span>{cfg.icon}</span>
                        <span>{cfg.name}</span>
                      </div>
                      {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />}
                    </button>
                  );
                })}

                <div className="pt-1 border-t border-slate-800">
                  <button
                    onClick={() => setShowSeamarks(!showSeamarks)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-colors cursor-pointer ${
                      showSeamarks
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 font-bold'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Anchor className="w-3.5 h-3.5 text-emerald-400" />
                      <span>⚓ Nautical Marks</span>
                    </div>
                    <span className="text-[10px]">{showSeamarks ? 'ON' : 'OFF'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={centerOnVessel}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#061124]/90 hover:bg-slate-800 border border-sky-500/30 text-cyan-300 text-xs font-mono shadow-md transition-colors cursor-pointer"
            title="Center map on active vessel"
          >
            <Crosshair className="w-3.5 h-3.5" />
            <span className="hidden md:inline">FOCUS VESSEL</span>
          </button>

          <button
            onClick={centerOnA23A}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#061124]/90 hover:bg-slate-800 border border-rose-500/30 text-rose-300 text-xs font-mono shadow-md transition-colors cursor-pointer"
            title="Center map on Mega-Iceberg A23A"
          >
            <span>🧊</span>
            <span className="hidden md:inline">FOCUS A23A</span>
          </button>

          <button
            onClick={centerAntarcticOverview}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#061124]/90 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-mono shadow-md transition-colors cursor-pointer"
            title="View entire Antarctic continent"
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden md:inline">OVERVIEW</span>
          </button>
          <button
            onClick={() => setShowDriftPlayer(p => !p)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono shadow-md transition-colors cursor-pointer ${
              showDriftPlayer
                ? 'bg-cyan-500/20 border-cyan-400/50 text-cyan-300'
                : 'bg-[#061124]/90 hover:bg-slate-800 border-slate-700 text-slate-300'
            }`}
            title="Toggle 72h Iceberg Drift Timeline"
          >
            <span>🕐</span>
            <span className="hidden md:inline">72H DRIFT</span>
          </button>
        </div>

        {/* Time-Lapse & 72h Drift Controller Bar */}
        {showDriftPlayer && <TimeLapsePlayer onClose={() => setShowDriftPlayer(false)} />}

        {/* Live Coordinate & Polar Readout (Bottom-Right) */}
        <div className="absolute bottom-4 right-4 z-20 px-3 py-1.5 rounded-lg bg-slate-950/85 backdrop-blur-md border border-sky-500/20 text-[11px] font-mono text-cyan-300 shadow-lg hidden sm:flex items-center space-x-3">
          <span>{cursorCoords ? formatCoordinates(cursorCoords.lat, cursorCoords.lng) : '70°46\'S, 11°44\'E'}</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">POLAR STEREOGRAPHIC</span>
        </div>

        {/* Re-Routing Alert Modal */}
        {isRerouteModalOpen && (
          <div className="absolute inset-0 z-40 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
            <div className="relative w-full max-w-lg rounded-xl bg-[#091529] border border-rose-500/60 shadow-[0_0_50px_rgba(244,63,94,0.35)] p-6 space-y-4">
              
              <div className="flex items-start space-x-3">
                <div className="p-2.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-400 mt-0.5">
                  <ShieldAlert className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-white">ROUTE UPDATE REQUIRED</h3>
                  <p className="text-xs text-rose-300 font-mono">Iceberg A23A trajectory intersects Route A within 12.4 NM</p>
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800 space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Current Route A ETA:</span>
                  <span className="text-slate-200">31h 42m (High Collision Risk: 73%)</span>
                </div>
                <div className="flex items-center justify-between text-cyan-300">
                  <span>New AI Route C ETA:</span>
                  <span className="font-bold">35h 05m (+34m)</span>
                </div>
                <div className="flex items-center justify-between text-emerald-400">
                  <span>Hazard Exposure Reduction:</span>
                  <span className="font-bold">-42% (Clearance: 28.4 NM)</span>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  onClick={() => setIsRerouteModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs font-mono cursor-pointer"
                >
                  DISMISS
                </button>
                <button
                  onClick={acceptReroute}
                  className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>ACCEPT NEW AI ROUTE</span>
                </button>
              </div>

            </div>
          </div>
        )}

      </div>

      {/* Telemetry Bar HUD (Bottom) */}
      <TelemetryBar />

    </div>
  );
};
