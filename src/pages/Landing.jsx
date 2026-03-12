import React from 'react'
import Navbar from '../components/Landing/Navbar'
import Hero from '../components/Landing/Hero'
import TrustedBy from '../components/Landing/TrustedBy'
import About from '../components/Landing/About'
import Industries from '../components/Landing/Industries'
import Features from '../components/Landing/Features'
import Process from '../components/Landing/Process'
import Testimonials from '../components/Landing/Testimonials'
import Contact from '../components/Landing/Contact'
import Footer from '../components/Landing/Footer'
import AIChatbot from '../components/AIChatbot'
const Landing = () => {
  return (
    <div className="min-h-screen relative">
      
      <Navbar />

      <main>
        <Hero />
        <TrustedBy />
        <About />
        <Industries />
        <Features />
        <Process />
        <Testimonials />
        <Contact />
      </main>

      <Footer />

      {/* Global Floating Chatbot */}
      <AIChatbot />

    </div>
  );
};

export default Landing;