import { AnimatedSection } from './AnimatedSection';
import { GlassCard } from './GlassCard';
import { Bot, Workflow, Zap, Settings, Image, Video, PenTool, LayoutTemplate, MessageSquare, Database } from 'lucide-react';

const expertiseItems = [
  {
    icon: Bot,
    title: 'Prompt Engineering',
    description: 'Crafting precise, effective prompts that unlock the full potential of large language models for complex tasks.',
  },
  {
    icon: Zap,
    title: 'AI Automation',
    description: 'Building intelligent automation workflows using Zapier, Make, and n8n that streamline operations.',
  },
  {
    icon: Workflow,
    title: 'AI Agents & Workflows',
    description: 'Designing autonomous AI agents and multi-step workflows that handle complex, reasoning-heavy processes.',
  },
  {
    icon: Settings,
    title: 'Process Automation',
    description: 'Transforming manual business processes into efficient, AI-powered systems that scale with your needs.',
  },
  {
    icon: Image,
    title: 'AI Image Creation',
    description: 'Creating stunning visuals using Midjourney, DALL-E, and Stable Diffusion for marketing and creative projects.',
  },
  {
    icon: Video,
    title: 'AI Video Production',
    description: 'Producing engaging video content with AI tools like Runway, Pika, and HeyGen for modern storytelling.',
  },
  {
    icon: PenTool,
    title: 'AI Content Writing',
    description: 'Leveraging GPT-4, Claude, and Gemini to create compelling copy, articles, and marketing content.',
  },
  {
    icon: LayoutTemplate,
    title: 'No-Code Development',
    description: 'Building landing pages and web applications using no-code platforms like Webflow and Framer.',
  },
  {
    icon: MessageSquare,
    title: 'AI Chatbots',
    description: 'Developing intelligent conversational AI assistants that enhance customer support and engagement.',
  },
  {
    icon: Database,
    title: 'Data & API Integration',
    description: 'Connecting AI tools with databases and APIs to create seamless, automated data pipelines.',
  },
];

export const ExpertiseSection = () => {
  return (
    <section id="expertise" className="py-24 relative">
      <div className="container mx-auto px-6">
        <AnimatedSection className="text-center mb-16">
          <p className="text-primary text-sm font-medium tracking-widest uppercase mb-6">
            Expertise
          </p>
          <h2 className="text-3xl md:text-4xl font-semibold text-foreground">
            What I Do
          </h2>
        </AnimatedSection>
        
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {expertiseItems.map((item, index) => (
            <AnimatedSection 
              key={item.title} 
              delay={index * 150}
              direction={index % 2 === 0 ? 'left' : 'right'}
            >
              <GlassCard className="p-8 h-full group">
                <div className="flex items-start gap-5">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-500">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </div>
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
