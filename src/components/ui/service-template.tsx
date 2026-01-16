import type { FC, PropsWithChildren } from 'hono/jsx';
import { Layout } from './layout';
import { CTASection } from './cta-section';

interface ServicePageProps extends PropsWithChildren {
  title: string;
  subtitle: string;
  heroImage: string;
  features: string[];
  benefits: { title: string; description: string; icon: any }[];
}

export const ServiceTemplate: FC<ServicePageProps> = ({ 
  title, 
  subtitle, 
  heroImage, 
  features, 
  benefits,
  children 
}) => (
  <Layout title={`${title} | Exterior Group`}>
    {/* Sub-page Hero */}
    <section class="relative py-24 bg-brand-900 overflow-hidden">
      <div class="absolute inset-0 opacity-30">
        <img src={heroImage} alt={title} class="w-full h-full object-cover" />
        <div class="absolute inset-0 bg-gradient-to-t from-brand-900 via-brand-900/60 to-transparent"></div>
      </div>
      <div class="container relative z-10 text-center">
        <h1 class="text-5xl md:text-6xl font-heading font-extrabold text-white mb-6">{title}</h1>
        <p class="text-xl text-white/80 max-w-2xl mx-auto">{subtitle}</p>
      </div>
    </section>

    {/* Main Content */}
    <section class="py-24 bg-white">
      <div class="container">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div class="space-y-8">
            <h2 class="text-4xl font-heading font-bold text-brand-900">Professional {title}</h2>
            <div class="prose prose-lg text-slate-600">
              {children}
            </div>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              {features.map(feature => (
                <div class="flex items-center gap-3">
                  <div class="flex-shrink-0 w-6 h-6 rounded-full bg-brand-50 flex items-center justify-center text-brand-500">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                  </div>
                  <span class="font-semibold text-brand-900">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div class="bg-slate-50 rounded-3xl p-8 md:p-12 border border-slate-100 shadow-sm">
            <h3 class="text-2xl font-heading font-bold text-brand-900 mb-8 text-center">Why Choose Us?</h3>
            <div class="space-y-8">
              {benefits.map(benefit => (
                <div class="flex gap-6">
                  <div class="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center flex-shrink-0 text-brand-500">
                    {benefit.icon}
                  </div>
                  <div>
                    <h4 class="font-bold text-brand-900 mb-1">{benefit.title}</h4>
                    <p class="text-slate-500 text-sm leading-relaxed">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div class="mt-12">
              <a href="/enquire" class="btn-primary w-full py-4 text-lg">
                Get a Free Quote
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <CTASection />
  </Layout>
);
