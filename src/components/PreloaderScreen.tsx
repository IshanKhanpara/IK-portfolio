import { useEffect, useState } from 'react';

export const PreloaderScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [phase, setPhase] = useState<'initial' | 'reveal' | 'expand' | 'fadeOut'>('initial');

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase('reveal'), 200),
      setTimeout(() => setPhase('expand'), 1200),
      setTimeout(() => setPhase('fadeOut'), 2000),
      setTimeout(() => onComplete(), 2500),
    ];

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[110] flex items-center justify-center bg-background transition-all duration-500 ${
        phase === 'fadeOut' ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Animated background lines */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className={`absolute h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent transition-all duration-1000 ${
              phase !== 'initial' ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              top: `${20 + i * 15}%`,
              left: phase !== 'initial' ? '0%' : '50%',
              right: phase !== 'initial' ? '0%' : '50%',
              transitionDelay: `${i * 100}ms`,
            }}
          />
        ))}
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={`v-${i}`}
            className={`absolute w-px bg-gradient-to-b from-transparent via-accent/30 to-transparent transition-all duration-1000 ${
              phase !== 'initial' ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              left: `${20 + i * 15}%`,
              top: phase !== 'initial' ? '0%' : '50%',
              bottom: phase !== 'initial' ? '0%' : '50%',
              transitionDelay: `${i * 100 + 200}ms`,
            }}
          />
        ))}
      </div>

      {/* Logo container */}
      <div className="relative">
        {/* Outer ring - appears first */}
        <div
          className={`absolute -inset-16 rounded-full border-2 border-primary/20 transition-all duration-700 ${
            phase !== 'initial' ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
          }`}
        />
        
        {/* Middle ring */}
        <div
          className={`absolute -inset-12 rounded-full border border-accent/30 transition-all duration-700 delay-100 ${
            phase !== 'initial' ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
          }`}
        />

        {/* Inner glow ring */}
        <div
          className={`absolute -inset-8 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 blur-xl transition-all duration-700 delay-200 ${
            phase !== 'initial' ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
          }`}
        />

        {/* Logo letters */}
        <div className="relative flex items-center gap-1">
          {/* I */}
          <div
            className={`relative transition-all duration-500 ${
              phase !== 'initial' ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ transitionDelay: '300ms' }}
          >
            <span
              className={`text-8xl font-bold text-foreground tracking-tighter block transition-all duration-700 ${
                phase === 'expand' || phase === 'fadeOut' ? 'translate-x-0' : 'translate-x-4'
              }`}
            >
              I
            </span>
            {/* Letter underline */}
            <div
              className={`absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-primary to-primary/50 rounded-full transition-all duration-500 delay-500 ${
                phase !== 'initial' ? 'w-full opacity-100' : 'w-0 opacity-0'
              }`}
            />
          </div>

          {/* K */}
          <div
            className={`relative transition-all duration-500 ${
              phase !== 'initial' ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ transitionDelay: '400ms' }}
          >
            <span
              className={`text-8xl font-bold text-primary tracking-tighter block transition-all duration-700 ${
                phase === 'expand' || phase === 'fadeOut' ? 'translate-x-0' : '-translate-x-4'
              }`}
            >
              K
            </span>
            {/* Letter underline */}
            <div
              className={`absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-accent/50 to-accent rounded-full transition-all duration-500 delay-600 ${
                phase !== 'initial' ? 'w-full opacity-100' : 'w-0 opacity-0'
              }`}
            />
          </div>
        </div>

        {/* Particle burst on reveal */}
        {phase !== 'initial' && (
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="absolute left-1/2 top-1/2 w-1.5 h-1.5 rounded-full bg-primary/80 animate-ping"
                style={{
                  transform: `rotate(${i * 30}deg) translateY(-60px)`,
                  animationDuration: '1.5s',
                  animationDelay: `${i * 50}ms`,
                }}
              />
            ))}
          </div>
        )}

        {/* Expanding pulse on 'expand' phase */}
        {(phase === 'expand' || phase === 'fadeOut') && (
          <>
            <div className="absolute -inset-8 rounded-full border border-primary/40 animate-ping" style={{ animationDuration: '1s' }} />
            <div className="absolute -inset-16 rounded-full border border-accent/20 animate-ping" style={{ animationDuration: '1.5s', animationDelay: '0.2s' }} />
          </>
        )}
      </div>

      {/* Tagline reveal */}
      <div
        className={`absolute bottom-1/3 left-1/2 -translate-x-1/2 transition-all duration-700 ${
          phase === 'expand' || phase === 'fadeOut' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <p className="text-sm text-muted-foreground tracking-[0.3em] uppercase">
          AI & Product Innovation
        </p>
      </div>

      {/* Corner accents */}
      <div className={`absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 border-primary/30 transition-all duration-700 ${
        phase !== 'initial' ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
      }`} />
      <div className={`absolute top-8 right-8 w-16 h-16 border-r-2 border-t-2 border-primary/30 transition-all duration-700 delay-100 ${
        phase !== 'initial' ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
      }`} />
      <div className={`absolute bottom-8 left-8 w-16 h-16 border-l-2 border-b-2 border-accent/30 transition-all duration-700 delay-200 ${
        phase !== 'initial' ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
      }`} />
      <div className={`absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 border-accent/30 transition-all duration-700 delay-300 ${
        phase !== 'initial' ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
      }`} />
    </div>
  );
};
