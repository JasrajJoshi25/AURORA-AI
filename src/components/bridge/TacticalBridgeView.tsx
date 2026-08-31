import React, { useEffect, useRef, useState } from 'react';
import { Compass, ShieldAlert, Maximize2, Minimize2, Volume2, Radio } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { soundFx } from '../../utils/audioEngine';

export const TacticalBridgeView: React.FC = () => {
  const { activeVessel, icebergs, soundAlertsEnabled } = useApp();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [fullscreen, setFullscreen] = useState<boolean>(false);
  const [targetLockId] = useState<string>('A23A');

  const lockedBerg = icebergs.find(i => i.id === targetLockId) || icebergs[0];
  const heading = activeVessel?.headingDeg || 165;
  const speed = activeVessel?.speedKnots || 12.4;

  // Animation Loop for Forward Bridge Horizon
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let time = 0;

    const render = () => {
      time += 0.02;
      const w = canvas.width;
      const h = canvas.height;
      const horizonY = h * 0.48;

      // 1. Polar Sky & Aurora Borealis
      const skyGrad = ctx.createLinearGradient(0, 0, 0, horizonY);
      skyGrad.addColorStop(0, '#010814');
      skyGrad.addColorStop(0.6, '#02182b');
      skyGrad.addColorStop(1, '#053147');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, horizonY);

      // Aurora Shimmer
      ctx.save();
      ctx.globalAlpha = 0.25;
      const auroraGrad = ctx.createLinearGradient(0, 0, w, horizonY);
      auroraGrad.addColorStop(0.2, '#06b6d4');
      auroraGrad.addColorStop(0.5, '#10b981');
      auroraGrad.addColorStop(0.8, '#0284c7');
      ctx.fillStyle = auroraGrad;
      ctx.beginPath();
      ctx.moveTo(0, 30);
      for (let x = 0; x <= w; x += 40) {
        const y = 40 + Math.sin(x * 0.008 + time) * 25 + Math.cos(x * 0.015 - time * 0.5) * 15;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(w, horizonY);
      ctx.lineTo(0, horizonY);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // 2. Dark Antarctic Ocean Surface with Perspective Grid
      const oceanGrad = ctx.createLinearGradient(0, horizonY, 0, h);
      oceanGrad.addColorStop(0, '#041c2c');
      oceanGrad.addColorStop(0.5, '#020d18');
      oceanGrad.addColorStop(1, '#01050a');
      ctx.fillStyle = oceanGrad;
      ctx.fillRect(0, horizonY, w, h - horizonY);

      // Ocean Perspective Moving Grid
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.12)';
      ctx.lineWidth = 1;
      const vanishX = w / 2;
      const vanishY = horizonY;

      // Radial lines from horizon
      for (let x = -w * 0.5; x <= w * 1.5; x += 100) {
        ctx.beginPath();
        ctx.moveTo(vanishX, vanishY);
        ctx.lineTo(x, h);
        ctx.stroke();
      }

      // Horizontal wave lines moving towards camera
      const offset = (time * 40) % 60;
      for (let y = horizonY + 5; y < h; y += 30) {
        const adjustedY = y + offset;
        if (adjustedY > horizonY && adjustedY < h) {
          ctx.beginPath();
          ctx.moveTo(0, adjustedY);
          ctx.lineTo(w, adjustedY);
          ctx.stroke();
        }
      }

      // 3. Floating Ice Floes
      ctx.fillStyle = 'rgba(224, 242, 254, 0.45)';
      for (let i = 0; i < 8; i++) {
        const floeProgress = ((time * 0.15 + i * 0.125) % 1);
        const floeY = horizonY + Math.pow(floeProgress, 1.8) * (h - horizonY);
        const floeX = (vanishX + (Math.sin(i * 1.7) * 0.8) * (floeY - horizonY) * 1.5);
        const floeW = 15 + floeProgress * 65;
        const floeH = 4 + floeProgress * 18;

        if (floeY > horizonY + 10 && floeY < h - 40) {
          ctx.beginPath();
          ctx.ellipse(floeX, floeY, floeW, floeH, 0, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 4. Render Mega-Iceberg A23A on Horizon (Left-Center)
      const bergX = w * 0.38;
      const bergY = horizonY - 45;
      const bergW = 180;
      const bergH = 65;

      // Iceberg Gradient Body
      const bergGrad = ctx.createLinearGradient(bergX, bergY, bergX, horizonY);
      bergGrad.addColorStop(0, '#f0f9ff');
      bergGrad.addColorStop(0.4, '#bae6fd');
      bergGrad.addColorStop(0.8, '#38bdf8');
      bergGrad.addColorStop(1, '#0369a1');

      ctx.save();
      ctx.fillStyle = bergGrad;
      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 1.5;
      ctx.shadowColor = 'rgba(0, 240, 255, 0.6)';
      ctx.shadowBlur = 12;

      ctx.beginPath();
      ctx.moveTo(bergX - bergW / 2, horizonY);
      ctx.lineTo(bergX - bergW / 2 + 15, bergY + 10);
      ctx.lineTo(bergX - bergW / 4, bergY);
      ctx.lineTo(bergX + bergW / 4, bergY + 5);
      ctx.lineTo(bergX + bergW / 2 - 10, bergY + 15);
      ctx.lineTo(bergX + bergW / 2, horizonY);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      // 5. Target Lock HUD Reticle on Mega-Iceberg A23A
      ctx.save();
      ctx.strokeStyle = '#f43f5e';
      ctx.lineWidth = 2;
      const boxPad = 15;
      const bx = bergX - bergW / 2 - boxPad;
      const by = bergY - boxPad;
      const bw = bergW + boxPad * 2;
      const bh = bergH + boxPad * 2;

      // Corner brackets
      const bracketLen = 14;
      // Top Left
      ctx.beginPath();
      ctx.moveTo(bx, by + bracketLen);
      ctx.lineTo(bx, by);
      ctx.lineTo(bx + bracketLen, by);
      ctx.stroke();
      // Top Right
      ctx.beginPath();
      ctx.moveTo(bx + bw - bracketLen, by);
      ctx.lineTo(bx + bw, by);
      ctx.lineTo(bx + bw, by + bracketLen);
      ctx.stroke();
      // Bottom Left
      ctx.beginPath();
      ctx.moveTo(bx, by + bh - bracketLen);
      ctx.lineTo(bx, by + bh);
      ctx.lineTo(bx + bracketLen, by + bh);
      ctx.stroke();
      // Bottom Right
      ctx.beginPath();
      ctx.moveTo(bx + bw - bracketLen, by + bh);
      ctx.lineTo(bx + bw, by + bh);
      ctx.lineTo(bx + bw, by + bh - bracketLen);
      ctx.stroke();

      // Target Label
      ctx.fillStyle = '#f43f5e';
      ctx.font = 'bold 11px JetBrains Mono, monospace';
      ctx.fillText('TARGET LOCK: MEGA-ICEBERG A23A [68×57 KM]', bx, by - 8);
      ctx.fillStyle = '#fecdd3';
      ctx.font = '10px JetBrains Mono, monospace';
      ctx.fillText('RNG: 14.8 NM | BRG: 042° | KEEL DRAFT: -380M | CPA: 12.4 NM', bx, by + bh + 16);
      ctx.restore();

      // 6. Artificial Horizon Pitch Ladder (Center)
      ctx.save();
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.4)';
      ctx.lineWidth = 1.5;
      const midX = w / 2;
      const midY = horizonY;

      // Center crosshair
      ctx.beginPath();
      ctx.moveTo(midX - 25, midY);
      ctx.lineTo(midX - 8, midY);
      ctx.moveTo(midX + 8, midY);
      ctx.lineTo(midX + 25, midY);
      ctx.moveTo(midX, midY - 12);
      ctx.lineTo(midX, midY + 12);
      ctx.stroke();

      // Pitch rungs (+5 deg, -5 deg)
      [-40, 40].forEach(dy => {
        ctx.beginPath();
        ctx.moveTo(midX - 35, midY + dy);
        ctx.lineTo(midX - 15, midY + dy);
        ctx.moveTo(midX + 15, midY + dy);
        ctx.lineTo(midX + 35, midY + dy);
        ctx.stroke();
      });
      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [lockedBerg]);

  // Periodic sonar sound trigger in bridge view
  useEffect(() => {
    if (!soundAlertsEnabled) return;
    const interval = setInterval(() => {
      soundFx.playRadarSweep();
    }, 8000);
    return () => clearInterval(interval);
  }, [soundAlertsEnabled]);

  return (
    <div className={`relative w-full h-full flex flex-col bg-[#02050e] overflow-hidden text-white font-mono ${
      fullscreen ? 'fixed inset-0 z-50' : ''
    }`}>
      
      {/* Top Bridge Nav Bar & Gyro Compass Tape */}
      <div className="w-full bg-[#061124]/95 border-b border-sky-500/30 px-4 py-2 flex items-center justify-between z-10 text-xs">
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 text-cyan-300 font-bold">
            <Radio className="w-4 h-4 animate-pulse" />
            <span>BRIDGE NAVIGATION COCKPIT HUD</span>
          </div>
          <span className="text-slate-600">|</span>
          <span className="text-slate-300">VESSEL: {activeVessel?.name || 'ORV Sagar Anveshika'}</span>
        </div>

        {/* Gyro Compass Tape Heading Readout */}
        <div className="flex items-center space-x-2 px-3 py-1 rounded-lg bg-slate-950 border border-cyan-400/40 text-cyan-300 shadow-[0_0_12px_rgba(0,240,255,0.3)]">
          <Compass className="w-4 h-4 text-cyan-400" />
          <span>GYRO HDG:</span>
          <span className="font-bold text-white text-sm">{heading}° SSE</span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => soundFx.playSonarPing()}
            className="flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-900 border border-slate-700 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300 text-[11px] cursor-pointer"
            title="Ping Active Sonar"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>SONAR PING</span>
          </button>

          <button
            onClick={() => setFullscreen(!fullscreen)}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white cursor-pointer"
          >
            {fullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>

      </div>

      {/* Main Bridge Viewport */}
      <div className="relative flex-1 w-full h-full flex items-center justify-center overflow-hidden">
        
        {/* Forward Horizon Canvas */}
        <canvas
          ref={canvasRef}
          width={1200}
          height={650}
          className="w-full h-full object-cover"
        />

        {/* Left Tape: Speed Vector & Throttle HUD */}
        <div className="absolute left-6 top-1/2 -translate-y-1/2 p-3 rounded-2xl bg-[#061124]/90 backdrop-blur-md border border-cyan-500/30 space-y-2 text-center text-xs shadow-xl pointer-events-none">
          <span className="text-[10px] text-slate-400 uppercase block font-bold">SPEED TAPE</span>
          <div className="text-2xl font-black text-cyan-300">{speed}</div>
          <span className="text-[10px] text-slate-400">KNOTS</span>
          <div className="w-full bg-slate-800 h-24 rounded-full p-1 flex flex-col justify-end">
            <div
              className="w-full bg-cyan-400 rounded-full transition-all"
              style={{ height: `${(speed / 20) * 100}%` }}
            />
          </div>
          <span className="text-[10px] text-emerald-400 font-bold">AHEAD FULL</span>
        </div>

        {/* Right Tape: Depth Sounding & Keel Clearance HUD */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 p-3 rounded-2xl bg-[#061124]/90 backdrop-blur-md border border-sky-500/30 space-y-2 text-center text-xs shadow-xl pointer-events-none">
          <span className="text-[10px] text-slate-400 uppercase block font-bold">ECHO SOUNDER</span>
          <div className="text-2xl font-black text-white">485</div>
          <span className="text-[10px] text-slate-400">METERS</span>
          <div className="w-full bg-slate-800 h-24 rounded-full p-1 flex flex-col justify-end">
            <div className="w-full bg-emerald-400 rounded-full h-3/4" />
          </div>
          <span className="text-[10px] text-emerald-400 font-bold">CLEAR DEPTH</span>
        </div>

        {/* Bottom Tactical Warning Flasher Alert */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center space-x-3 px-5 py-2.5 rounded-2xl bg-rose-950/90 backdrop-blur-md border-2 border-rose-500 shadow-[0_0_35px_rgba(244,63,94,0.6)] animate-pulse">
          <ShieldAlert className="w-5 h-5 text-rose-400" />
          <div>
            <div className="text-xs font-bold text-white uppercase tracking-wider">COLLISION PROXIMITY ALERT</div>
            <div className="text-[11px] text-rose-300">Iceberg A23A Bearing 042° • Distance: 14.8 NM • Closest Approach: 12.4 NM</div>
          </div>
          <button
            onClick={() => soundFx.playCollisionKlaxon()}
            className="ml-2 px-2.5 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white font-bold text-[10px] cursor-pointer"
          >
            TEST KLAXON
          </button>
        </div>

      </div>

    </div>
  );
};
