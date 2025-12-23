import { AnimatedSection } from './AnimatedSection';
import { useEffect, useRef, useState } from 'react';
import { Bot, Palette, Code } from 'lucide-react';

const skillCategories = [
  {
    title: 'AI & Automation',
    icon: Bot,
    skills: [
      { name: 'Prompt Engineering', level: 85 },
      { name: 'LLMs (GPT-4 / Claude / Gemini)', level: 82 },
      { name: 'No-Code Automation', level: 80 },
      { name: 'Zapier / Make / n8n', level: 78 },
      { name: 'AI Agent Design (No-Code)', level: 75 },
      { name: 'Workflow Optimization', level: 82 },
      { name: 'API Integration (Basic)', level: 70 },
      { name: 'Process Analysis', level: 78 },
    ],
  },
  {
    title: 'Content Creation',
    icon: Palette,
    skills: [
      { name: 'AI Image Creation', level: 78 },
      { name: 'AI Video Creation (Short-Form)', level: 72 },
      { name: 'AI-Assisted Content Writing', level: 80 },
      { name: 'Short-Form Video Editing', level: 75 },
      { name: 'Visual Prompting (Image / Video)', level: 78 },
      { name: 'Excel & Process Documentation', level: 85 },
    ],
  },
  {
    title: 'No-Code Development',
    icon: Code,
    skills: [
      { name: 'No-Code AI Website Design', level: 82 },
      { name: 'No-Code AI Website Development', level: 80 },
      { name: 'No-Code AI App Development', level: 75 },
      { name: 'No-Code AI Landing Page Creation', level: 85 },
      { name: 'No-Code AI Workflow Integration', level: 80 },
      { name: 'No-Code AI Tool Integration', level: 75 },
      { name: 'No-Code AI UI Generation', level: 78 },
    ],
  },
];

const SkillBar = ({ name, level, delay }: { name: string; level: number; delay: number }) => {
  const [width, setWidth] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => setWidth(level), delay);
          }
        });
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [level, delay]);

  return (
    <div ref={ref} className="group">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-foreground font-medium group-hover:text-primary transition-colors duration-300">
          {name}
        </span>
        <span className="text-xs text-muted-foreground">
          {level}%
        </span>
      </div>
      <div className="skill-bar">
        <div
          className="skill-bar-fill transition-all duration-1000 ease-water"
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
};

export const SkillsSection = () => {
  let globalIndex = 0;
  
  return (
    <section id="skills" className="py-24 relative">
      <div className="container mx-auto px-6">
        <AnimatedSection className="text-center mb-16">
          <p className="text-primary text-sm font-medium tracking-widest uppercase mb-6">
            Skills
          </p>
          <h2 className="text-3xl md:text-4xl font-semibold text-foreground">
            Technical Proficiency
          </h2>
        </AnimatedSection>
        
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-10">
          {skillCategories.map((category, categoryIndex) => {
            const IconComponent = category.icon;
            return (
              <div key={category.title}>
                <AnimatedSection delay={categoryIndex * 150}>
                  <h3 className="text-lg font-semibold text-primary mb-6 pb-2 border-b border-primary/20 flex items-center gap-2 group/header">
                    <IconComponent className="w-5 h-5 transition-all duration-300 group-hover/header:drop-shadow-[0_0_8px_hsl(var(--primary))] group-hover/header:scale-110" />
                    {category.title}
                  </h3>
                </AnimatedSection>
                <div className="grid gap-5">
                  {category.skills.map((skill, skillIndex) => {
                    const currentIndex = globalIndex++;
                    return (
                      <AnimatedSection 
                        key={skill.name} 
                        delay={categoryIndex * 150 + skillIndex * 80}
                        direction={skillIndex % 2 === 0 ? 'left' : 'right'}
                      >
                        <SkillBar
                          name={skill.name}
                          level={skill.level}
                          delay={currentIndex * 80 + 200}
                        />
                      </AnimatedSection>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="section-divider mt-24 max-w-4xl mx-auto" />
    </section>
  );
};
