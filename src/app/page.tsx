import { ScrollRoute } from '@/components/landing/LandingMotion';
import Splash from '@/components/landing/Splash';
import { SiteHeader } from '@/components/landing/sections/SiteHeader';
import { Hero } from '@/components/landing/sections/Hero';
import { FeaturesSection } from '@/components/landing/sections/FeaturesSection';
import { PricingSection } from '@/components/landing/sections/PricingSection';
import { CtaSection } from '@/components/landing/sections/CtaSection';
import { SiteFooter } from '@/components/landing/sections/SiteFooter';

export default function LandingPage() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--ds-bg)' }}>
      <Splash />
      <ScrollRoute />
      <SiteHeader />
      <main>
        <Hero />
        <FeaturesSection />
        <PricingSection />
        <CtaSection />
      </main>
      <SiteFooter />
    </div>
  );
}
