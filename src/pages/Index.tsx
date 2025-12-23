import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { HeroSection } from '@/components/HeroSection';
import { AboutSection } from '@/components/AboutSection';
import { ExpertiseSection } from '@/components/ExpertiseSection';
import { ServicesSection } from '@/components/ServicesSection';
import { WorkSection } from '@/components/WorkSection';
import { SkillsSection } from '@/components/SkillsSection';
import { BlogSection } from '@/components/BlogSection';
import { ContactSection } from '@/components/ContactSection';
import { Footer } from '@/components/Footer';
import { GlobalBackground } from '@/components/GlobalBackground';
import { ScrollToTop } from '@/components/ScrollToTop';
import { LoadingScreen } from '@/components/LoadingScreen';
import { PreloaderScreen } from '@/components/PreloaderScreen';
import { CustomCursor } from '@/components/CustomCursor';
import { MagneticParticles } from '@/components/MagneticParticles';
import { ScrollProgressIndicator } from '@/components/ScrollProgressIndicator';
import { FloatingTOC } from '@/components/FloatingTOC';

const Index = () => {
  const [preloading, setPreloading] = useState(true);
  const [loading, setLoading] = useState(true);

  return (
    <>
      <CustomCursor />
      <MagneticParticles />
      <ScrollProgressIndicator />
      <FloatingTOC />
      
      {preloading && <PreloaderScreen onComplete={() => setPreloading(false)} />}
      {!preloading && loading && <LoadingScreen onComplete={() => setLoading(false)} />}
      
      <div className={`min-h-screen text-foreground overflow-x-hidden relative neural-page-bg transition-opacity duration-500 ${loading ? 'opacity-0' : 'opacity-100'}`}>
        {/* Global Neural Background */}
        <GlobalBackground />
        
        <Navigation />
        <main className="relative z-10">
          <section id="hero">
            <HeroSection />
          </section>
          <AboutSection />
          <section id="expertise">
            <ExpertiseSection />
          </section>
          <ServicesSection />
          <WorkSection />
          <SkillsSection />
          <BlogSection />
          <ContactSection />
        </main>
        <Footer />
        <ScrollToTop />
      </div>
    </>
  );
};

export default Index;
