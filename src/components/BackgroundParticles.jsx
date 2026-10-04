import React, { useEffect, useRef } from 'react';

/**
 * BackgroundParticles Component
 * Renders an ultra-subtle, elegant starry particle field on a dark canvas.
 * Slow-drifting tiny luminous embers and stardust dots provide cinematic depth
 * without any childish or distracting effects.
 */
export default function BackgroundParticles() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    };

    window.addEventListener('resize', handleResize);

    // Subtle particle count tailored to screen size
    const particleCount = Math.floor((width * height) / 18000);
    let particles = [];

    const initParticles = () => {
      particles = [];
      const count = Math.min(Math.max(particleCount, 40), 100);
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 1.2 + 0.4,
          alpha: Math.random() * 0.45 + 0.1,
          baseAlpha: Math.random() * 0.45 + 0.1,
          twinkleSpeed: Math.random() * 0.015 + 0.005,
          speedY: -(Math.random() * 0.18 + 0.05), // Extremely slow upward drift
          speedX: (Math.random() - 0.5) * 0.08,
          // Color palette: 75% champagne/warm gold, 25% luminous cyan
          isGold: Math.random() > 0.25
        });
      }
    };

    initParticles();

    let time = 0;
    const render = () => {
      time += 1;
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.y += p.speedY;
        p.x += p.speedX;

        // Wrap around smoothly
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        // Gentle breathing opacity
        const currentAlpha = p.baseAlpha + Math.sin(time * p.twinkleSpeed) * 0.18;
        const clampedAlpha = Math.max(0.04, Math.min(0.65, currentAlpha));

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);

        if (p.isGold) {
          ctx.fillStyle = `rgba(226, 192, 141, ${clampedAlpha})`;
        } else {
          ctx.fillStyle = `rgba(180, 230, 235, ${clampedAlpha * 0.8})`;
        }
        ctx.fill();

        // Very faint subtle glow around a few larger particles
        if (p.radius > 1.2 && clampedAlpha > 0.3) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 2.8, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(226, 192, 141, ${clampedAlpha * 0.12})`;
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="particle-canvas" aria-hidden="true" />;
}
