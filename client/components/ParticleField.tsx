"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  radius: number;
  alpha: number;
  color: string;
}

const COLORS = ["rgba(124,58,237,", "rgba(6,182,212,", "rgba(167,139,250,"];

export function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse     = useRef({ x: -9999, y: -9999 });
  const animRef   = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    let W = 0, H = 0;
    const particles: Particle[] = [];

    const resize = () => {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };

    const spawnParticle = (): Particle => ({
      x:      Math.random() * W,
      y:      Math.random() * H,
      vx:     (Math.random() - 0.5) * 0.4,
      vy:     (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 1.5 + 0.5,
      alpha:  Math.random() * 0.5 + 0.1,
      color:  COLORS[Math.floor(Math.random() * COLORS.length)],
    });

    resize();
    for (let i = 0; i < 120; i++) particles.push(spawnParticle());

    const onMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d  = Math.sqrt(dx * dx + dy * dy);
          if (d < 120) {
            const opacity = (1 - d / 120) * 0.2;
            ctx.strokeStyle = `rgba(124,58,237,${opacity})`;
            ctx.lineWidth   = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw particles & react to mouse
      particles.forEach((p) => {
        const dx = p.x - mouse.current.x;
        const dy = p.y - mouse.current.y;
        const d  = Math.sqrt(dx * dx + dy * dy);

        if (d < 100) {
          const force = (100 - d) / 100;
          p.vx += (dx / d) * force * 0.3;
          p.vy += (dy / d) * force * 0.3;
        }

        p.vx *= 0.98;
        p.vy *= 0.98;
        p.x  += p.vx;
        p.y  += p.vy;

        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.alpha})`;
        ctx.fill();
      });

      animRef.current = requestAnimationFrame(draw);
    };

    window.addEventListener("resize", resize);
    canvas.addEventListener("mousemove", onMouse);
    draw();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", onMouse);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-auto"
      style={{ opacity: 0.8 }}
    />
  );
}
