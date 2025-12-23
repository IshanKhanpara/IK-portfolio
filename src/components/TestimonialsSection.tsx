import { useState, useEffect } from 'react';
import { AnimatedSection } from './AnimatedSection';
import { GlassCard } from './GlassCard';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';

const testimonials = [
  {
    quote: "Ishan transformed our customer support with AI automation. Response times dropped by 60% and our team can now focus on complex issues.",
    author: "Sarah Chen",
    role: "Head of Operations",
    company: "TechFlow Solutions",
  },
  {
    quote: "The prompt engineering work Ishan did for our content pipeline was exceptional. We now produce 3x more content with the same team.",
    author: "Michael Rodriguez",
    role: "Content Director",
    company: "Digital Media Corp",
  },
  {
    quote: "Working with Ishan was a game-changer. His AI agents automated our document processing and saved us hundreds of hours monthly.",
    author: "Emily Watson",
    role: "Legal Operations Manager",
    company: "Watson & Associates",
  },
  {
    quote: "Ishan has an incredible ability to understand business needs and translate them into effective AI solutions. Highly recommended!",
    author: "David Park",
    role: "Founder & CEO",
    company: "Innovate Labs",
  },
];

export const TestimonialsSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToPrev = () => {
    setIsAutoPlaying(false);
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToNext = () => {
    setIsAutoPlaying(false);
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  return (
    <section id="testimonials" className="py-24 relative">
      <div className="container mx-auto px-6">
        <AnimatedSection className="text-center mb-16">
          <p className="text-primary text-sm font-medium tracking-widest uppercase mb-6">
            Testimonials
          </p>
          <h2 className="text-3xl md:text-4xl font-semibold text-foreground">
            What Clients Say
          </h2>
        </AnimatedSection>

        <div className="max-w-4xl mx-auto">
          <AnimatedSection delay={200}>
            <GlassCard className="p-8 md:p-12 relative overflow-hidden">
              {/* Quote Icon */}
              <Quote className="absolute top-6 left-6 w-12 h-12 text-primary/20" />
              
              {/* Testimonial Content */}
              <div className="relative z-10">
                <div className="min-h-[160px] flex items-center justify-center">
                  {testimonials.map((testimonial, index) => (
                    <div
                      key={index}
                      className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-500 ${
                        index === activeIndex
                          ? 'opacity-100 translate-x-0'
                          : index < activeIndex
                          ? 'opacity-0 -translate-x-8'
                          : 'opacity-0 translate-x-8'
                      }`}
                    >
                      <p className="text-lg md:text-xl text-foreground text-center leading-relaxed mb-8 italic">
                        "{testimonial.quote}"
                      </p>
                      
                      <div className="text-center">
                        <p className="text-foreground font-semibold">{testimonial.author}</p>
                        <p className="text-muted-foreground text-sm">
                          {testimonial.role} at {testimonial.company}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-center gap-4 mt-8">
                <button
                  onClick={goToPrev}
                  className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors duration-300"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                {/* Dots */}
                <div className="flex items-center gap-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setIsAutoPlaying(false);
                        setActiveIndex(index);
                      }}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === activeIndex
                          ? 'bg-primary w-6 shadow-[0_0_10px_hsl(var(--primary))]'
                          : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                      }`}
                      aria-label={`Go to testimonial ${index + 1}`}
                    />
                  ))}
                </div>
                
                <button
                  onClick={goToNext}
                  className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors duration-300"
                  aria-label="Next testimonial"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </GlassCard>
          </AnimatedSection>
        </div>
      </div>
      
      <div className="section-divider mt-24 max-w-4xl mx-auto" />
    </section>
  );
};
