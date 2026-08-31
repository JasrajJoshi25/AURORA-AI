import React, { useEffect, useRef, useState } from 'react';
import { Shield, Waves, Volume2, Radio } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { soundFx } from '../../utils/audioEngine';
import { MOCK_ICEBERGS } from '../../data/mockIcebergs';

export const SubsurfaceKeelSonar: React.FC = () => {
  const { icebergs, selectedIceberg, setSelectedIcebergId } = useApp();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [sonarFreqKhz, setSonarFreqKhz] = useState<number>(12); // 12 kHz Deep MBES
  const [showMultiContacts, setShowMultiContacts] = useState<boolean>(true);

  const bergList = (icebergs && icebergs.length > 0) ? icebergs : MOCK_ICEBERGS;
  const activeBerg = selectedIceberg || bergList[0];

  // 3D Wireframe Bathymetry & Multi-Iceberg Keel Sonar Canvas Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let angle = 0;

    const render = () => {
      angle += 0.008;
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2 + 30;

      ctx.fillStyle = '#020612';
      ctx.fillRect(0, 0, w, h);

      // 1. Water Column Depth Grid & Depth Markers
      ctx.strokeStyle = 'rgba(14, 165, 233, 0.15)';
      ctx.lineWidth = 1;
      for (let y = 60; y < h - 40; y += 40) {
        ctx.beginPath();
        ctx.moveTo(40, y);
        ctx.lineTo(w - 40, y);
        ctx.stroke();

        const depth = Math.round(((y - 60) / (h - 100)) * 600);
        ctx.fillStyle = 'rgba(56, 189, 248, 0.4)';
        ctx.font = '10px JetBrains Mono, monospace';
        ctx.fillText(`-${depth}m`, 10, y + 3);
      }

      // 2. 3D Seabed Bathymetry Wireframe Mesh
      ctx.save();
      const rows = 14;
      const cols = 24;
      const spacingX = 26;
      const spacingZ = 20;

      for (let r = 0; r < rows; r++) {
        ctx.beginPath();
        ctx.strokeStyle = r % 2 === 0 ? 'rgba(245, 158, 11, 0.6)' : 'rgba(217, 119, 6, 0.4)';
        ctx.lineWidth = 1.2;

        for (let c = 0; c < cols; c++) {
          const rawX = (c - cols / 2) * spacingX;
          const rawZ = (r - rows / 2) * spacingZ;

          // 3D Rotation Projection
          const rotX = rawX * Math.cos(angle * 0.3) - rawZ * Math.sin(angle * 0.3);
          const rotZ = rawX * Math.sin(angle * 0.3) + rawZ * Math.cos(angle * 0.3);

          // Bathymetry seafloor ridge simulation
          const elevation = Math.sin(c * 0.4 + r * 0.3) * 25 + Math.cos(c * 0.2) * 20;
          const projX = cx + rotX * (1 + rotZ * 0.002);
          const projY = cy + 130 + rotZ * 0.8 - elevation;

          if (c === 0) ctx.moveTo(projX, projY);
          else ctx.lineTo(projX, projY);
        }
        ctx.stroke();
      }
      ctx.restore();

      // 3. Render Secondary Distant Icebergs (when Multi-Contacts is enabled)
      if (showMultiContacts) {
        const secondaryBergs = bergList.filter(b => b.id !== activeBerg.id);
        
        secondaryBergs.forEach((secBerg, idx) => {
          ctx.save();
          // Distribute secondary contacts spatially in 3D orbit around the sensor
          const offsetAngle = angle * 0.2 + (idx + 1) * (Math.PI * 2 / (secondaryBergs.length + 1));
          const distanceRadius = 240 + (idx % 2) * 90;
          const secX = cx + Math.cos(offsetAngle) * distanceRadius;
          const secY = 60;
          const secDepthPx = (secBerg.draftDepthMeters / 600) * (h - 100) * 0.65; // scale down distant bergs
          const secWidth = Math.max(30, (secBerg.widthKm / 60) * 80);

          // Faint acoustic echo wireframe for secondary contact
          ctx.strokeStyle = secBerg.riskLevel === 'CRITICAL' 
            ? 'rgba(244, 63, 94, 0.45)' 
            : secBerg.riskLevel === 'HIGH'
            ? 'rgba(245, 158, 11, 0.45)'
            : 'rgba(56, 189, 248, 0.35)';
          ctx.fillStyle = 'rgba(6, 17, 36, 0.6)';
          ctx.lineWidth = 1;
          ctx.setLineDash([2, 2]);

          // Secondary Freeboard
          ctx.beginPath();
          ctx.moveTo(secX - secWidth * 0.5, secY);
          ctx.lineTo(secX - secWidth * 0.3, secY - 14);
          ctx.lineTo(secX + secWidth * 0.3, secY - 14);
          ctx.lineTo(secX + secWidth * 0.5, secY);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Secondary Keel
          ctx.beginPath();
          ctx.moveTo(secX - secWidth * 0.5, secY);
          ctx.lineTo(secX - secWidth * 0.6, secY + secDepthPx * 0.4);
          ctx.lineTo(secX, secY + secDepthPx);
          ctx.lineTo(secX + secWidth * 0.6, secY + secDepthPx * 0.4);
          ctx.lineTo(secX + secWidth * 0.5, secY);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Contact Label & Depth Tag
          ctx.setLineDash([]);
          ctx.fillStyle = 'rgba(148, 163, 184, 0.8)';
          ctx.font = '9px JetBrains Mono, monospace';
          ctx.fillText(`[${secBerg.id}] -${secBerg.draftDepthMeters}m`, secX - 25, secY + secDepthPx + 14);
          
          ctx.restore();
        });
      }

      // 4. 3D Primary Selected Iceberg Keel Mesh (Detailed Hero Draft)
      ctx.save();
      const keelCenterX = cx - 110 * Math.cos(angle * 0.3);
      const keelCenterY = 60;
      const keelDepthPx = (activeBerg.draftDepthMeters / 600) * (h - 100);
      const bergWidthPx = Math.max(60, Math.min(130, (activeBerg.widthKm / 60) * 110));
      const freeboardPx = Math.max(18, (activeBerg.freeboardMeters / 60) * 35);

      // Above water freeboard
      ctx.fillStyle = 'rgba(224, 242, 254, 0.9)';
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(keelCenterX - bergWidthPx, keelCenterY);
      ctx.lineTo(keelCenterX - bergWidthPx * 0.75, keelCenterY - freeboardPx);
      ctx.lineTo(keelCenterX + bergWidthPx * 0.75, keelCenterY - freeboardPx * 0.9);
      ctx.lineTo(keelCenterX + bergWidthPx, keelCenterY);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Subsurface Deep Keel Draft Shape (Dynamic based on Shape Type)
      const keelGrad = ctx.createLinearGradient(keelCenterX, keelCenterY, keelCenterX, keelCenterY + keelDepthPx);
      keelGrad.addColorStop(0, 'rgba(56, 189, 248, 0.75)');
      keelGrad.addColorStop(0.5, 'rgba(2, 132, 199, 0.85)');
      keelGrad.addColorStop(1, 'rgba(3, 105, 161, 0.95)');

      ctx.fillStyle = keelGrad;
      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 2;
      ctx.shadowColor = 'rgba(0, 240, 255, 0.6)';
      ctx.shadowBlur = 16;

      ctx.beginPath();
      if (activeBerg.shapeType === 'PINNACLE_WEDGE' || activeBerg.shapeType === 'DIAMOND_TABULAR') {
        // Sharp angular keel
        ctx.moveTo(keelCenterX - bergWidthPx, keelCenterY);
        ctx.lineTo(keelCenterX - bergWidthPx * 1.1, keelCenterY + keelDepthPx * 0.35);
        ctx.lineTo(keelCenterX - bergWidthPx * 0.4, keelCenterY + keelDepthPx * 0.8);
        ctx.lineTo(keelCenterX, keelCenterY + keelDepthPx);
        ctx.lineTo(keelCenterX + bergWidthPx * 0.5, keelCenterY + keelDepthPx * 0.75);
        ctx.lineTo(keelCenterX + bergWidthPx * 1.05, keelCenterY + keelDepthPx * 0.3);
        ctx.lineTo(keelCenterX + bergWidthPx, keelCenterY);
      } else {
        // Broad massive tabular keel
        ctx.moveTo(keelCenterX - bergWidthPx, keelCenterY);
        ctx.lineTo(keelCenterX - bergWidthPx * 1.15, keelCenterY + keelDepthPx * 0.4);
        ctx.lineTo(keelCenterX - bergWidthPx * 0.65, keelCenterY + keelDepthPx * 0.85);
        ctx.lineTo(keelCenterX, keelCenterY + keelDepthPx);
        ctx.lineTo(keelCenterX + bergWidthPx * 0.75, keelCenterY + keelDepthPx * 0.8);
        ctx.lineTo(keelCenterX + bergWidthPx * 1.1, keelCenterY + keelDepthPx * 0.35);
        ctx.lineTo(keelCenterX + bergWidthPx, keelCenterY);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Keel Draft Annotation Line
      ctx.strokeStyle = '#f43f5e';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(keelCenterX, keelCenterY + keelDepthPx);
      ctx.lineTo(keelCenterX + 160, keelCenterY + keelDepthPx);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#f43f5e';
      ctx.font = 'bold 11px JetBrains Mono, monospace';
      ctx.fillText(`TARGET KEEL DRAFT: -${activeBerg.draftDepthMeters}m`, keelCenterX + 165, keelCenterY + keelDepthPx + 4);
      ctx.restore();

      // 5. Vessel Keel (8.5m depth draft at top right)
      const vesselX = cx + 200;
      const vesselY = 60;
      ctx.fillStyle = '#00f0ff';
      ctx.beginPath();
      ctx.moveTo(vesselX - 25, vesselY);
      ctx.lineTo(vesselX + 25, vesselY);
      ctx.lineTo(vesselX, vesselY + 18);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#bae6fd';
      ctx.font = '10px JetBrains Mono, monospace';
      ctx.fillText(`ORV HULL DRAFT (-8.5m)`, vesselX - 55, vesselY - 10);

      // Acoustic MBES Sounding Ping Cone from vessel
      ctx.save();
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.3)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(vesselX, vesselY + 18);
      ctx.lineTo(vesselX - 120, h - 60);
      ctx.moveTo(vesselX, vesselY + 18);
      ctx.lineTo(vesselX + 120, h - 60);
      ctx.stroke();
      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [activeBerg, showMultiContacts, bergList]);

  const handleSonarPing = () => {
    soundFx.playSonarPing();
  };

  const seafloorDepth = activeBerg.keelProfile?.averageSeafloorDepthM || 540;
  const underKeelClearance = seafloorDepth - activeBerg.draftDepthMeters;

  return (
    <div className="relative w-full h-full flex flex-col bg-[#020612] text-white font-mono overflow-hidden select-none">
      
      {/* Top Header Controls Bar */}
      <div className="w-full bg-[#061124]/95 border-b border-cyan-500/30 px-3 sm:px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs z-10">
        
        {/* Title & Target Indicator */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 text-cyan-300 font-bold">
            <Waves className="w-4 h-4 text-cyan-400" />
            <span>3D MULTI-BEAM SUBSURFACE KEEL SONAR</span>
          </div>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <span className="text-slate-300 font-bold hidden md:inline">{activeBerg.name}</span>
        </div>

        {/* Iceberg Target Selector Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto py-1">
          <span className="text-slate-400 text-[11px] font-mono mr-1 hidden sm:inline">TARGET:</span>
          {bergList.map(b => (
            <button
              key={b.id}
              onClick={() => {
                setSelectedIcebergId(b.id);
                soundFx.playUiClick();
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold font-mono transition-all cursor-pointer ${
                activeBerg.id === b.id
                  ? 'bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(0,240,255,0.45)]'
                  : 'bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white'
              }`}
            >
              <span>{b.id}</span>
              <span className="ml-1 text-[10px] opacity-75">(-{b.draftDepthMeters}m)</span>
            </button>
          ))}
        </div>

        {/* Sonar Settings & Ping Action */}
        <div className="flex items-center space-x-2">
          
          {/* Multi-Contact Scan Toggle */}
          <button
            onClick={() => setShowMultiContacts(prev => !prev)}
            className={`px-2.5 py-1 rounded-lg border text-[11px] font-mono font-bold transition-all cursor-pointer ${
              showMultiContacts
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
                : 'bg-slate-900 text-slate-400 border-slate-700'
            }`}
            title="Toggle display of surrounding secondary iceberg sonar contacts"
          >
            <Radio className="w-3 h-3 inline mr-1" />
            <span>{showMultiContacts ? 'ALL BERGS (ON)' : 'SINGLE BERG'}</span>
          </button>

          {/* Sonar Frequency Toggle */}
          <div className="flex items-center p-0.5 rounded bg-slate-900 border border-slate-700 text-[10px]">
            <button
              onClick={() => setSonarFreqKhz(12)}
              className={`px-2 py-0.5 rounded font-bold transition-all cursor-pointer ${
                sonarFreqKhz === 12 ? 'bg-cyan-500 text-slate-950 shadow-[0_0_8px_rgba(0,240,255,0.4)]' : 'text-slate-400'
              }`}
            >
              12 kHz (DEEP)
            </button>
            <button
              onClick={() => setSonarFreqKhz(200)}
              className={`px-2 py-0.5 rounded font-bold transition-all cursor-pointer ${
                sonarFreqKhz === 200 ? 'bg-cyan-500 text-slate-950 shadow-[0_0_8px_rgba(0,240,255,0.4)]' : 'text-slate-400'
              }`}
            >
              200 kHz (SHALLOW)
            </button>
          </div>

          <button
            onClick={handleSonarPing}
            className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-[11px] shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all cursor-pointer"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>PING</span>
          </button>
        </div>

      </div>

      {/* Main 3D Canvas Area */}
      <div className="relative flex-1 w-full h-full flex items-center justify-center overflow-hidden">
        
        <canvas
          ref={canvasRef}
          width={1200}
          height={650}
          className="w-full h-full object-cover"
        />

        {/* Floating Telemetry Box (Top-Left) */}
        <div className="absolute top-4 left-4 p-4 rounded-2xl bg-[#061124]/90 backdrop-blur-xl border border-cyan-500/30 space-y-2 text-xs shadow-2xl max-w-xs pointer-events-none">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
            <span className="font-bold text-cyan-300 truncate mr-2">{activeBerg.name}</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 shrink-0 font-bold">
              {activeBerg.shapeType.replace(/_/g, ' ')}
            </span>
          </div>

          <div className="space-y-1.5 text-[11px]">
            <div className="flex justify-between">
              <span className="text-slate-400">Subsurface Keel Depth:</span>
              <span className="text-rose-400 font-bold">-{activeBerg.draftDepthMeters} meters</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Freeboard Above Water:</span>
              <span className="text-slate-200">+{activeBerg.freeboardMeters} meters</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Estimated Mass:</span>
              <span className="text-cyan-300 font-bold">{activeBerg.estimatedMassGt} Gt</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Average Seafloor Sounding:</span>
              <span className="text-amber-300 font-bold">-{seafloorDepth} meters</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Under-Keel Seabed Clearance:</span>
              <span className={`font-bold ${underKeelClearance < 100 ? 'text-rose-400' : 'text-emerald-400'}`}>
                +{underKeelClearance} meters
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Sound Velocity (SVP):</span>
              <span className="text-sky-300">1,448.2 m/s</span>
            </div>
          </div>
        </div>

        {/* Grounding Hazard Alert Banner (Bottom-Right) */}
        <div className="absolute bottom-6 right-6 p-3.5 rounded-2xl bg-slate-950/85 backdrop-blur-md border border-cyan-500/30 text-xs space-y-1 shadow-xl max-w-sm pointer-events-none">
          <div className="flex items-center space-x-2 font-bold text-cyan-300">
            <Shield className="w-4 h-4 text-cyan-400" />
            <span>ACOUSTIC BATHYMETRIC BATH PROFILE</span>
          </div>
          <p className="text-[11px] text-slate-300 font-sans leading-tight">
            Target {activeBerg.id} ({activeBerg.lengthKm}×{activeBerg.widthKm} km) keel draft at -{activeBerg.draftDepthMeters}m. Seafloor depth is -{seafloorDepth}m ({underKeelClearance}m clearance). Grounding risk: <strong className={activeBerg.keelProfile?.groundingRisk === 'HIGH' ? 'text-rose-400' : 'text-emerald-400'}>{activeBerg.keelProfile?.groundingRisk || 'MODERATE'}</strong>.
          </p>
        </div>

      </div>

    </div>
  );
};
