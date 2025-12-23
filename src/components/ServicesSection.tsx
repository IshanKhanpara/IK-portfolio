import { AnimatedSection } from './AnimatedSection';
import { GlassCard } from './GlassCard';
import { Check, Zap, Rocket, Crown } from 'lucide-react';
import { GlassButton } from './GlassButton';

const services = [
  {
    name: 'Starter',
    icon: Zap,
    price: '$300',
    period: 'per project',
    description: 'Best for individuals & small teams starting with AI.',
    features: [
      'Custom prompt development',
      'Simple no-code workflow automation',
      'Up to 3 AI tool integrations',
      'Basic documentation',
      '5–7 days delivery',
      'Email support',
      'Single revision round',
      'Quick turnaround',
    ],
    popular: false,
  },
  {
    name: 'Professional',
    icon: Rocket,
    price: '$1,200',
    period: 'per project',
    description: 'For startups and growing businesses.',
    features: [
      'Advanced prompt engineering',
      'Multi-step no-code automation workflows',
      'AI agent setup (basic to intermediate)',
      'Up to 8 AI integrations',
      'Error handling & optimization',
      '2–3 week delivery',
      'Priority email support',
      '14-day revisions',
    ],
    popular: true,
  },
  {
    name: 'Enterprise',
    icon: Crown,
    price: 'Custom',
    period: 'Quote',
    description: 'For organizations exploring AI adoption.',
    features: [
      'AI workflow & automation strategy',
      'Custom no-code AI agents & systems',
      'Process documentation & SOPs',
      'Team handover & basic training',
      'Ongoing support (optional)',
      'Dedicated communication',
      'Flexible timeline',
      'Priority onboarding',
    ],
    popular: false,
    cta: 'Contact for Quote',
  },
];

export const ServicesSection = () => {
  return (
    <section id="services" className="py-24 relative">
      <div className="container mx-auto px-6">
        <AnimatedSection className="text-center mb-16">
          <p className="text-primary text-sm font-medium tracking-widest uppercase mb-6">
            Services
          </p>
          <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">
            Choose Your Plan
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Flexible pricing options tailored to your AI automation needs
          </p>
        </AnimatedSection>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto pt-4 items-stretch">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <AnimatedSection key={service.name} delay={index * 150} direction="scale" className="h-full">
                <div className={`relative h-full ${service.popular ? 'mt-2' : ''}`}>
                  {/* Popular Badge - Outside GlassCard */}
                  {service.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 px-4 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full shadow-[0_0_20px_hsl(var(--primary)/0.5)]">
                      Most Popular
                    </div>
                  )}
                  <GlassCard 
                    className={`p-8 h-full flex flex-col ${
                      service.popular ? 'border-primary/30' : ''
                    }`}
                  >

                  {/* Header */}
                  <div className="text-center mb-6">
                    <div className={`inline-flex items-center justify-center w-14 h-14 mb-4 rounded-2xl ${
                      service.popular 
                        ? 'bg-primary/20 text-primary' 
                        : 'bg-primary/10 text-primary'
                    }`}>
                      <IconComponent className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {service.name}
                    </h3>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-4xl font-bold text-foreground">
                        {service.price}
                      </span>
                      <span className="text-muted-foreground text-sm">
                        /{service.period}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-sm mt-3">
                      {service.description}
                    </p>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-8 flex-grow">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <GlassButton 
                    href="#contact" 
                    className={`w-full justify-center ${
                      service.popular 
                        ? 'bg-primary/20 border-primary/30' 
                        : ''
                    }`}
                  >
                    {service.cta || 'Get Started'}
                  </GlassButton>
                  </GlassCard>
                </div>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
      
      <div className="section-divider mt-24 max-w-4xl mx-auto" />
    </section>
  );
};
