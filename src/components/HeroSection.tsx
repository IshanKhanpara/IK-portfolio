import { useEffect, useRef, useState } from 'react';
import { TypewriterText } from './TypewriterText';

const NeuralParticles = ({ scrollY }: { scrollY: number }) => {
  const particles = useRef(
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${Math.random() * 10}s`,
      duration: `${15 + Math.random() * 15}s`,
      isAccent: Math.random() > 0.7,
      parallaxSpeed: 0.05 + Math.random() * 0.15,
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
    Array.from({ length: 8 }, (_, i) => ({
      id: i,
      left: `${10 + Math.random() * 80}%`,
      top: `${20 + Math.random() * 60}%`,
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
    { type: 'cyan', width: 400, height: 400, top: '10%', left: '20%', delay: '0s', speed: 0.08 },
    { type: 'purple', width: 350, height: 350, bottom: '20%', right: '15%', delay: '5s', speed: -0.06 },
    { type: 'cyan', width: 250, height: 250, top: '50%', right: '30%', delay: '10s', speed: 0.1 },
    { type: 'purple', width: 300, height: 300, bottom: '40%', left: '10%', delay: '7s', speed: -0.04 },
  ];

  return (
    <>
      {orbs.map((orb, index) => (
        <div
          key={index}
          className={`neural-orb ${orb.type}`}
          style={{
            width: `${orb.width}px`,
            height: `${orb.height}px`,
            top: orb.top,
            bottom: orb.bottom,
            left: orb.left,
            right: orb.right,
            animationDelay: orb.delay,
            transform: `translateY(${scrollY * orb.speed}px) scale(${1 + scrollY * 0.0002})`,
          }}
        />
      ))}
    </>
  );
};

export const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      
      // Parallax for grid
      const parallaxElements = sectionRef.current.querySelectorAll('[data-parallax]');
      parallaxElements.forEach((el) => {
        const speed = parseFloat((el as HTMLElement).dataset.parallax || '0.5');
        (el as HTMLElement).style.transform = `translateY(${currentScrollY * speed}px)`;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section ref={sectionRef} className="relative py-20 lg:py-28 flex items-center justify-center overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="order-2 lg:order-1 text-center lg:text-left">
            <div className="opacity-0 animate-fade-up" style={{ animationDelay: '0.2s' }}>
              <p className="text-primary text-sm font-medium tracking-widest uppercase mb-4">
                <TypewriterText 
                  words={[
                    "PROMPT ENGINEER",
                    "AI AUTOMATION SPECIALIST", 
                    "NO-CODE DEVELOPER",
                    "DATA ANALYST"
                  ]}
                  typingSpeed={80}
                  deletingSpeed={40}
                  pauseDuration={2500}
                />
              </p>
            </div>
            
            <h1 className="opacity-0 animate-fade-up" style={{ animationDelay: '0.4s' }}>
              <span className="block text-5xl md:text-6xl lg:text-7xl font-semibold text-foreground tracking-tight leading-tight">
                Ishan
              </span>
              <span className="block text-5xl md:text-6xl lg:text-7xl font-semibold text-foreground tracking-tight leading-tight">
                Khanpara
              </span>
            </h1>
            
            <p
              style={{ animationDelay: '0.6s' }}
              className="opacity-0 animate-fade-up mt-8 text-lg md:text-xl text-muted-foreground max-w-lg mx-auto lg:mx-0 leading-relaxed text-center lg:text-left"
            >
              Deloitte & Microsoft Certified Data Analyst | AI Automation Specialist Designing intelligent AI systems with clarity, precision, and human focus.
            </p>
            
            <div
              style={{ animationDelay: '0.8s' }}
              className="opacity-0 animate-fade-up mt-10 flex flex-row gap-4 lg:justify-start justify-center"
            >
              <a href="#work" className="glass-button text-foreground inline-flex items-center gap-2 whitespace-nowrap">
                View Work
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
              <a href="#contact" className="glass-button text-foreground inline-flex items-center gap-2 whitespace-nowrap">
                Get in Touch
              </a>
            </div>
          </div>
          
          {/* Portrait */}
          <div className="order-1 lg:order-2 flex justify-center">
            <div 
              className="relative opacity-0 animate-fade-up" 
              style={{ 
                animationDelay: '0.3s',
                transform: `translateY(${scrollY * 0.02}px)`,
              }}
            >
              {/* Portrait Container */}
              <div className="relative animate-float-gentle">
                <img
                  alt="Ishan Khanpara - AI Specialist"
                  className="relative z-10 w-72 md:w-80 lg:w-96 h-auto object-cover rounded-3xl"
                  style={{
                    filter: 'drop-shadow(0 25px 50px rgba(0, 0, 0, 0.6))',
                  }}
                  src="/lovable-uploads/36456073-a2e0-4a95-921c-ade1fd284687.jpg"
                />
                
                {/* Glass Frame - Neural Style */}
                <div className="absolute -inset-4 rounded-[2rem] glass-panel opacity-50 -z-10" />
                
                {/* Neural Glow Rings */}
                <div 
                  className="absolute -inset-8 rounded-[3rem] border border-primary/20 -z-20 animate-pulse" 
                  style={{ 
                    animationDuration: '3s',
                    transform: `scale(${1 + scrollY * 0.0001})`,
                  }} 
                />
                <div 
                  className="absolute -inset-12 rounded-[4rem] border border-accent/15 -z-30 animate-pulse" 
                  style={{ 
                    animationDuration: '4s', 
                    animationDelay: '1s',
                    transform: `scale(${1 + scrollY * 0.00015})`,
                  }} 
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div
          className="opacity-0 animate-fade-up flex justify-center mt-16"
          style={{ animationDelay: '1.2s' }}
        >
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <span className="text-xs tracking-widest uppercase">Scroll</span>
            <div className="w-px h-8 bg-gradient-to-b from-primary/60 via-accent/40 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
};
