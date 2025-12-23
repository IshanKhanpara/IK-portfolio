import { useState } from 'react';
import { AnimatedSection } from './AnimatedSection';
import { GlassCard } from './GlassCard';
import { ArrowUpRight, Calendar, Clock, ChevronLeft, ChevronRight } from 'lucide-react';

const articles = [
  {
    title: 'The Future of Prompt Engineering in 2025',
    excerpt: 'Exploring advanced techniques for crafting effective prompts that unlock the full potential of large language models.',
    category: 'Prompt Engineering',
    date: 'Dec 15, 2024',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop',
  },
  {
    title: 'Building AI Agents That Actually Work',
    excerpt: 'A practical guide to designing autonomous AI agents for business process automation.',
    category: 'AI Agents',
    date: 'Dec 10, 2024',
    readTime: '8 min read',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&h=400&fit=crop',
  },
  {
    title: 'No-Code AI: Democratizing Automation',
    excerpt: 'How no-code platforms are making AI automation accessible to everyone, regardless of technical background.',
    category: 'No-Code',
    date: 'Dec 5, 2024',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop',
  },
  {
    title: 'Mastering Zapier, Make & n8n for Business',
    excerpt: 'A comprehensive comparison of top automation platforms and how to choose the right one for your workflow needs.',
    category: 'Automation Tools',
    date: 'Nov 28, 2024',
    readTime: '7 min read',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
  },
  {
    title: 'AI Image Generation: From Concept to Creation',
    excerpt: 'Learn visual prompting techniques for creating stunning AI-generated images with Midjourney, DALL-E, and Stable Diffusion.',
    category: 'AI Image Creation',
    date: 'Nov 22, 2024',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1547954575-855750c57bd3?w=600&h=400&fit=crop',
  },
  {
    title: 'Short-Form AI Video: The Complete Guide',
    excerpt: 'How to leverage AI tools for creating engaging short-form video content that captures attention in seconds.',
    category: 'AI Video',
    date: 'Nov 15, 2024',
    readTime: '9 min read',
    image: 'https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?w=600&h=400&fit=crop',
  },
  {
    title: 'GPT-4 vs Claude vs Gemini: Which AI to Choose?',
    excerpt: 'An in-depth comparison of leading LLMs and when to use each one for optimal results in different use cases.',
    category: 'AI Models',
    date: 'Nov 8, 2024',
    readTime: '10 min read',
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&h=400&fit=crop',
  },
  {
    title: 'Building Landing Pages with No-Code AI',
    excerpt: 'Step-by-step guide to creating high-converting landing pages using AI-powered no-code tools.',
    category: 'No-Code Development',
    date: 'Nov 1, 2024',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
  },
  {
    title: 'AI-Assisted Content Writing Workflows',
    excerpt: 'How to build efficient content pipelines that combine human creativity with AI-powered assistance.',
    category: 'Content Writing',
    date: 'Oct 25, 2024',
    readTime: '7 min read',
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&h=400&fit=crop',
  },
];

export const BlogSection = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const articlesPerPage = 3;
  const totalPages = Math.ceil(articles.length / articlesPerPage);
  
  const visibleArticles = articles.slice(
    currentPage * articlesPerPage,
    (currentPage + 1) * articlesPerPage
  );

  const goToPrev = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const goToNext = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  return (
    <section id="blog" className="py-24 relative">
      <div className="container mx-auto px-6">
        <AnimatedSection className="text-center mb-16">
          <p className="text-primary text-sm font-medium tracking-widest uppercase mb-6">
            Insights
          </p>
          <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">
            AI Insights & Articles
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Thoughts on AI automation, prompt engineering, and the future of work
          </p>
        </AnimatedSection>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {visibleArticles.map((article, index) => (
            <AnimatedSection key={article.title} delay={index * 150} direction="up">
              <GlassCard className="overflow-hidden group cursor-pointer h-full flex flex-col">
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-primary/20 backdrop-blur-sm text-primary text-xs font-medium rounded-full border border-primary/20">
                      {article.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-lg font-semibold text-foreground mb-3 group-hover:text-primary transition-colors duration-300 line-clamp-2">
                    {article.title}
                  </h3>
                  
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4 flex-grow line-clamp-3">
                    {article.excerpt}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {article.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {article.readTime}
                      </span>
                    </div>
                    
                    <ArrowUpRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>
              </GlassCard>
            </AnimatedSection>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-4 mt-10">
          <button
            onClick={goToPrev}
            className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors duration-300"
            aria-label="Previous articles"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          {/* Dots */}
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentPage
                    ? 'bg-primary w-6 shadow-[0_0_10px_hsl(var(--primary))]'
                    : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                }`}
                aria-label={`Go to page ${index + 1}`}
              />
            ))}
          </div>
          
          <button
            onClick={goToNext}
            className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors duration-300"
            aria-label="Next articles"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* View All Link */}
        <AnimatedSection delay={500} className="text-center mt-8">
          <a 
            href="#" 
            className="inline-flex items-center gap-2 text-primary hover:text-foreground transition-colors duration-300 group"
          >
            <span>View All Articles</span>
            <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </AnimatedSection>
      </div>
      
      <div className="section-divider mt-24 max-w-4xl mx-auto" />
    </section>
  );
};
