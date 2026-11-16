import React, { useEffect, useRef } from 'react';

interface AmbientBackdropProps {
  theme: 'dark' | 'light';
}

interface DataNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
}

export const AmbientBackdrop: React.FC<AmbientBackdropProps> = ({ theme }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const spotlightRef = useRef<HTMLDivElement | null>(null);

  // Subtle cursor spotlight on the architectural grid
  useEffect(() => {
    const el = spotlightRef.current;
    if (!el) return;

    const handleMove = (e: PointerEvent) => {
      el.style.setProperty('--mx', `${e.clientX}px`);
      el.style.setProperty('--my', `${e.clientY}px`);
    };

    window.addEventListener('pointermove', handleMove, { passive: true });
    return () => window.removeEventListener('pointermove', handleMove);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const mouse = { x: -9999, y: -9999 };
    const onPointerMove = (e: PointerEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const onPointerLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerleave', onPointerLeave);

    const nodeCount = width < 640 ? 28 : 48;
    const nodes: DataNode[] = Array.from({ length: nodeCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.42,
      vy: (Math.random() - 0.5) * 0.42,
      radius: 1.5 + Math.random() * 1.6,
      opacity: 0.35 + Math.random() * 0.4,
    }));

    let rafId = 0;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      const isDark = theme === 'dark';
      const lineRgb = isDark ? '56, 189, 248' : '37, 99, 235';
      const dotRgb = isDark ? '34, 211, 238' : '59, 130, 246';

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.x += n.vx;
        n.y += n.vy;

        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;

        for (let j = i + 1; j < nodes.length; j++) {
          const m = nodes[j];
          const dist = Math.hypot(n.x - m.x, n.y - m.y);
          if (dist < 140) {
            const alpha = (1 - dist / 140) * (isDark ? 0.16 : 0.12);
            ctx.strokeStyle = `rgba(${lineRgb}, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(m.x, m.y);
            ctx.stroke();
          }
        }

        const mDist = Math.hypot(n.x - mouse.x, n.y - mouse.y);
        if (mDist < 165) {
          const alpha = (1 - mDist / 165) * (isDark ? 0.28 : 0.2);
          ctx.strokeStyle = `rgba(${dotRgb}, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }

        ctx.fillStyle = `rgba(${dotRgb}, ${n.opacity * (isDark ? 0.78 : 0.55)})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerleave', onPointerLeave);
    };
  }, [theme]);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
    >
      {/* Top ambient architectural aurora glow */}
      <div
        className="absolute -top-36 left-1/2 -translate-x-1/2 w-[min(96vw,960px)] h-[420px] rounded-full blur-[130px] opacity-55 dark:opacity-70 transition-opacity duration-500"
        style={{
          background:
            theme === 'dark'
              ? 'radial-gradient(circle, rgba(59,130,246,0.16) 0%, rgba(6,182,212,0.10) 45%, transparent 72%)'
              : 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, rgba(6,182,212,0.08) 45%, transparent 72%)',
        }}
      />

      {/* Mouse-reactive soft grid spotlight */}
      <div
        ref={spotlightRef}
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          background:
            theme === 'dark'
              ? 'radial-gradient(420px circle at var(--mx, 50%) var(--my, 30%), rgba(6,182,212,0.065), transparent 70%)'
              : 'radial-gradient(420px circle at var(--mx, 50%) var(--my, 30%), rgba(59,130,246,0.06), transparent 70%)',
        }}
      />

      {/* Constellation Data Particle Network */}
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  );
};
