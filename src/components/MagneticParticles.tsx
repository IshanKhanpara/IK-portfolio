import { useEffect, useRef, useCallback } from 'react';

interface Particle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
  size: number;
  baseSize: number;
  alpha: number;
  connections: number[];
  isPurple: boolean;
  pulseOffset: number;
}

export const MagneticParticles = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const animationRef = useRef<number>();
  const timeRef = useRef(0);

  const PARTICLE_COUNT = 140;
  const INFLUENCE_RADIUS = 200;
  const REPULSION_RADIUS = 50;
  const CONNECTION_DISTANCE = 120;
  const ATTRACTION_STRENGTH = 0.06;
  const REPULSION_STRENGTH = 0.15;
  const RETURN_STRENGTH = 0.025;
  const FRICTION = 0.94;

  const initParticles = useCallback((width: number, height: number) => {
    const particles: Particle[] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const baseSize = 1.2 + Math.random() * 1.8;
      particles.push({
        x,
        y,
        originX: x,
        originY: y,
        vx: 0,
        vy: 0,
        size: baseSize,
        baseSize,
        alpha: 0.25 + Math.random() * 0.35,
        connections: [],
        isPurple: Math.random() > 0.55,
        pulseOffset: Math.random() * Math.PI * 2,
      });
    }
    return particles;
  }, []);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const { width, height } = canvas;
    const particles = particlesRef.current;
    const mouse = mouseRef.current;
    timeRef.current += 0.02;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Update and draw particles
    particles.forEach((particle, i) => {
      // Calculate distance to mouse
      const dx = mouse.x - particle.x;
      const dy = mouse.y - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx);
      
      // Repulsion when very close (orbital effect)
      if (distance < REPULSION_RADIUS && distance > 0) {
        const repulsionForce = (REPULSION_RADIUS - distance) / REPULSION_RADIUS;
        particle.vx -= Math.cos(angle) * repulsionForce * REPULSION_STRENGTH;
        particle.vy -= Math.sin(angle) * repulsionForce * REPULSION_STRENGTH;
        // Add slight tangential force for orbital motion
        particle.vx += Math.cos(angle + Math.PI / 2) * repulsionForce * 0.03;
        particle.vy += Math.sin(angle + Math.PI / 2) * repulsionForce * 0.03;
      }
      // Attraction to cursor when in influence range but outside repulsion
      else if (distance < INFLUENCE_RADIUS && distance > REPULSION_RADIUS) {
        const attractionZone = INFLUENCE_RADIUS - REPULSION_RADIUS;
        const normalizedDist = (distance - REPULSION_RADIUS) / attractionZone;
        const force = (1 - normalizedDist) * ATTRACTION_STRENGTH;
        particle.vx += Math.cos(angle) * force;
        particle.vy += Math.sin(angle) * force;
      }

      // Return to origin
      const returnDx = particle.originX - particle.x;
      const returnDy = particle.originY - particle.y;
      particle.vx += returnDx * RETURN_STRENGTH;
      particle.vy += returnDy * RETURN_STRENGTH;

      // Apply friction
      particle.vx *= FRICTION;
      particle.vy *= FRICTION;

      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Calculate influence for visual effects
      const influence = Math.max(0, 1 - distance / INFLUENCE_RADIUS);
      
      // Pulsing effect
      const pulse = Math.sin(timeRef.current * 2 + particle.pulseOffset) * 0.3 + 1;
      particle.size = particle.baseSize * (1 + influence * 0.3) * pulse;
      
      // Draw particle with glow when influenced
      const baseAlpha = particle.alpha;
      const glowAlpha = (baseAlpha + influence * 0.5) * (0.8 + pulse * 0.2);
      
      // Color based on particle type
      const hue = particle.isPurple ? 280 : 186;
      const saturation = particle.isPurple ? 80 : 100;
      
      // Outer glow when influenced
      if (influence > 0.1) {
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size * 5
        );
        gradient.addColorStop(0, `hsla(${hue}, ${saturation}%, 60%, ${influence * 0.35})`);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Core particle
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${hue}, ${saturation}%, 70%, ${glowAlpha})`;
      ctx.fill();

      // Draw connections to nearby particles when influenced
      if (influence > 0.05) {
        particles.slice(i + 1).forEach((other) => {
          const cdx = other.x - particle.x;
          const cdy = other.y - particle.y;
          const cdist = Math.sqrt(cdx * cdx + cdy * cdy);
          
          if (cdist < CONNECTION_DISTANCE) {
            const otherDist = Math.sqrt(
              (mouse.x - other.x) ** 2 + (mouse.y - other.y) ** 2
            );
            const otherInfluence = Math.max(0, 1 - otherDist / INFLUENCE_RADIUS);
            
            // Only draw if both particles are influenced
            if (otherInfluence > 0.05) {
              const lineAlpha = Math.min(influence, otherInfluence) * 
                (1 - cdist / CONNECTION_DISTANCE) * 0.4;
              
              // Blend colors for connections between different particle types
              const connectionHue = particle.isPurple && other.isPurple ? 280 : 
                                   !particle.isPurple && !other.isPurple ? 186 : 233;
              
              ctx.beginPath();
              ctx.moveTo(particle.x, particle.y);
              ctx.lineTo(other.x, other.y);
              ctx.strokeStyle = `hsla(${connectionHue}, 90%, 65%, ${lineAlpha})`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        });
      }
    });

    animationRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particlesRef.current = initParticles(canvas.width, canvas.height);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [initParticles, animate]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[1]"
      style={{ background: 'transparent' }}
    />
  );
};
