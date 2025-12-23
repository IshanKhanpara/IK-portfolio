import { AnimatedSection } from './AnimatedSection';
import { GlassCard } from './GlassCard';

const projects = [
  {
    title: 'Customer Support Automation',
    problem: 'A growing SaaS company struggled with support ticket overload, leading to slow response times.',
    approach: 'Designed an AI-powered triage system using GPT-4 with custom prompts for intent classification and automated responses.',
    outcome: '60% reduction in first-response time and 40% of tickets resolved without human intervention.',
  },
  {
    title: 'Content Pipeline Optimization',
    problem: 'A media agency spent excessive hours on repetitive content tasks—research, drafting, and editing.',
    approach: 'Built a no-code workflow combining web scraping, AI writing assistants, and automated quality checks.',
    outcome: 'Content production speed increased 3x while maintaining editorial standards.',
  },
  {
    title: 'Intelligent Document Processing',
    problem: 'A legal firm needed to extract and organize data from thousands of unstructured documents.',
    approach: 'Created an AI agent pipeline for document parsing, entity extraction, and structured data output.',
    outcome: 'Reduced manual processing time from weeks to hours with 95% accuracy.',
  },
];

export const WorkSection = () => {
  return (
    <section id="work" className="py-24 relative">
      <div className="container mx-auto px-6">
        <AnimatedSection className="text-center mb-16">
          <p className="text-primary text-sm font-medium tracking-widest uppercase mb-6">
            Selected Work
          </p>
          <h2 className="text-3xl md:text-4xl font-semibold text-foreground">
            Case Studies
          </h2>
        </AnimatedSection>
        
        <div className="space-y-6 max-w-4xl mx-auto">
          {projects.map((project, index) => (
            <AnimatedSection 
              key={project.title} 
              delay={index * 200}
              direction="scale"
            >
              <GlassCard className="p-8 group cursor-pointer hover:scale-[1.02] transition-transform duration-500">
                <div className="flex items-start justify-between gap-4 mb-6">
                  <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                    {project.title}
                  </h3>
                </div>
                
                <div className="grid md:grid-cols-3 gap-6">
                  <AnimatedSection delay={index * 200 + 100}>
                    <div>
                      <p className="text-xs text-primary/80 uppercase tracking-wider mb-2 font-medium">
                        Challenge
                      </p>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {project.problem}
                      </p>
                    </div>
                  </AnimatedSection>
                  
                  <AnimatedSection delay={index * 200 + 200}>
                    <div>
                      <p className="text-xs text-primary/80 uppercase tracking-wider mb-2 font-medium">
                        Approach
                      </p>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {project.approach}
                      </p>
                    </div>
                  </AnimatedSection>
                  
                  <AnimatedSection delay={index * 200 + 300}>
                    <div>
                      <p className="text-xs text-primary/80 uppercase tracking-wider mb-2 font-medium">
                        Outcome
                      </p>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {project.outcome}
                      </p>
                    </div>
                  </AnimatedSection>
                </div>
              </GlassCard>
            </AnimatedSection>
          ))}
        </div>
      </div>
      
      <div className="section-divider mt-24 max-w-4xl mx-auto" />
    </section>
  );
};
