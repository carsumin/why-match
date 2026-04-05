'use client';

import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  rotation: number;
  rotationSpeed: number;
  shape: 'rect' | 'circle' | 'star';
  opacity: number;
  gravity: number;
  drag: number;
}

const COLORS = [
  '#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF',
  '#FF922B', '#CC5DE8', '#F06595', '#74C0FC',
  '#A9E34B', '#FFA94D',
];

function createParticle(cx: number, cy: number): Particle {
  const angle = Math.random() * Math.PI * 2;
  const speed = 6 + Math.random() * 10;
  return {
    x: cx,
    y: cy,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed - 6,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    size: 6 + Math.random() * 8,
    rotation: Math.random() * Math.PI * 2,
    rotationSpeed: (Math.random() - 0.5) * 0.3,
    shape: (['rect', 'circle', 'star'] as const)[Math.floor(Math.random() * 3)],
    opacity: 1,
    gravity: 0.25 + Math.random() * 0.15,
    drag: 0.97,
  };
}

function drawStar(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  const spikes = 5;
  const inner = r * 0.45;
  let angle = -Math.PI / 2;
  ctx.beginPath();
  for (let i = 0; i < spikes * 2; i++) {
    const radius = i % 2 === 0 ? r : inner;
    ctx.lineTo(x + Math.cos(angle) * radius, y + Math.sin(angle) * radius);
    angle += Math.PI / spikes;
  }
  ctx.closePath();
}

interface Props {
  /** 효과를 발동할 트리거 — true로 바뀌면 한 번 실행 */
  active: boolean;
  onDone?: () => void;
}

export default function Confetti({ active, onDone }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const doneRef = useRef(false);

  useEffect(() => {
    if (!active) return;
    doneRef.current = false;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = window.innerWidth;
    const H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;

    // 3개 발사 지점에서 burst
    const bursts: Particle[] = [];
    const origins = [
      { x: W * 0.25, y: H * 0.5 },
      { x: W * 0.5,  y: H * 0.4 },
      { x: W * 0.75, y: H * 0.5 },
    ];
    for (const o of origins) {
      for (let i = 0; i < 60; i++) {
        bursts.push(createParticle(o.x, o.y));
      }
    }

    // 추가 폭죽 — 약간 지연
    let extra: Particle[] = [];
    const extraTimer = window.setTimeout(() => {
      extra = [
        ...Array.from({ length: 50 }, () => createParticle(W * 0.15, H * 0.55)),
        ...Array.from({ length: 50 }, () => createParticle(W * 0.85, H * 0.55)),
      ];
    }, 350);

    let start = performance.now();

    function draw(now: number) {
      if (!ctx || !canvas) return;
      const elapsed = now - start;

      ctx.clearRect(0, 0, W, H);

      const all = [...bursts, ...extra];
      let alive = 0;

      for (const p of all) {
        if (p.opacity <= 0) continue;
        alive++;

        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.vx *= p.drag;
        p.vy *= p.drag;
        p.rotation += p.rotationSpeed;
        if (elapsed > 800) p.opacity -= 0.012;

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.fillStyle = p.color;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        if (p.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.shape === 'star') {
          drawStar(ctx, 0, 0, p.size / 2);
          ctx.fill();
        } else {
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        }

        ctx.restore();
      }

      if (alive > 0 && elapsed < 4000) {
        rafRef.current = requestAnimationFrame(draw);
      } else if (!doneRef.current) {
        doneRef.current = true;
        ctx.clearRect(0, 0, W, H);
        onDone?.();
      }
    }

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      clearTimeout(extraTimer);
      cancelAnimationFrame(rafRef.current);
    };
  }, [active, onDone]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 9999 }}
    />
  );
}
