import { useEffect, useRef } from 'react';

/**
 * Animated magic behind the home-page emblem: red fire rising on the left,
 * blue frost drifting on the right, purple lightning crackling across the top.
 * Pauses when scrolled out of view; draws a single still frame for visitors
 * who prefer reduced motion.
 */

type RGB = [number, number, number];

interface Ember { x: number; y: number; vx: number; vy: number; life: number; max: number; size: number; seed: number }
interface Flake { x: number; y: number; vx: number; vy: number; rot: number; vr: number; life: number; max: number; size: number }
interface Mist { x: number; y: number; vx: number; vy: number; life: number; max: number; size: number }
interface Bolt { paths: [number, number][][]; life: number; max: number }

const rand = (a: number, b: number) => a + Math.random() * (b - a);

/** Soft radial glow pre-rendered once, then stamped with drawImage (much cheaper than gradients per particle). */
function makeGlow(color: RGB, size = 64): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d')!;
  const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  const [r, gr, b] = color;
  grad.addColorStop(0, `rgba(${r},${gr},${b},1)`);
  grad.addColorStop(0.35, `rgba(${r},${gr},${b},0.45)`);
  grad.addColorStop(1, `rgba(${r},${gr},${b},0)`);
  g.fillStyle = grad;
  g.fillRect(0, 0, size, size);
  return c;
}

/** Jagged lightning path between two points via midpoint displacement. */
function boltPath(x1: number, y1: number, x2: number, y2: number, spread: number, depth: number): [number, number][] {
  let pts: [number, number][] = [[x1, y1], [x2, y2]];
  let s = spread;
  for (let d = 0; d < depth; d++) {
    const next: [number, number][] = [pts[0]];
    for (let i = 0; i < pts.length - 1; i++) {
      const [ax, ay] = pts[i];
      const [bx, by] = pts[i + 1];
      const mx = (ax + bx) / 2, my = (ay + by) / 2;
      const len = Math.hypot(bx - ax, by - ay) || 1;
      const off = rand(-s, s);
      next.push([mx + (-(by - ay) / len) * off, my + ((bx - ax) / len) * off], pts[i + 1]);
    }
    pts = next;
    s /= 2;
  }
  return pts;
}

export default function ElementalAura({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const glow = {
      fireCore: makeGlow([255, 200, 90]),
      fire: makeGlow([255, 70, 30]),
      ember: makeGlow([200, 20, 10]),
      frost: makeGlow([110, 190, 255]),
      purple: makeGlow([150, 100, 255]),
    };

    let S = 0; // canvas size in CSS px
    let k = 1; // scale relative to a 400px design
    const embers: Ember[] = [];
    const flakes: Flake[] = [];
    const mists: Mist[] = [];
    const bolts: Bolt[] = [];
    let nextBolt = 40;
    let flash = 0;
    let t = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      S = canvas.clientWidth;
      k = S / 400;
      canvas.width = S * dpr;
      canvas.height = S * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const polar = (angDeg: number, r: number): [number, number] => {
      const a = (angDeg * Math.PI) / 180;
      return [S / 2 + Math.cos(a) * r, S / 2 + Math.sin(a) * r];
    };

    // ── Spawners ────────────────────────────────────────────────────────────
    const spawnEmber = () => {
      const [x, y] = polar(rand(95, 215), rand(0.27, 0.4) * S);
      const max = rand(45, 90);
      embers.push({ x, y, vx: rand(-0.35, 0.15) * k, vy: rand(-1.7, -0.8) * k, life: 0, max, size: rand(14, 30) * k, seed: rand(0, 6.28) });
    };
    const spawnFlake = () => {
      const [x, y] = polar(rand(-80, 80), rand(0.28, 0.45) * S);
      const max = rand(120, 240);
      flakes.push({ x, y, vx: rand(0.05, 0.3) * k, vy: rand(-0.15, 0.35) * k, rot: rand(0, 6.28), vr: rand(-0.02, 0.02), life: 0, max, size: rand(4, 9) * k });
    };
    const spawnMist = () => {
      const [x, y] = polar(rand(-60, 60), rand(0.3, 0.42) * S);
      const max = rand(140, 260);
      mists.push({ x, y, vx: rand(0.05, 0.25) * k, vy: rand(-0.2, 0.2) * k, life: 0, max, size: rand(50, 90) * k });
    };
    const spawnBolt = () => {
      const start = polar(rand(-155, -25), 0.24 * S);
      const end = polar(rand(-175, -5), rand(0.42, 0.5) * S);
      const main = boltPath(start[0], start[1], end[0], end[1], 34 * k, 6);
      const paths = [main];
      const branches = Math.floor(rand(1, 4));
      for (let i = 0; i < branches; i++) {
        const from = main[Math.floor(rand(main.length * 0.3, main.length * 0.8))];
        const ang = Math.atan2(from[1] - S / 2, from[0] - S / 2) + rand(-0.8, 0.8);
        const len = rand(0.08, 0.16) * S;
        paths.push(boltPath(from[0], from[1], from[0] + Math.cos(ang) * len, from[1] + Math.sin(ang) * len, 14 * k, 4));
      }
      const max = rand(10, 16);
      bolts.push({ paths, life: 0, max });
      flash = 1;
    };

    // ── Update & draw ───────────────────────────────────────────────────────
    const step = (f: number) => {
      t += f;
      if (embers.length < 110) for (let i = 0; i < 3; i++) spawnEmber();
      if (flakes.length < 60 && Math.random() < 0.6 * f) spawnFlake();
      if (mists.length < 14 && Math.random() < 0.1 * f) spawnMist();
      nextBolt -= f;
      if (nextBolt <= 0) {
        spawnBolt();
        if (Math.random() < 0.3) setTimeout(spawnBolt, 90); // occasional double strike
        nextBolt = rand(25, 85);
      }

      for (const e of embers) {
        e.life += f;
        e.x += (e.vx + Math.sin(t * 0.08 + e.seed) * 0.25 * k) * f;
        e.y += e.vy * f;
      }
      for (const p of flakes) { p.life += f; p.x += p.vx * f; p.y += p.vy * f; p.rot += p.vr * f; }
      for (const m of mists) { m.life += f; m.x += m.vx * f; m.y += m.vy * f; }
      for (const b of bolts) b.life += f;
      flash = Math.max(0, flash - 0.12 * f);

      remove(embers); remove(flakes); remove(mists); remove(bolts);
    };

    const remove = (arr: { life: number; max: number }[]) => {
      for (let i = arr.length - 1; i >= 0; i--) if (arr[i].life >= arr[i].max) arr.splice(i, 1);
    };

    const stamp = (img: HTMLCanvasElement, x: number, y: number, size: number, alpha: number) => {
      if (alpha <= 0) return;
      ctx.globalAlpha = Math.min(1, alpha);
      ctx.drawImage(img, x - size / 2, y - size / 2, size, size);
    };

    const draw = () => {
      ctx.clearRect(0, 0, S, S);
      ctx.globalCompositeOperation = 'lighter';
      const pulse = 0.5 + 0.5 * Math.sin(t * 0.03);

      // Ambient elemental glows
      const [fx, fy] = polar(150, 0.3 * S);
      const [ix, iy] = polar(15, 0.32 * S);
      const [lx, ly] = polar(-90, 0.3 * S);
      stamp(glow.fire, fx, fy, S * 0.7, 0.3 + 0.1 * pulse);
      stamp(glow.frost, ix, iy, S * 0.7, 0.28 + 0.1 * (1 - pulse));
      stamp(glow.purple, lx, ly, S * 0.75, 0.28 + 0.4 * flash);

      // Frost mist and crystals
      for (const m of mists) {
        const a = Math.sin((m.life / m.max) * Math.PI) * 0.3;
        stamp(glow.frost, m.x, m.y, m.size, a);
      }
      ctx.lineCap = 'round';
      for (const p of flakes) {
        const a = Math.sin((p.life / p.max) * Math.PI);
        ctx.globalAlpha = a * 0.9;
        stamp(glow.frost, p.x, p.y, p.size * 4, a * 0.35);
        ctx.globalAlpha = a * 0.9;
        ctx.strokeStyle = 'rgb(205,235,255)';
        ctx.lineWidth = Math.max(0.6, p.size * 0.16);
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const ang = p.rot + (i * Math.PI) / 3;
          const cx = Math.cos(ang), sy = Math.sin(ang);
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + cx * p.size, p.y + sy * p.size);
          // small barbs make it read as an ice crystal
          const bx = p.x + cx * p.size * 0.55, by = p.y + sy * p.size * 0.55;
          const b1 = ang + 0.7, b2 = ang - 0.7;
          ctx.moveTo(bx, by); ctx.lineTo(bx + Math.cos(b1) * p.size * 0.3, by + Math.sin(b1) * p.size * 0.3);
          ctx.moveTo(bx, by); ctx.lineTo(bx + Math.cos(b2) * p.size * 0.3, by + Math.sin(b2) * p.size * 0.3);
        }
        ctx.stroke();
      }

      // Fire: hot yellow cores cooling to red, then dark embers
      for (const e of embers) {
        const p = e.life / e.max;
        const fade = p < 0.15 ? p / 0.15 : 1 - (p - 0.15) / 0.85;
        const size = e.size * (1 - p * 0.6);
        stamp(glow.fireCore, e.x, e.y, size * 0.9, fade * (1 - p) * 0.9);
        stamp(glow.fire, e.x, e.y, size * 1.6, fade * 0.55);
        stamp(glow.ember, e.x, e.y, size * 2.4, fade * p * 0.5);
      }

      // Lightning
      for (const b of bolts) {
        const p = b.life / b.max;
        const a = (1 - p) * (Math.random() < 0.25 ? 0.4 : 1); // flicker
        b.paths.forEach((path, i) => {
          const w = i === 0 ? 1 : 0.55;
          ctx.globalAlpha = a;
          ctx.shadowColor = 'rgba(160,110,255,1)';
          ctx.shadowBlur = 18 * k;
          ctx.strokeStyle = 'rgba(150,100,255,0.9)';
          ctx.lineWidth = 4.5 * k * w;
          ctx.beginPath();
          path.forEach(([x, y], j) => (j ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
          ctx.stroke();
          ctx.shadowBlur = 0;
          ctx.strokeStyle = 'rgba(245,235,255,1)';
          ctx.lineWidth = 1.4 * k * w;
          ctx.stroke();
        });
      }

      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
    };

    resize();
    window.addEventListener('resize', resize);

    // Warm up so the effect is already in full swing on first paint.
    for (let i = 0; i < 150; i++) step(1);

    if (reduceMotion) {
      spawnBolt();
      draw();
      return () => window.removeEventListener('resize', resize);
    }

    let raf = 0;
    let last = performance.now();
    let visible = true;
    const loop = (now: number) => {
      const f = Math.min((now - last) / 16.67, 3);
      last = now;
      step(f);
      draw();
      raf = requestAnimationFrame(loop);
    };
    const io = new IntersectionObserver(([entry]) => {
      const nowVisible = entry.isIntersecting;
      if (nowVisible && !visible) { last = performance.now(); raf = requestAnimationFrame(loop); }
      if (!nowVisible) cancelAnimationFrame(raf);
      visible = nowVisible;
    });
    io.observe(canvas);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className={className}
      style={{
        WebkitMaskImage: 'radial-gradient(circle closest-side, #000 72%, transparent 100%)',
        maskImage: 'radial-gradient(circle closest-side, #000 72%, transparent 100%)',
      }}
    />
  );
}
