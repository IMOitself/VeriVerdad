import Navbar from '../components/shared/Navbar';
import Hero from '../components/landing/Hero';
import Features from '../components/landing/Features';
import Pillars from '../components/landing/Pillars';
import Stats from '../components/landing/Stats';
import HowItWorks from '../components/landing/HowItWorks';
import FAQ from '../components/landing/FAQ';
import CTA from '../components/landing/CTA';
import Footer from '../components/landing/Footer';
import './Landing.css';

export default function Landing() {
  return (
    <div className="landing-page">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Pillars />
        <Stats />
        <HowItWorks />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
