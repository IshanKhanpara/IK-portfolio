import { useEffect, useState, useRef, useCallback } from 'react';
import { Menu, X, ChevronUp, ChevronDown } from 'lucide-react';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
}

interface Ripple {
  id: number;
  x: number;
  y: number;
  scale: number;
  opacity: number;
}

export const Navigation = () => {
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [keyboardNavTarget, setKeyboardNavTarget] = useState<string | null>(null);
  const [showKeyboardHint, setShowKeyboardHint] = useState(false);
  const [logoTilt, setLogoTilt] = useState({ x: 0, y: 0 });
  const [logoOffset, setLogoOffset] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState<Particle[]>([]);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const navRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const keyboardHintTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const navItems = [
    { label: 'Home', href: '#', id: 'home' },
    { label: 'About', href: '#about', id: 'about' },
    { label: 'Services', href: '#services', id: 'services' },
    { label: 'Work', href: '#work', id: 'work' },
    { label: 'Skills', href: '#skills', id: 'skills' },
    { label: 'Blog', href: '#blog', id: 'blog' },
    { label: 'Contact', href: '#contact', id: 'contact' },
  ];

  // Play click sound
  const playClickSound = () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      
      // Create a pleasant "pop" sound
      const oscillator1 = ctx.createOscillator();
      const oscillator2 = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator1.connect(gainNode);
      oscillator2.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator1.frequency.setValueAtTime(800, ctx.currentTime);
      oscillator1.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.05);
      oscillator1.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.15);
      
      oscillator2.frequency.setValueAtTime(1200, ctx.currentTime);
      oscillator2.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.1);
      
      oscillator1.type = 'sine';
      oscillator2.type = 'triangle';
      
      gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
      
      oscillator1.start(ctx.currentTime);
      oscillator2.start(ctx.currentTime);
      oscillator1.stop(ctx.currentTime + 0.2);
      oscillator2.stop(ctx.currentTime + 0.2);
    } catch (error) {
      // Audio not supported, fail silently
    }
  };

  // Logo 3D tilt + magnetic effect
  const handleLogoMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!logoRef.current) return;
    const rect = logoRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // 3D tilt
    const rotateX = ((e.clientY - centerY) / (rect.height / 2)) * -15;
    const rotateY = ((e.clientX - centerX) / (rect.width / 2)) * 15;
    setLogoTilt({ x: rotateX, y: rotateY });
    
    // Magnetic offset - logo follows cursor slightly
    const magnetStrength = 0.3;
    const offsetX = (e.clientX - centerX) * magnetStrength;
    const offsetY = (e.clientY - centerY) * magnetStrength;
    setLogoOffset({ x: offsetX, y: offsetY });
  };

  const handleLogoMouseLeave = () => {
    setLogoTilt({ x: 0, y: 0 });
    setLogoOffset({ x: 0, y: 0 });
  };

  // Particle explosion + ripple on click
  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    
    // Play sound
    playClickSound();
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    const rect = logoRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Create particles
    const newParticles: Particle[] = Array.from({ length: 20 }, (_, i) => ({
      id: Date.now() + i,
      x: centerX,
      y: centerY,
      vx: (Math.random() - 0.5) * 15,
      vy: (Math.random() - 0.5) * 15,
      life: 1,
      color: Math.random() > 0.5 ? 'hsl(190, 85%, 55%)' : 'hsl(270, 70%, 60%)',
    }));
    setParticles(prev => [...prev, ...newParticles]);
    
    // Create ripples
    const newRipples: Ripple[] = [
      { id: Date.now(), x: centerX, y: centerY, scale: 0, opacity: 1 },
      { id: Date.now() + 1, x: centerX, y: centerY, scale: 0, opacity: 0.7 },
      { id: Date.now() + 2, x: centerX, y: centerY, scale: 0, opacity: 0.4 },
    ];
    setRipples(prev => [...prev, ...newRipples]);
  };

  // Animate particles
  useEffect(() => {
    if (particles.length === 0) return;
    
    const animate = () => {
      setParticles(prev => 
        prev
          .map(p => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.3, // gravity
            life: p.life - 0.02,
          }))
          .filter(p => p.life > 0)
      );
    };
    
    const interval = setInterval(animate, 16);
    return () => clearInterval(interval);
  }, [particles.length]);

  // Animate ripples
  useEffect(() => {
    if (ripples.length === 0) return;
    
    const animate = () => {
      setRipples(prev => 
        prev
          .map((r, i) => ({
            ...r,
            scale: r.scale + 0.08 - i * 0.01,
            opacity: r.opacity - 0.015,
          }))
          .filter(r => r.opacity > 0)
      );
    };
    
    const interval = setInterval(animate, 16);
    return () => clearInterval(interval);
  }, [ripples.length]);

  // Get current section index
  const getCurrentIndex = useCallback(() => {
    if (!activeSection || activeSection === '') return 0;
    const index = navItems.findIndex(item => item.id === activeSection);
    return index >= 0 ? index : 0;
  }, [activeSection]);

  // Navigate to section
  const navigateToSection = useCallback((index: number) => {
    const clampedIndex = Math.max(0, Math.min(index, navItems.length - 1));
    const targetSection = navItems[clampedIndex];
    
    if (targetSection.id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const element = document.getElementById(targetSection.id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle arrow keys when not in input/textarea
      const activeElement = document.activeElement;
      if (activeElement?.tagName === 'INPUT' || activeElement?.tagName === 'TEXTAREA') {
        return;
      }

      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        const currentIndex = getCurrentIndex();
        const newIndex = e.key === 'ArrowDown' ? currentIndex + 1 : currentIndex - 1;
        const clampedIndex = Math.max(0, Math.min(newIndex, navItems.length - 1));
        
        // Show keyboard hint
        setKeyboardNavTarget(navItems[clampedIndex].label);
        setShowKeyboardHint(true);
        
        // Clear previous timeout
        if (keyboardHintTimeoutRef.current) {
          clearTimeout(keyboardHintTimeoutRef.current);
        }
        
        // Navigate after short delay
        keyboardHintTimeoutRef.current = setTimeout(() => {
          navigateToSection(clampedIndex);
          setTimeout(() => {
            setShowKeyboardHint(false);
            setKeyboardNavTarget(null);
          }, 500);
        }, 150);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (keyboardHintTimeoutRef.current) {
        clearTimeout(keyboardHintTimeoutRef.current);
      }
    };
  }, [getCurrentIndex, navigateToSection]);

  // Track mouse for liquid glass effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (navRef.current) {
        const rect = navRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        navRef.current.style.setProperty('--mouse-x', `${x}%`);
        navRef.current.style.setProperty('--mouse-y', `${y}%`);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (href === '#') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Always visible - sticky navigation
      setVisible(true);
      
      setScrolled(currentScrollY > 50);
      setLastScrollY(currentScrollY);

      // Determine active section (excluding home)
      const sectionItems = navItems.filter(item => item.id !== 'home');
      const sections = sectionItems.map(item => document.getElementById(item.id));
      const scrollPosition = currentScrollY + 150;

      let foundSection = false;
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sectionItems[i].id);
          foundSection = true;
          break;
        }
      }

      // If at top, no active section
      if (currentScrollY < 100) {
        setActiveSection('');
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    handleSmoothScroll(e, href);
    setMobileMenuOpen(false);
  };

  // Filter out home from desktop nav display
  const desktopNavItems = navItems.filter(item => item.id !== 'home');

  return (
    <>
      {/* Ripple effect */}
      {ripples.map(ripple => (
        <div
          key={ripple.id}
          className="fixed pointer-events-none z-[199]"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: 300,
            height: 300,
            transform: `translate(-50%, -50%) scale(${ripple.scale})`,
            opacity: ripple.opacity,
            borderRadius: '50%',
            border: '2px solid hsl(190, 85%, 55%)',
            boxShadow: `0 0 20px hsl(190, 85%, 55% / 0.5), inset 0 0 20px hsl(190, 85%, 55% / 0.2)`,
          }}
        />
      ))}

      {/* Particle explosion effect */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className="fixed pointer-events-none z-[200] rounded-full"
          style={{
            left: particle.x,
            top: particle.y,
            width: 8,
            height: 8,
            backgroundColor: particle.color,
            opacity: particle.life,
            boxShadow: `0 0 ${10 * particle.life}px ${particle.color}`,
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}

      {/* Keyboard Navigation Indicator */}
      <div
        className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100] pointer-events-none transition-all duration-300 ${
          showKeyboardHint 
            ? 'opacity-100 scale-100' 
            : 'opacity-0 scale-90'
        }`}
      >
        <div className="px-8 py-4 rounded-2xl glass-refraction-indicator flex items-center gap-4">
          <div className="flex flex-col items-center gap-1 text-muted-foreground">
            <ChevronUp className="w-4 h-4 animate-bounce" style={{ animationDuration: '0.6s' }} />
            <ChevronDown className="w-4 h-4 animate-bounce" style={{ animationDuration: '0.6s', animationDelay: '0.1s' }} />
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Navigating to</p>
            <p className="text-xl font-medium text-primary">{keyboardNavTarget}</p>
          </div>
        </div>
      </div>

      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
          scrolled
            ? 'py-3'
            : 'py-6'
        } ${
          visible || mobileMenuOpen
            ? 'translate-y-0' 
            : '-translate-y-full'
        }`}
      >
        {/* Floating glass container */}
        <div 
          className={`mx-auto transition-all duration-500 ease-out ${
            scrolled 
              ? 'max-w-4xl px-4 md:px-0' 
              : 'max-w-full px-0'
          }`}
        >
          <div 
            ref={navRef}
            className={`transition-all duration-500 ease-out ${
              scrolled 
                ? 'mx-4 md:mx-0 px-6 py-3 rounded-2xl liquid-glass-nav glass-refraction' 
                : 'px-6 bg-transparent'
            }`}
          >
            <div className="flex items-center justify-between">
              <a
                ref={logoRef}
                href="#"
                onClick={handleLogoClick}
                onMouseMove={handleLogoMouseMove}
                onMouseLeave={handleLogoMouseLeave}
                className="relative group perspective-500"
                style={{
                  transform: `perspective(500px) rotateX(${logoTilt.x}deg) rotateY(${logoTilt.y}deg) translate(${logoOffset.x}px, ${logoOffset.y}px)`,
                  transformStyle: 'preserve-3d',
                  transition: logoOffset.x === 0 && logoOffset.y === 0 ? 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'transform 0.1s ease-out',
                }}
              >
                <span 
                  className="relative z-10 text-2xl font-bold tracking-tight transition-all duration-300 inline-block"
                  style={{ transform: 'translateZ(20px)' }}
                >
                  <span className="text-foreground drop-shadow-[0_0_8px_hsl(var(--foreground)/0.3)]">I</span>
                  <span className="text-primary drop-shadow-[0_0_12px_hsl(var(--primary)/0.6)]">K</span>
                </span>
                
                {/* 3D shadow layer */}
                <span 
                  className="absolute inset-0 text-2xl font-bold tracking-tight text-primary/20 blur-sm"
                  style={{ transform: 'translateZ(-10px)' }}
                >
                  IK
                </span>
                
                {/* Continuous breathing glow */}
                <div className="absolute -inset-4 rounded-xl">
                  <div 
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/20 to-accent/20 blur-xl"
                    style={{ animation: 'breathingGlow 3s ease-in-out infinite' }}
                  />
                </div>
                
                {/* Enhanced glow on hover */}
                <div className="absolute -inset-5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/40 to-accent/40 blur-2xl animate-pulse" />
                </div>
                
                {/* Orbiting glow ring */}
                <div className="absolute -inset-3 rounded-lg">
                  <div 
                    className="absolute inset-0 rounded-lg border border-primary/30 opacity-50 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ animation: 'breathingBorder 4s ease-in-out infinite' }}
                  />
                  <div 
                    className="absolute w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_hsl(var(--primary)),0_0_20px_hsl(var(--primary))]"
                    style={{
                      animation: 'orbitGlow 3s linear infinite',
                      top: '50%',
                      left: '0',
                    }}
                  />
                </div>
                
                {/* Shimmer effect */}
                <div className="absolute inset-0 overflow-hidden rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div 
                    className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    style={{ animation: 'shimmer 2s infinite' }}
                  />
                </div>
              </a>
              
              <ul className="hidden md:flex items-center gap-8">
                {desktopNavItems.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      onClick={(e) => handleSmoothScroll(e, item.href)}
                      className={`text-sm transition-colors duration-300 relative group flex items-center gap-2 ${
                        activeSection === item.id
                          ? 'text-primary'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <span 
                        className={`w-1.5 h-1.5 rounded-full bg-primary transition-all duration-300 shadow-[0_0_8px_hsl(var(--primary)),0_0_12px_hsl(var(--primary)/0.5)] ${
                          activeSection === item.id
                            ? 'opacity-100 scale-100 animate-pulse'
                            : 'opacity-0 scale-0'
                        }`}
                      />
                      {item.label}
                      <span 
                        className={`absolute -bottom-1 left-0 h-px bg-primary transition-all duration-300 ${
                          activeSection === item.id
                            ? 'w-full'
                            : 'w-0 group-hover:w-full'
                        }`} 
                      />
                    </a>
                  </li>
                ))}
              </ul>

              <a
                href="#contact"
                onClick={(e) => handleSmoothScroll(e, '#contact')}
                className={`hidden md:inline-flex text-sm transition-all duration-300 ${
                  scrolled 
                    ? 'px-4 py-2 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20' 
                    : 'text-primary hover:text-foreground'
                }`}
              >
                Let's Talk
              </a>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-foreground hover:text-primary transition-colors duration-300"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-500 ${
          mobileMenuOpen 
            ? 'opacity-100 pointer-events-auto' 
            : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-background/80 backdrop-blur-xl"
          onClick={() => setMobileMenuOpen(false)}
        />
        
        {/* Menu Content */}
        <div 
          className={`absolute inset-x-0 top-20 mx-4 p-6 rounded-2xl bg-background/90 backdrop-blur-xl border border-primary/10 shadow-[0_8px_32px_hsl(240_20%_2%/0.5)] transition-all duration-500 ${
            mobileMenuOpen 
              ? 'translate-y-0 opacity-100' 
              : '-translate-y-4 opacity-0'
          }`}
        >
          <ul className="flex flex-col gap-2">
            {navItems.map((item, index) => (
              <li 
                key={item.label}
                className="overflow-hidden"
                style={{ 
                  transitionDelay: mobileMenuOpen ? `${index * 50}ms` : '0ms' 
                }}
              >
                <a
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={`block py-3 px-4 text-lg rounded-xl transition-all duration-300 ${
                    activeSection === item.id
                      ? 'text-primary bg-primary/10'
                      : 'text-foreground hover:text-primary hover:bg-primary/5'
                  } ${
                    mobileMenuOpen 
                      ? 'translate-x-0 opacity-100' 
                      : '-translate-x-4 opacity-0'
                  }`}
                  style={{ 
                    transitionDelay: mobileMenuOpen ? `${index * 50 + 100}ms` : '0ms' 
                  }}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          
          <div className="mt-4 pt-4 border-t border-border/50">
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, '#contact')}
              className="block w-full py-3 px-4 text-center text-primary bg-primary/10 hover:bg-primary/20 rounded-xl border border-primary/20 transition-all duration-300"
            >
              Let's Talk
            </a>
          </div>
        </div>
      </div>
    </>
  );
};
