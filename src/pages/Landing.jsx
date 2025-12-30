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

const Landing = () => {
  return (
    <div className="min-h-screen">
      <Navbar/>
      <Hero/>
      <TrustedBy/>
      <About/>
      <Industries/>
      <Features/>
      <Process/>
      <Testimonials/>
      <Contact/>
      <Footer/>
    </div>
  )
}

export default Landing
