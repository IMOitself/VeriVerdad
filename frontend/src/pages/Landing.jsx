import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Pillars from '../components/Pillars';
import Stats from '../components/Stats';
import HowItWorks from '../components/HowItWorks';
import FAQ from '../components/FAQ';
import CTA from '../components/CTA';
import Footer from '../components/Footer';
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
