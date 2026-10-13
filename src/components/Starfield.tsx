import { useEffect, useRef } from 'react';

interface Star { x: number; y: number; r: number; base: number; speed: number; phase: number; tint: string }

const TINTS = ['255,255,255', '223,226,234', '200,190,255', '166,140,240'];

/**
 * Fixed full-screen night sky: purple nebula gradients (CSS) under a canvas
 * of slowly twinkling stars. Static when the viewer prefers reduced motion.
 */
export default function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let stars: Star[] = [];
    let raf = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round((w * h) / 2600);
      stars = Array.from({ length: count }, () => {
        const big = Math.random() < 0.06;
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          r: big ? 1.1 + Math.random() * 0.9 : 0.3 + Math.random() * 0.8,
          base: 0.35 + Math.random() * 0.6,
          speed: 0.4 + Math.random() * 1.4,
          phase: Math.random() * Math.PI * 2,
          tint: TINTS[Math.floor(Math.random() * TINTS.length)],
        };
      });
      draw(0);
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const s of stars) {
        const a = reduceMotion ? s.base : s.base * (0.6 + 0.4 * Math.sin(t / 1000 * s.speed + s.phase));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${s.tint},${a})`;
        if (s.r > 1.1) {
          ctx.shadowColor = `rgba(${s.tint},0.9)`;
          ctx.shadowBlur = 6;
        } else {
          ctx.shadowBlur = 0;
        }
        ctx.fill();
      }
    };

    const loop = (t: number) => {
      draw(t);
      raf = requestAnimationFrame(loop);
    };

    resize();
    window.addEventListener('resize', resize);
    if (!reduceMotion) raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-void">
      <div
        className="absolute inset-0"
        style={{
          background: [
            'radial-gradient(ellipse 60% 45% at 18% 12%, rgba(90, 51, 153, 0.35), transparent 70%)',
            'radial-gradient(ellipse 50% 40% at 85% 30%, rgba(59, 31, 110, 0.4), transparent 70%)',
            'radial-gradient(ellipse 70% 50% at 50% 100%, rgba(42, 22, 80, 0.55), transparent 70%)',
          ].join(','),
        }}
      />
      <canvas ref={canvasRef} className="absolute inset-0" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-void/60" />
    </div>
  );
}
