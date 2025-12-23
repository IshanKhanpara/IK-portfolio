import { useEffect, useState } from 'react';

export const ScrollProgressIndicator = () => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      
      setProgress(scrollPercent);
      setIsVisible(scrollTop > 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Top Progress Bar */}
      <div 
        className={`fixed top-0 left-0 right-0 h-[2px] z-[60] transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div 
          className="h-full bg-gradient-to-r from-primary via-accent to-primary transition-all duration-150 ease-out"
          style={{ 
            width: `${progress}%`,
            boxShadow: '0 0 10px hsl(var(--primary)), 0 0 20px hsl(var(--primary) / 0.5)'
          }}
        />
      </div>

      {/* Side Progress Indicator */}
      <div 
        className={`fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col items-center gap-3 transition-all duration-500 ${
          isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
        }`}
      >
        {/* Progress Track */}
        <div className="relative w-1 h-32 rounded-full bg-muted/30 overflow-hidden">
          <div 
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-primary to-accent rounded-full transition-all duration-150 ease-out"
            style={{ height: `${progress}%` }}
          />
          {/* Glow Effect */}
          <div 
            className="absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-primary blur-sm transition-all duration-150"
            style={{ 
              bottom: `calc(${progress}% - 6px)`,
              opacity: progress > 0 ? 1 : 0
            }}
          />
        </div>
        
        {/* Percentage */}
        <div className="text-xs font-mono text-muted-foreground tabular-nums">
          {Math.round(progress)}%
        </div>
      </div>
    </>
  );
};
