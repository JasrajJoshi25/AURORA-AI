import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  age: number;
  maxAge: number;
  color: string;
}

interface ParticleCanvasOverlayProps {
  visible: boolean;
}

export const ParticleCanvasOverlay: React.FC<ParticleCanvasOverlayProps> = ({ visible }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!visible) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Initialize 120 streamlines representing Antarctic Circumpolar Current (ACC) and Katabatic flows
    const particleCount = 100;
    const particles: Particle[] = [];

    const initParticle = (p?: Partial<Particle>): Particle => {
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.random() * (Math.min(width, height) * 0.45) + 60;
      const angle = Math.random() * Math.PI * 2;

      return {
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        // Tangential velocity around Antarctica + slight outward drift
        vx: -Math.sin(angle) * (1.2 + Math.random() * 0.8) + (Math.random() - 0.5) * 0.2,
        vy: Math.cos(angle) * (1.2 + Math.random() * 0.8) + (Math.random() - 0.5) * 0.2,
        age: 0,
        maxAge: Math.floor(Math.random() * 120) + 60,
        color: Math.random() > 0.4 ? 'rgba(0, 240, 255, ' : 'rgba(56, 189, 248, ',
        ...p
      };
    };

    for (let i = 0; i < particleCount; i++) {
      particles.push(initParticle({ age: Math.floor(Math.random() * 100) }));
    }

    const render = () => {
      // Create trailing fading effect
      ctx.fillStyle = 'rgba(3, 7, 18, 0.08)';
      ctx.fillRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.age++;

        // Circumpolar rotational acceleration
        const dx = p.x - centerX;
        const dy = p.y - centerY;
        const dist = Math.hypot(dx, dy);
        const angle = Math.atan2(dy, dx);

        p.vx = -Math.sin(angle) * 1.5 + (Math.random() - 0.5) * 0.1;
        p.vy = Math.cos(angle) * 1.5 + (Math.random() - 0.5) * 0.1;

        // Draw streamlined tail
        const alpha = Math.sin((p.age / p.maxAge) * Math.PI) * 0.6;
        ctx.strokeStyle = `${p.color}${alpha.toFixed(2)})`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(p.x - p.vx * 3, p.y - p.vy * 3);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();

        if (p.age >= p.maxAge || dist < 40 || dist > Math.max(width, height) * 0.7) {
          particles[i] = initParticle();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-10 opacity-75 mix-blend-screen"
    />
  );
};
