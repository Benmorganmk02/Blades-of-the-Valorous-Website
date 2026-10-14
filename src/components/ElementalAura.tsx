import { useEffect, useRef } from 'react';

/**
 * Animated magic behind the home-page emblem: red flames licking up the left,
 * blue frost drifting off the right, purple lightning crackling over the top.
 * Everything starts just inside the shield's outline (the canvas sits beneath
 * the emblem), so it reads as pouring out from behind the shield.
 * Pauses when scrolled out of view; draws a single still frame for visitors
 * who prefer reduced motion.
 */

type RGB = [number, number, number];

interface Spark { x: number; y: number; vx: number; vy: number; life: number; max: number; size: number; seed: number }
interface Tongue { ang: number; phase: number; speed: number; len: number; width: number }
interface Flake { x: number; y: number; vx: number; vy: number; rot: number; vr: number; life: number; max: number; size: number }
interface Mist { x: number; y: number; vx: number; vy: number; life: number; max: number; size: number }
interface Bolt { paths: [number, number][][]; life: number; max: number }

const rand = (a: number, b: number) => a + Math.random() * (b - a);

/** Shield outline approximated as an ellipse, in fractions of the canvas (the logo is framed on the shield's centre). */
const RIM_X = 0.13;
const RIM_Y = 0.19;

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

/** One flame tongue: a ribbon that tapers to a point and whips side to side towards the tip, hot at the base and fading out. */
function drawTongue(
  ctx: CanvasRenderingContext2D, bx: number, by: number, dx: number, dy: number,
  len: number, width: number, sway: number, swayPhase: number, colors: [string, string, string],
) {
  const px = -dy, py = dx; // perpendicular to the rise direction
  const N = 14;
  const left: [number, number][] = [];
  const right: [number, number][] = [];
  for (let i = 0; i <= N; i++) {
    const s = i / N;
    const off = Math.sin(swayPhase - s * 3.2) * sway * s * s;
    const cx = bx + dx * len * s + px * off, cy = by + dy * len * s + py * off;
    const w = width * Math.pow(1 - s, 0.9) * (0.75 + 0.25 * Math.sin(s * Math.PI));
    left.push([cx + px * w, cy + py * w]);
    right.push([cx - px * w, cy - py * w]);
  }
  const g = ctx.createLinearGradient(bx, by, bx + dx * len, by + dy * len);
  g.addColorStop(0, colors[0]);
  g.addColorStop(0.45, colors[1]);
  g.addColorStop(1, colors[2]);
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.moveTo(left[0][0], left[0][1]);
  for (let i = 1; i < N; i++) {
    ctx.quadraticCurveTo(left[i][0], left[i][1], (left[i][0] + left[i + 1][0]) / 2, (left[i][1] + left[i + 1][1]) / 2);
  }
  ctx.lineTo(left[N][0], left[N][1]);
  for (let i = N - 1; i > 0; i--) {
    ctx.quadraticCurveTo(right[i][0], right[i][1], (right[i][0] + right[i - 1][0]) / 2, (right[i][1] + right[i - 1][1]) / 2);
  }
  ctx.lineTo(right[0][0], right[0][1]);
  ctx.closePath();
  ctx.fill();
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
      frost: makeGlow([110, 190, 255]),
      purple: makeGlow([150, 100, 255]),
    };

    let S = 0; // canvas size in CSS px
    let k = 1; // scale relative to a 400px design
    const sparks: Spark[] = [];
    const flakes: Flake[] = [];
    const mists: Mist[] = [];
    const bolts: Bolt[] = [];
    const tongues: Tongue[] = Array.from({ length: 12 }, (_, i) => ({
      ang: 120 + (i / 11) * 100 + rand(-4, 4), // lower-left, round the left edge, to upper-left
      phase: rand(0, 6.28),
      speed: rand(0.07, 0.12),
      len: rand(0.17, 0.27),
      width: rand(0.032, 0.048),
    }));
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

    /** Point on the shield's outline at an angle; f < 1 is just inside it (hidden behind the emblem). */
    const rim = (angDeg: number, f: number): [number, number] => {
      const a = (angDeg * Math.PI) / 180;
      return [S / 2 + Math.cos(a) * RIM_X * S * f, S / 2 + Math.sin(a) * RIM_Y * S * f];
    };

    // ── Spawners ────────────────────────────────────────────────────────────
    const spawnSpark = () => {
      const [x, y] = rim(rand(110, 225), rand(1.1, 1.6)); // thrown off the flame tips
      const max = rand(40, 80);
      sparks.push({ x, y, vx: rand(-0.5, 0.1) * k, vy: rand(-1.6, -0.7) * k, life: 0, max, size: rand(3, 7) * k, seed: rand(0, 6.28) });
    };
    const spawnFlake = () => {
      const [x, y] = rim(rand(-50, 65), rand(0.85, 1.05));
      const max = rand(120, 220);
      flakes.push({ x, y, vx: rand(0.15, 0.4) * k, vy: rand(-0.15, 0.35) * k, rot: rand(0, 6.28), vr: rand(-0.02, 0.02), life: 0, max, size: rand(4, 9) * k });
    };
    const spawnMist = () => {
      const [x, y] = rim(rand(-60, 60), rand(0.9, 1.15));
      const max = rand(140, 240);
      mists.push({ x, y, vx: rand(0.1, 0.3) * k, vy: rand(-0.2, 0.2) * k, life: 0, max, size: rand(40, 70) * k });
    };
    const spawnBolt = () => {
      const ang = rand(-150, -30);
      const start = rim(ang, 0.85); // from behind the top of the shield
      const end = rim(ang + rand(-25, 25), rand(1.8, 2.2));
      const main = boltPath(start[0], start[1], end[0], end[1], 26 * k, 6);
      const paths = [main];
      const branches = Math.floor(rand(1, 4));
      for (let i = 0; i < branches; i++) {
        const from = main[Math.floor(rand(main.length * 0.3, main.length * 0.8))];
        const a = Math.atan2(from[1] - S / 2, from[0] - S / 2) + rand(-0.8, 0.8);
        const len = rand(0.06, 0.12) * S;
        paths.push(boltPath(from[0], from[1], from[0] + Math.cos(a) * len, from[1] + Math.sin(a) * len, 12 * k, 4));
      }
      const max = rand(10, 16);
      bolts.push({ paths, life: 0, max });
      flash = 1;
    };

    // ── Update & draw ───────────────────────────────────────────────────────
    const step = (f: number) => {
      t += f;
      if (sparks.length < 45 && Math.random() < 0.8 * f) spawnSpark();
      if (flakes.length < 60 && Math.random() < 0.6 * f) spawnFlake();
      if (mists.length < 14 && Math.random() < 0.1 * f) spawnMist();
      nextBolt -= f;
      if (nextBolt <= 0) {
        spawnBolt();
        if (Math.random() < 0.3) setTimeout(spawnBolt, 90); // occasional double strike
        nextBolt = rand(25, 85);
      }

      for (const e of sparks) {
        e.life += f;
        e.x += (e.vx + Math.sin(t * 0.08 + e.seed) * 0.25 * k) * f;
        e.y += e.vy * f;
      }
      for (const p of flakes) { p.life += f; p.x += p.vx * f; p.y += p.vy * f; p.rot += p.vr * f; }
      for (const m of mists) { m.life += f; m.x += m.vx * f; m.y += m.vy * f; }
      for (const b of bolts) b.life += f;
      flash = Math.max(0, flash - 0.12 * f);

      remove(sparks); remove(flakes); remove(mists); remove(bolts);
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

      // Ambient elemental glows, hugging the shield
      const [fx, fy] = rim(165, 1.1);
      const [ix, iy] = rim(10, 1.1);
      const [lx, ly] = rim(-90, 1);
      stamp(glow.fire, fx, fy, S * 0.55, 0.32 + 0.1 * pulse);
      stamp(glow.frost, ix, iy, S * 0.55, 0.3 + 0.1 * (1 - pulse));
      stamp(glow.purple, lx, ly, S * 0.55, 0.28 + 0.4 * flash);

      // Frost mist and crystals
      for (const m of mists) {
        const a = Math.sin((m.life / m.max) * Math.PI) * 0.3;
        stamp(glow.frost, m.x, m.y, m.size, a);
      }
      ctx.lineCap = 'round';
      for (const p of flakes) {
        const a = Math.sin((p.life / p.max) * Math.PI);
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

      // Fire: flame tongues licking up from behind the left edge, layered red → orange → yellow core
      for (const tg of tongues) {
        const [bx, by] = rim(tg.ang, 0.9);
        const a = (tg.ang * Math.PI) / 180;
        // rise upward, leaning well out from the shield so the tongues clear its edge
        let dx = Math.cos(a) * 0.95, dy = Math.sin(a) * 0.3 - 1;
        const dl = Math.hypot(dx, dy);
        dx /= dl; dy /= dl;
        const flick = 0.62 + 0.28 * Math.sin(t * tg.speed + tg.phase) + 0.14 * Math.sin(t * tg.speed * 2.7 + tg.phase * 1.9);
        const len = tg.len * S * flick, w = tg.width * S;
        const sp = t * tg.speed * 1.6 + tg.phase;
        ctx.globalAlpha = 0.55;
        drawTongue(ctx, bx, by, dx, dy, len * 1.15, w * 1.35, 9 * k, sp, ['rgba(255,60,20,0.9)', 'rgba(200,25,10,0.5)', 'rgba(120,0,0,0)']);
        ctx.globalAlpha = 0.7;
        drawTongue(ctx, bx, by, dx, dy, len * 0.85, w, 7 * k, sp + 0.4, ['rgba(255,150,40,0.95)', 'rgba(255,80,20,0.55)', 'rgba(255,40,0,0)']);
        ctx.globalAlpha = 0.8;
        drawTongue(ctx, bx, by, dx, dy, len * 0.5, w * 0.55, 4 * k, sp + 0.8, ['rgba(255,240,180,1)', 'rgba(255,200,80,0.6)', 'rgba(255,140,40,0)']);
      }
      for (const e of sparks) {
        const p = e.life / e.max;
        const fade = p < 0.15 ? p / 0.15 : 1 - (p - 0.15) / 0.85;
        stamp(glow.fireCore, e.x, e.y, e.size * (1 - p * 0.5), fade * (1 - p));
        stamp(glow.fire, e.x, e.y, e.size * 3, fade * 0.45);
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
