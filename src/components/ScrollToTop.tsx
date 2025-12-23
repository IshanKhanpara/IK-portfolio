import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

export const ScrollToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className={`fixed bottom-6 right-6 z-50 p-3 rounded-full bg-background/60 backdrop-blur-xl border border-primary/20 text-primary shadow-[0_8px_32px_hsl(240_20%_2%/0.5),0_0_20px_hsl(190_85%_55%/0.1)] transition-all duration-500 hover:bg-primary/10 hover:border-primary/40 hover:shadow-[0_8px_32px_hsl(240_20%_2%/0.5),0_0_30px_hsl(190_85%_55%/0.2)] hover:scale-110 group ${
        visible
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <ArrowUp className="w-5 h-5 transition-transform duration-300 group-hover:-translate-y-0.5" />
      
      {/* Glow ring */}
      <span 
        className={`absolute inset-0 rounded-full border border-primary/30 animate-ping transition-opacity duration-300 ${
          visible ? 'opacity-30' : 'opacity-0'
        }`}
        style={{ animationDuration: '2s' }}
      />
    </button>
  );
};
