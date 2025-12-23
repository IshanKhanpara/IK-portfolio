import { useState } from 'react';
import { AnimatedSection } from './AnimatedSection';
import { GlassButton } from './GlassButton';
import { Mail, Linkedin, Phone, Send } from 'lucide-react';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { useToast } from '@/hooks/use-toast';

export const ContactSection = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast({
        title: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Message sent!",
      description: "Thank you for reaching out. I'll get back to you soon."
    });
    
    setFormData({ name: '', email: '', message: '' });
    setIsSubmitting(false);
  };

  return (
    <section id="contact" className="py-24 relative">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <AnimatedSection delay={0}>
            <p className="text-primary text-sm font-medium tracking-widest uppercase mb-6">
              Contact
            </p>
          </AnimatedSection>
          
          <AnimatedSection delay={100} direction="scale">
            <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-6">
              Let's Build Something Together
            </h2>
          </AnimatedSection>
          
          <AnimatedSection delay={200}>
            <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
              Open to collaborations, contracts, and long-term AI projects. 
              If you're looking to harness AI for your business, I'd love to hear from you.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center text-muted-foreground">
              <a href="tel:+917016637706" className="flex items-center gap-2 hover:text-primary transition-colors">
                <Phone className="w-4 h-4" />
                +91 7016637706
              </a>
              <span className="hidden sm:block">•</span>
              <a href="mailto:ishankhanpara99@gmail.com" className="flex items-center gap-2 hover:text-primary transition-colors">
                <Mail className="w-4 h-4" />
                ishankhanpara99@gmail.com
              </a>
            </div>
          </AnimatedSection>
        </div>

        <AnimatedSection delay={300} direction="up">
          <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-6">
            <div className="backdrop-blur-xl bg-card/30 border border-border/50 rounded-2xl p-6 md:p-8 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-background/50 border-border/50 focus:border-primary/50"
                  maxLength={100}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-background/50 border-border/50 focus:border-primary/50"
                  maxLength={255}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message" className="text-foreground">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Tell me about your project..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="bg-background/50 border-border/50 focus:border-primary/50 min-h-[120px] resize-none"
                  maxLength={1000}
                />
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>Sending...</>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Message
                  </>
                )}
              </button>
            </div>
          </form>
        </AnimatedSection>

        <AnimatedSection delay={400} direction="up">
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <GlassButton href="mailto:work.ishan.khanpara@gmail.com" className="justify-center">
              <Mail className="w-4 h-4" />
              Work Email
            </GlassButton>
            
            <GlassButton href="https://in.linkedin.com/in/ishan-khanpara-68aa38285" className="justify-center">
              <Linkedin className="w-4 h-4" />
              LinkedIn
            </GlassButton>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};
