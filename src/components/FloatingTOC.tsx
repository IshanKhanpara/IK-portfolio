import { useEffect, useState } from 'react';
import { ChevronRight } from 'lucide-react';

interface TOCItem {
  id: string;
  label: string;
}

const tocItems: TOCItem[] = [
  { id: 'hero', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'expertise', label: 'Expertise' },
  { id: 'services', label: 'Services' },
  { id: 'work', label: 'Work' },
  { id: 'skills', label: 'Skills' },
  { id: 'blog', label: 'Blog' },
  { id: 'contact', label: 'Contact' },
];

export const FloatingTOC = () => {
  const [activeSection, setActiveSection] = useState('hero');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsVisible(scrollY > 300);

      // Find active section
      const scrollPosition = scrollY + 200;

      for (let i = tocItems.length - 1; i >= 0; i--) {
        const section = document.getElementById(tocItems[i].id);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(tocItems[i].id);
          break;
        }
      }

      // Default to hero if at top
      if (scrollY < 200) {
        setActiveSection('hero');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    if (id === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const activeIndex = tocItems.findIndex(item => item.id === activeSection);

  return (
    <div
      className={`fixed left-4 top-1/2 -translate-y-1/2 z-40 hidden lg:block transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
      }`}
    >
      {/* Always visible TOC */}
      <div className="px-3 py-4 rounded-2xl glass-toc-prominent">
        {/* Progress line */}
        <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-muted/30 rounded-full overflow-hidden">
          <div 
            className="w-full bg-gradient-to-b from-primary to-accent rounded-full transition-all duration-500"
            style={{ 
              height: `${((activeIndex + 1) / tocItems.length) * 100}%` 
            }}
          />
        </div>
        
        <nav className="flex flex-col gap-1 relative">
          {tocItems.map((item, index) => {
            const isActive = item.id === activeSection;
            const isPast = index < activeIndex;
            
            return (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`group flex items-center gap-2 pl-7 pr-4 py-2 rounded-xl text-left text-sm transition-all duration-300 relative ${
                  isActive
                    ? 'bg-primary/15 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
                }`}
              >
                {/* Dot indicator */}
                <div 
                  className={`absolute left-[18px] w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    isActive
                      ? 'bg-primary shadow-[0_0_12px_hsl(var(--primary))]'
                      : isPast
                      ? 'bg-primary/50'
                      : 'bg-muted-foreground/30 group-hover:bg-muted-foreground/50'
                  }`}
                />
                
                {/* Label */}
                <span className="font-medium ml-2">
                  {item.label}
                </span>
                
                {/* Active indicator arrow */}
                {isActive && (
                  <ChevronRight className="w-4 h-4 text-primary ml-auto" />
                )}
              </button>
            );
          })}
        </nav>
        
        {/* Section counter */}
        <div className="mt-3 pt-3 border-t border-border/30 flex items-center justify-between px-2">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Section
          </span>
          <span className="text-xs font-bold text-primary">
            {activeIndex + 1} / {tocItems.length}
          </span>
        </div>
      </div>
    </div>
  );
};
