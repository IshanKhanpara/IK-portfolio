import { AnimatedSection } from './AnimatedSection';

export const AboutSection = () => {
  return (
    <section id="about" className="py-24 relative">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center">
          <AnimatedSection delay={0}>
            <p className="text-primary text-sm font-medium tracking-widest uppercase mb-6">
              About
            </p>
          </AnimatedSection>
          
          <AnimatedSection delay={100}>
            <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-8 leading-tight">
              Building the bridge between human intent and artificial intelligence
            </h2>
          </AnimatedSection>
          
          <div className="space-y-6 text-muted-foreground text-lg leading-relaxed">
            <AnimatedSection delay={200}>
              <p>
                I specialize in translating complex business needs into intelligent AI solutions. 
                With a focus on prompt engineering and no-code automation, I help organizations 
                harness the power of AI without the complexity of traditional development.
              </p>
            </AnimatedSection>
            
            <AnimatedSection delay={300}>
              <p>
                My approach centers on clarity and precision—understanding the problem deeply 
                before crafting solutions that are elegant, scalable, and genuinely useful.
              </p>
            </AnimatedSection>
          </div>
        </div>
      </div>
      
      {/* Subtle divider */}
      <div className="section-divider mt-24 max-w-4xl mx-auto" />
    </section>
  );
};
