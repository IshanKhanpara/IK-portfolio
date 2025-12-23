import { useEffect, useRef, useCallback, useState } from 'react';

type CursorState = 'default' | 'hover' | 'text' | 'hidden' | 'loading';

interface Vector2 {
  x: number;
  y: number;
}

interface CursorStyle {
  dotSize: number;
  ringSize: number;
  glowOpacity: number;
  glowSize: number;
}

interface RippleEffect {
  id: number;
  x: number;
  y: number;
  startTime: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  hue: number;
}

interface CursorColor {
  hue: number;
  saturation: number;
  lightness: number;
}

// Apple-style cursor sizes - clean and minimal
const CURSOR_STYLES: Record<CursorState, CursorStyle> = {
  default: { dotSize: 8, ringSize: 32, glowOpacity: 0.15, glowSize: 6 },
  hover: { dotSize: 12, ringSize: 48, glowOpacity: 0.2, glowSize: 10 },
  text: { dotSize: 2, ringSize: 20, glowOpacity: 0.1, glowSize: 3 },
  hidden: { dotSize: 0, ringSize: 0, glowOpacity: 0, glowSize: 0 },
  loading: { dotSize: 8, ringSize: 40, glowOpacity: 0.2, glowSize: 8 },
};

const RIPPLE_DURATION = 500;
const PARTICLE_COUNT = 6;

// Default primary color (neural cyan)
const DEFAULT_COLOR: CursorColor = { hue: 190, saturation: 85, lightness: 55 };

export const CustomCursor = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const spinnerRef = useRef<HTMLDivElement>(null);
  const particleCanvasRef = useRef<HTMLCanvasElement>(null);
  
  const [ripples, setRipples] = useState<RippleEffect[]>([]);
  
  // Position tracking - Apple-style responsive
  const mousePos = useRef<Vector2>({ x: -100, y: -100 });
  const dotPos = useRef<Vector2>({ x: -100, y: -100 });
  const ringPos = useRef<Vector2>({ x: -100, y: -100 });
  
  // Particles
  const particles = useRef<Particle[]>([]);
  const particleId = useRef(0);
  
  // State tracking
  const currentState = useRef<CursorState>('default');
  const targetStyle = useRef<CursorStyle>({ ...CURSOR_STYLES.default });
  const currentStyle = useRef<CursorStyle>({ ...CURSOR_STYLES.default });
  
  // Color tracking
  const targetColor = useRef<CursorColor>({ ...DEFAULT_COLOR });
  const currentColor = useRef<CursorColor>({ ...DEFAULT_COLOR });
  
  // Press state
  const isPressed = useRef(false);
  const pressScale = useRef(1);
  
  // Loading rotation
  const loadingRotation = useRef(0);
  
  const visible = useRef(false);
  const animationRef = useRef<number>();
  const lastTime = useRef(performance.now());
  const rippleId = useRef(0);

  // Apple-style responsive lerp - minimal smoothing for polish only
  const responsiveLerp = (current: number, target: number, speed: number): number => {
    const diff = target - current;
    // Fast response - stops almost immediately
    if (Math.abs(diff) < 0.5) return target;
    return current + diff * speed;
  };

  // Fast style transition
  const fastLerp = (start: number, end: number, factor: number): number => {
    const diff = end - start;
    if (Math.abs(diff) < 0.01) return end;
    return start + diff * factor;
  };

  // Create particle burst
  const createParticleBurst = useCallback((x: number, y: number, hue: number) => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const angle = (Math.PI * 2 * i) / PARTICLE_COUNT + Math.random() * 0.3;
      const speed = 2 + Math.random() * 2;
      newParticles.push({
        id: particleId.current++,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        maxLife: 1,
        size: 2 + Math.random() * 1.5,
        hue,
      });
    }
    particles.current = [...particles.current, ...newParticles];
  }, []);

  // Create ripple effect
  const createRipple = useCallback((x: number, y: number) => {
    const id = rippleId.current++;
    setRipples(prev => [...prev, { id, x, y, startTime: performance.now() }]);
    
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== id));
    }, RIPPLE_DURATION);
  }, []);

  // Get background color at position
  const getBackgroundColor = useCallback((x: number, y: number): CursorColor => {
    const element = document.elementFromPoint(x, y);
    if (!element) return DEFAULT_COLOR;

    const computedStyle = window.getComputedStyle(element);
    const bgColor = computedStyle.backgroundColor;
    
    const match = bgColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (!match) return DEFAULT_COLOR;
    
    const r = parseInt(match[1]) / 255;
    const g = parseInt(match[2]) / 255;
    const b = parseInt(match[3]) / 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const l = (max + min) / 2;
    
    let h = 0;
    
    if (max !== min) {
      const d = max - min;
      
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }
    
    const bgLightness = l * 100;
    
    if (bgLightness < 20) {
      return { hue: 190, saturation: 75, lightness: 55 };
    } else if (bgLightness < 40) {
      return { hue: 210, saturation: 70, lightness: 58 };
    } else if (bgLightness > 70) {
      return { hue: 190, saturation: 80, lightness: 35 };
    } else {
      const shiftedHue = (h * 360 + 180) % 360;
      return { hue: shiftedHue, saturation: 65, lightness: 50 };
    }
  }, []);

  const animate = useCallback(() => {
    const now = performance.now();
    const dt = Math.min((now - lastTime.current) / 1000, 0.033); // Cap at ~30fps minimum
    lastTime.current = now;

    // Apple-style responsive cursor - high speed, minimal lag
    // Dot follows mouse very closely (0.35 = fast response)
    dotPos.current.x = responsiveLerp(dotPos.current.x, mousePos.current.x, 0.35);
    dotPos.current.y = responsiveLerp(dotPos.current.y, mousePos.current.y, 0.35);

    // Ring follows dot with slight delay (0.25 = still responsive but slightly trailing)
    ringPos.current.x = responsiveLerp(ringPos.current.x, dotPos.current.x, 0.25);
    ringPos.current.y = responsiveLerp(ringPos.current.y, dotPos.current.y, 0.25);

    // Fast style transitions - instant but eased
    const styleSpeed = 0.2;
    currentStyle.current.dotSize = fastLerp(currentStyle.current.dotSize, targetStyle.current.dotSize, styleSpeed);
    currentStyle.current.ringSize = fastLerp(currentStyle.current.ringSize, targetStyle.current.ringSize, styleSpeed);
    currentStyle.current.glowOpacity = fastLerp(currentStyle.current.glowOpacity, targetStyle.current.glowOpacity, styleSpeed);
    currentStyle.current.glowSize = fastLerp(currentStyle.current.glowSize, targetStyle.current.glowSize, styleSpeed);

    // Fast color transitions
    const colorSpeed = 0.15;
    currentColor.current.hue = fastLerp(currentColor.current.hue, targetColor.current.hue, colorSpeed);
    currentColor.current.saturation = fastLerp(currentColor.current.saturation, targetColor.current.saturation, colorSpeed);
    currentColor.current.lightness = fastLerp(currentColor.current.lightness, targetColor.current.lightness, colorSpeed);

    // Instant press scale - Apple-style snappy
    const targetPressScale = isPressed.current ? 0.85 : 1;
    pressScale.current = fastLerp(pressScale.current, targetPressScale, 0.3);

    // Loading rotation
    if (currentState.current === 'loading') {
      loadingRotation.current += dt * 270;
    }

    // Update particles
    particles.current = particles.current.filter(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.94;
      p.vy *= 0.94;
      p.vy += 0.03;
      p.life -= dt * 2;
      return p.life > 0;
    });

    // Draw particles on canvas
    const canvas = particleCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.current.forEach(p => {
          const alpha = p.life * 0.5;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * (0.5 + p.life * 0.5), 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${p.hue}, 75%, 55%, ${alpha})`;
          ctx.fill();
        });
      }
    }

    // Get color strings
    const colorStr = `hsl(${currentColor.current.hue}, ${currentColor.current.saturation}%, ${currentColor.current.lightness}%)`;
    const colorStrAlpha = (alpha: number) => `hsla(${currentColor.current.hue}, ${currentColor.current.saturation}%, ${currentColor.current.lightness}%, ${alpha})`;

    // Apply press scale to sizes
    const scaledDotSize = currentStyle.current.dotSize * pressScale.current;
    const scaledRingSize = currentStyle.current.ringSize * pressScale.current;

    // Apply to DOM - clean, sharp rendering
    if (dotRef.current) {
      dotRef.current.style.transform = `translate(${dotPos.current.x}px, ${dotPos.current.y}px) translate(-50%, -50%)`;
      dotRef.current.style.width = `${scaledDotSize}px`;
      dotRef.current.style.height = `${scaledDotSize}px`;
      dotRef.current.style.opacity = visible.current && currentState.current !== 'hidden' ? '1' : '0';
      dotRef.current.style.backgroundColor = colorStr;
      dotRef.current.style.boxShadow = `0 0 ${currentStyle.current.glowSize}px ${colorStrAlpha(currentStyle.current.glowOpacity)}`;
    }

    if (ringRef.current) {
      ringRef.current.style.transform = `translate(${ringPos.current.x}px, ${ringPos.current.y}px) translate(-50%, -50%)`;
      ringRef.current.style.width = `${scaledRingSize}px`;
      ringRef.current.style.height = `${scaledRingSize}px`;
      ringRef.current.style.opacity = visible.current && currentState.current !== 'hidden' ? '0.6' : '0';
      ringRef.current.style.borderColor = colorStrAlpha(0.25);
    }

    if (glowRef.current) {
      glowRef.current.style.transform = `translate(${dotPos.current.x}px, ${dotPos.current.y}px) translate(-50%, -50%)`;
      glowRef.current.style.width = `${currentStyle.current.glowSize * 4}px`;
      glowRef.current.style.height = `${currentStyle.current.glowSize * 4}px`;
      glowRef.current.style.opacity = visible.current && currentState.current !== 'hidden' ? String(currentStyle.current.glowOpacity * 0.4) : '0';
      glowRef.current.style.background = `radial-gradient(circle, ${colorStrAlpha(0.15)}, transparent 70%)`;
    }

    if (spinnerRef.current) {
      const showSpinner = currentState.current === 'loading' && visible.current;
      spinnerRef.current.style.transform = `translate(${ringPos.current.x}px, ${ringPos.current.y}px) translate(-50%, -50%) rotate(${loadingRotation.current}deg)`;
      spinnerRef.current.style.width = `${scaledRingSize + 6}px`;
      spinnerRef.current.style.height = `${scaledRingSize + 6}px`;
      spinnerRef.current.style.opacity = showSpinner ? '0.8' : '0';
      spinnerRef.current.style.borderColor = `${colorStrAlpha(0.5)} transparent ${colorStrAlpha(0.15)} transparent`;
    }

    animationRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    const hasHover = window.matchMedia('(hover: hover)').matches;
    if (!hasHover) return;

    // Set canvas size
    const canvas = particleCanvasRef.current;
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    animationRef.current = requestAnimationFrame(animate);

    const magneticElements = new Set<HTMLElement>();

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      visible.current = true;

      // Update target color based on background
      targetColor.current = getBackgroundColor(e.clientX, e.clientY);

      const target = e.target as HTMLElement;

      if (target.matches('input, textarea, select, [contenteditable="true"]')) {
        currentState.current = 'hidden';
        targetStyle.current = { ...CURSOR_STYLES.hidden };
        return;
      }

      const interactive = target.closest('button, a, [role="button"], .glass-button, .glass-card, [data-magnetic]') as HTMLElement;
      if (interactive) {
        currentState.current = 'hover';
        targetStyle.current = { ...CURSOR_STYLES.hover };

        const rect = interactive.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const distX = e.clientX - centerX;
        const distY = e.clientY - centerY;
        const distance = Math.sqrt(distX * distX + distY * distY);
        const maxDistance = 100;

        if (distance < maxDistance) {
          magneticElements.add(interactive);
          // Apple-style subtle magnetic - very slight attraction
          const strength = (1 - distance / maxDistance) * 0.015;
          const moveX = distX * strength;
          const moveY = distY * strength;
          interactive.style.transform = `translate(${moveX}px, ${moveY}px)`;
          interactive.style.transition = 'transform 0.15s ease-out';
        }
        return;
      }

      magneticElements.forEach(el => {
        if (!el.matches(':hover') && !el.contains(target)) {
          // Fast, clean return
          el.style.transform = '';
          el.style.transition = 'transform 0.2s ease-out';
        }
      });

      const isText = target.closest('p, span, h1, h2, h3, h4, h5, h6, li, label');
      if (isText && !target.closest('button, a')) {
        currentState.current = 'text';
        targetStyle.current = { ...CURSOR_STYLES.text };
        return;
      }

      currentState.current = 'default';
      targetStyle.current = { ...CURSOR_STYLES.default };
    };

    const handleMouseLeave = () => {
      visible.current = false;
      magneticElements.forEach(el => {
        el.style.transform = '';
        el.style.transition = 'transform 0.2s ease-out';
      });
    };

    const handleMouseEnter = () => {
      visible.current = true;
    };

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive = target.closest('button, a, [role="button"], .glass-button, .glass-card, [data-magnetic]');
      if (interactive) {
        createRipple(e.clientX, e.clientY);
        createParticleBurst(e.clientX, e.clientY, currentColor.current.hue);
      }
    };

    const handleMouseDown = () => {
      isPressed.current = true;
    };

    const handleMouseUp = () => {
      isPressed.current = false;
    };

    const handleElementMouseLeave = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive = target.closest('button, a, [role="button"], .glass-button, .glass-card, [data-magnetic]') as HTMLElement;
      if (interactive && magneticElements.has(interactive)) {
        // Fast clean return
        interactive.style.transform = '';
        interactive.style.transition = 'transform 0.2s ease-out';
      }
    };

    const handleResize = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseout', handleElementMouseLeave);
    document.addEventListener('click', handleClick);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseout', handleElementMouseLeave);
      document.removeEventListener('click', handleClick);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate, createRipple, createParticleBurst, getBackgroundColor]);

  // Expose loading state control
  useEffect(() => {
    (window as any).setCursorLoading = (loading: boolean) => {
      if (loading) {
        currentState.current = 'loading';
        targetStyle.current = { ...CURSOR_STYLES.loading };
      } else {
        currentState.current = 'default';
        targetStyle.current = { ...CURSOR_STYLES.default };
      }
    };
    return () => {
      delete (window as any).setCursorLoading;
    };
  }, []);

  if (typeof window !== 'undefined' && !window.matchMedia('(hover: hover)').matches) {
    return null;
  }

  return (
    <>
      {/* Particle canvas */}
      <canvas
        ref={particleCanvasRef}
        className="fixed inset-0 pointer-events-none z-[9994]"
      />

      {/* Click ripples */}
      {ripples.map(ripple => (
        <div
          key={ripple.id}
          className="fixed pointer-events-none z-[9995] rounded-full"
          style={{
            left: ripple.x,
            top: ripple.y,
            transform: 'translate(-50%, -50%)',
            animation: `cursorRipple ${RIPPLE_DURATION}ms ease-out forwards`,
          }}
        />
      ))}

      {/* Ambient glow - minimal */}
      <div
        ref={glowRef}
        className="fixed top-0 left-0 pointer-events-none z-[9996] rounded-full"
        style={{
          filter: 'blur(8px)',
        }}
      />

      {/* Loading spinner ring */}
      <div
        ref={spinnerRef}
        className="fixed top-0 left-0 pointer-events-none z-[9997] rounded-full"
        style={{
          borderWidth: '2px',
          borderStyle: 'solid',
        }}
      />

      {/* Outer ring - clean edge */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 pointer-events-none z-[9998] rounded-full"
        style={{
          borderWidth: '1.5px',
          borderStyle: 'solid',
        }}
      />

      {/* Main dot - sharp */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full"
      />

      {/* Ripple animation keyframes */}
      <style>{`
        @keyframes cursorRipple {
          0% {
            width: 0;
            height: 0;
            opacity: 0.35;
            box-shadow: 0 0 0 0 hsla(var(--primary) / 0.2);
          }
          100% {
            width: 80px;
            height: 80px;
            opacity: 0;
            box-shadow: 0 0 20px 10px hsla(var(--primary) / 0);
          }
        }
      `}</style>
    </>
  );
};
