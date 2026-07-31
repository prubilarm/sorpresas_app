import React from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { WhatIsSection } from './components/WhatIsSection';
import { WhatRecipientGetsSection } from './components/WhatRecipientGetsSection';
import { UseCasesSection } from './components/UseCasesSection';
import { GallerySection } from './components/GallerySection';
import { RealScreenshotsShowcase } from './components/RealScreenshotsShowcase';
import { HowItWorksSection } from './components/HowItWorksSection';
import { PricingSection } from './components/PricingSection';
import { ComparisonSection } from './components/ComparisonSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { FaqSection } from './components/FaqSection';
import { CtaSection } from './components/CtaSection';
import { Footer } from './components/Footer';

export const LandingView: React.FC = () => {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Sorpresas App - Experiencias Digitales Personalizadas con Código QR",
    "image": "http://localhost:3000/assets/landing/hero.png",
    "description": "Transformamos tus fotografías, videos y palabras en una experiencia digital única accesible mediante un código QR.",
    "brand": {
      "@type": "Brand",
      "name": "Sorpresas App"
    },
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "CLP",
      "lowPrice": "14990",
      "highPrice": "22990",
      "offerCount": "3"
    }
  };

  return (
    <HelmetProvider>
      <div className="min-h-screen bg-slate-950 font-sans selection:bg-pink-500 selection:text-white">
        <Helmet>
          <title>Sorpresas App | Regala una Experiencia Digital Inolvidable con QR</title>
          <meta name="description" content="Transformamos tus fotografías, videos y palabras en una obra de arte digital única accesible mediante un código QR. El regalo emocional perfecto para aniversarios, cumpleaños y momentos especiales." />
          <meta name="keywords" content="regalos digitales, codigo qr regalos, aniversario, sorpresas románticas, regalos personalizados chile" />
          
          {/* Open Graph / Facebook */}
          <meta property="og:type" content="website" />
          <meta property="og:title" content="Sorpresas App | Regala una Experiencia Digital Inolvidable" />
          <meta property="og:description" content="Transformamos tus fotos y recuerdos en una página interactiva única para regalar mediante un Código QR." />
          <meta property="og:image" content="http://localhost:3000/assets/landing/hero.png" />
          
          {/* Twitter */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Sorpresas App | Regala una Experiencia Digital Inolvidable" />
          <meta name="twitter:description" content="Transformamos tus fotos y recuerdos en una página interactiva única para regalar mediante un Código QR." />

          {/* JSON-LD Schema.org for SEO */}
          <script type="application/ld+json">
            {JSON.stringify(schemaData)}
          </script>
        </Helmet>

        <Navbar />
        <main>
          <HeroSection />
          <WhatIsSection />
          <WhatRecipientGetsSection />
          <UseCasesSection />
          <RealScreenshotsShowcase />
          <GallerySection />
          <HowItWorksSection />
          <PricingSection />
          <ComparisonSection />
          <TestimonialsSection />
          <FaqSection />
          <CtaSection />
        </main>
        <Footer />
      </div>
    </HelmetProvider>
  );
};
