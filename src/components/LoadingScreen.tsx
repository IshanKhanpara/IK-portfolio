import { useEffect, useState } from 'react';

export const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setFadeOut(true), 300);
          setTimeout(() => onComplete(), 800);
          return 100;
        }
        return prev + Math.random() * 15 + 5;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background transition-all duration-700 ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Neural orbs background */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute w-96 h-96 rounded-full bg-primary/10 blur-[100px] animate-pulse"
          style={{ top: '20%', left: '30%', animationDuration: '3s' }}
        />
        <div 
          className="absolute w-80 h-80 rounded-full bg-accent/10 blur-[80px] animate-pulse"
          style={{ bottom: '30%', right: '25%', animationDuration: '4s', animationDelay: '1s' }}
        />
      </div>

      {/* Logo */}
      <div className={`relative mb-12 transition-all duration-500 ${fadeOut ? 'scale-150 opacity-0' : 'scale-100 opacity-100'}`}>
        <div className="text-6xl font-bold text-foreground tracking-tighter">
          <span className="inline-block animate-fade-up" style={{ animationDelay: '0.1s' }}>I</span>
          <span className="inline-block animate-fade-up text-primary" style={{ animationDelay: '0.2s' }}>K</span>
        </div>
        
        {/* Glow ring */}
        <div className="absolute -inset-8 rounded-full border border-primary/20 animate-ping" style={{ animationDuration: '2s' }} />
        <div className="absolute -inset-12 rounded-full border border-accent/10 animate-ping" style={{ animationDuration: '3s', animationDelay: '0.5s' }} />
      </div>

      {/* Progress bar */}
      <div className="w-48 h-1 bg-muted rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-300 ease-out"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>

      {/* Loading text */}
      <p className="mt-6 text-sm text-muted-foreground tracking-widest uppercase">
        Loading
        <span className="inline-block animate-pulse">.</span>
        <span className="inline-block animate-pulse" style={{ animationDelay: '0.2s' }}>.</span>
        <span className="inline-block animate-pulse" style={{ animationDelay: '0.4s' }}>.</span>
      </p>

      {/* Neural particles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-primary/60 animate-ping"
            style={{
              left: `${20 + Math.random() * 60}%`,
              top: `${20 + Math.random() * 60}%`,
              animationDuration: `${2 + Math.random() * 2}s`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
};
