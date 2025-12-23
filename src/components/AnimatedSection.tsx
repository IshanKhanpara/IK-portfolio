import { useEffect, useRef, ReactNode, Children, cloneElement, isValidElement } from 'react';

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'scale' | 'fade';
  stagger?: boolean;
  staggerDelay?: number;
}

export const AnimatedSection = ({ 
  children, 
  className = '', 
  delay = 0,
  direction = 'up',
  stagger = false,
  staggerDelay = 100
}: AnimatedSectionProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              element.classList.add('is-visible');
              
              // Trigger staggered children animations
              if (stagger) {
                const staggerChildren = element.querySelectorAll('[data-stagger-child]');
                staggerChildren.forEach((child, index) => {
                  setTimeout(() => {
                    child.classList.add('stagger-visible');
                  }, index * staggerDelay);
                });
              }
            }, delay);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '20px 0px -50px 0px' }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [delay, stagger, staggerDelay]);

  const getInitialTransform = () => {
    switch (direction) {
      case 'up': return 'translate-y-16';
      case 'down': return '-translate-y-16';
      case 'left': return 'translate-x-16';
      case 'right': return '-translate-x-16';
      case 'scale': return 'scale-90';
      case 'fade': return '';
      default: return 'translate-y-16';
    }
  };

  return (
    <div
      ref={ref}
      className={`scroll-animate opacity-0 ${getInitialTransform()} ${className}`}
    >
      {children}
    </div>
  );
};

// Stagger Item component for child elements
interface StaggerItemProps {
  children: ReactNode;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right' | 'scale' | 'fade';
}

export const StaggerItem = ({ 
  children, 
  className = '',
  direction = 'up'
}: StaggerItemProps) => {
  const getInitialStyles = () => {
    switch (direction) {
      case 'up': return 'translate-y-8';
      case 'down': return '-translate-y-8';
      case 'left': return 'translate-x-8';
      case 'right': return '-translate-x-8';
      case 'scale': return 'scale-95';
      case 'fade': return '';
      default: return 'translate-y-8';
    }
  };

  return (
    <div 
      data-stagger-child
      className={`stagger-item opacity-0 ${getInitialStyles()} transition-all duration-700 ease-out ${className}`}
    >
      {children}
    </div>
  );
};
