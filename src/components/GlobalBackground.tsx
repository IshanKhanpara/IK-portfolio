import { useEffect, useRef, useState } from 'react';

const NeuralParticles = ({ scrollY }: { scrollY: number }) => {
  const particles = useRef(
    Array.from({ length: 35 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${Math.random() * 10}s`,
      duration: `${15 + Math.random() * 15}s`,
      isAccent: Math.random() > 0.7,
      parallaxSpeed: 0.05 + Math.random() * 0.15,
      size: 2 + Math.random() * 2,
    }))
  ).current;

  return (
    <div className="neural-particles">
      {particles.map((p) => (
        <div
          key={p.id}
          className={`neural-particle ${p.isAccent ? 'accent' : ''}`}
          style={{
            left: p.left,
            top: p.top,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDelay: p.delay,
            animationDuration: p.duration,
            transform: `translateY(${scrollY * p.parallaxSpeed}px)`,
          }}
        />
      ))}
    </div>
  );
};

const NeuralConnections = ({ scrollY }: { scrollY: number }) => {
  const connections = useRef(
    Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: `${10 + Math.random() * 80}%`,
      top: `${Math.random() * 100}%`,
      width: `${100 + Math.random() * 200}px`,
      rotation: -30 + Math.random() * 60,
      delay: `${Math.random() * 4}s`,
      parallaxSpeed: 0.03 + Math.random() * 0.08,
    }))
  ).current;

  return (
    <>
      {connections.map((c) => (
        <div
          key={c.id}
          className="neural-connection"
          style={{
            left: c.left,
            top: c.top,
            width: c.width,
            transform: `rotate(${c.rotation}deg) translateY(${scrollY * c.parallaxSpeed}px)`,
            animationDelay: c.delay,
          }}
        />
      ))}
    </>
  );
};

const NeuralOrbs = ({ scrollY }: { scrollY: number }) => {
  const orbs = [
    { type: 'cyan', width: 600, height: 600, top: '0%', left: '10%', delay: '0s', speed: 0.08 },
    { type: 'purple', width: 500, height: 500, top: '20%', right: '5%', delay: '5s', speed: -0.06 },
    { type: 'cyan', width: 400, height: 400, top: '40%', right: '20%', delay: '10s', speed: 0.1 },
    { type: 'purple', width: 450, height: 450, top: '55%', left: '0%', delay: '7s', speed: -0.05 },
    { type: 'cyan', width: 350, height: 350, top: '70%', left: '35%', delay: '3s', speed: 0.07 },
    { type: 'purple', width: 400, height: 400, top: '85%', right: '15%', delay: '8s', speed: -0.08 },
  ];

  return (
    <>
      {orbs.map((orb, index) => (
        <div
          key={index}
          className={`neural-orb ${orb.type} parallax-orb`}
          style={{
            width: `${orb.width}px`,
            height: `${orb.height}px`,
            top: orb.top,
            left: orb.left,
            right: orb.right,
            animationDelay: orb.delay,
            transform: `translateY(${scrollY * orb.speed}px) scale(${1 + scrollY * 0.00005})`,
          }}
        />
      ))}
    </>
  );
};

// Enhanced parallax layers with more dramatic effects
const ParallaxLayers = ({ scrollY }: { scrollY: number }) => {
  return (
    <>
      {/* Far background layer - slowest */}
      <div 
        className="parallax-layer parallax-far"
        style={{ transform: `translateY(${scrollY * 0.02}px)` }}
      />
      
      {/* Mid background layer */}
      <div 
        className="parallax-layer parallax-mid"
        style={{ transform: `translateY(${scrollY * 0.05}px)` }}
      />
      
      {/* Near background layer - fastest */}
      <div 
        className="parallax-layer parallax-near"
        style={{ transform: `translateY(${scrollY * 0.1}px)` }}
      />

      {/* Original floating geometric shapes */}
      <div 
        className="parallax-shape shape-1"
        style={{ transform: `translateY(${scrollY * 0.12}px) rotate(${scrollY * 0.02}deg)` }}
      />
      <div 
        className="parallax-shape shape-2"
        style={{ transform: `translateY(${scrollY * -0.08}px) rotate(${scrollY * -0.015}deg)` }}
      />
      <div 
        className="parallax-shape shape-3"
        style={{ transform: `translateY(${scrollY * 0.15}px) rotate(${scrollY * 0.01}deg)` }}
      />
      
      {/* NEW: Additional dramatic geometric shapes */}
      {/* Large rotating hexagon */}
      <div 
        className="parallax-shape shape-hexagon"
        style={{ 
          transform: `translateY(${scrollY * 0.18}px) rotate(${scrollY * 0.03}deg) scale(${1 + scrollY * 0.0001})` 
        }}
      />
      
      {/* Floating triangles */}
      <div 
        className="parallax-shape shape-triangle shape-triangle-1"
        style={{ 
          transform: `translateY(${scrollY * -0.12}px) rotate(${45 + scrollY * 0.04}deg)` 
        }}
      />
      <div 
        className="parallax-shape shape-triangle shape-triangle-2"
        style={{ 
          transform: `translateY(${scrollY * 0.14}px) rotate(${-30 + scrollY * -0.025}deg)` 
        }}
      />
      <div 
        className="parallax-shape shape-triangle shape-triangle-3"
        style={{ 
          transform: `translateY(${scrollY * -0.09}px) rotate(${60 + scrollY * 0.02}deg)` 
        }}
      />
      
      {/* Floating diamonds */}
      <div 
        className="parallax-shape shape-diamond shape-diamond-1"
        style={{ 
          transform: `translateY(${scrollY * 0.2}px) rotate(${45 + scrollY * 0.05}deg)` 
        }}
      />
      <div 
        className="parallax-shape shape-diamond shape-diamond-2"
        style={{ 
          transform: `translateY(${scrollY * -0.15}px) rotate(${45 + scrollY * -0.03}deg)` 
        }}
      />
      
      {/* Floating circles with rings */}
      <div 
        className="parallax-shape shape-ring shape-ring-1"
        style={{ 
          transform: `translateY(${scrollY * 0.1}px) scale(${1 + scrollY * 0.00015})` 
        }}
      />
      <div 
        className="parallax-shape shape-ring shape-ring-2"
        style={{ 
          transform: `translateY(${scrollY * -0.13}px) scale(${1 + scrollY * 0.0001})` 
        }}
      />
      <div 
        className="parallax-shape shape-ring shape-ring-3"
        style={{ 
          transform: `translateY(${scrollY * 0.16}px) scale(${1 - scrollY * 0.00008})` 
        }}
      />
      
      {/* Cross/Plus shapes */}
      <div 
        className="parallax-shape shape-cross shape-cross-1"
        style={{ 
          transform: `translateY(${scrollY * -0.11}px) rotate(${scrollY * 0.02}deg)` 
        }}
      />
      <div 
        className="parallax-shape shape-cross shape-cross-2"
        style={{ 
          transform: `translateY(${scrollY * 0.13}px) rotate(${scrollY * -0.025}deg)` 
        }}
      />
      
      {/* Dotted lines */}
      <div 
        className="parallax-shape shape-dots shape-dots-1"
        style={{ 
          transform: `translateX(${scrollY * 0.05}px)` 
        }}
      />
      <div 
        className="parallax-shape shape-dots shape-dots-2"
        style={{ 
          transform: `translateX(${scrollY * -0.04}px)` 
        }}
      />
    </>
  );
};

export const GlobalBackground = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="global-neural-bg">
      {/* Parallax Layers */}
      <ParallaxLayers scrollY={scrollY} />
      
      {/* Neural Grid Overlay */}
      <div 
        className="neural-grid-global"
        style={{ transform: `translateY(${scrollY * 0.03}px)` }}
      />
      
      {/* Neural Glow Orbs */}
      <NeuralOrbs scrollY={scrollY} />
      
      {/* Neural Particles */}
      <NeuralParticles scrollY={scrollY} />
      
      {/* Neural Connections */}
      <NeuralConnections scrollY={scrollY} />
    </div>
  );
};
