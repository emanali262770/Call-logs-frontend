import { useEffect, useRef } from "react";

import { Phone, MessageSquare, Calendar, Users, UserCheck, FileText, Mail, Headphones, Zap, Target, TrendingUp } from "lucide-react";
import { gsap } from "gsap";
import heroImage from "../../assets/hero-dashboard.png";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate=useNavigate();
  const floatingIconsRef = useRef([]);
  const heroRef = useRef(null);

  useEffect(() => {
    // Animate hero content on load
    gsap.fromTo(
      heroRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
    );

    // Animate floating icons
    floatingIconsRef.current.forEach((icon, index) => {
      if (icon) {
        gsap.to(icon, {
          y: -20,
          duration: 2 + index * 0.5,
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut",
        });
      }
    });
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#0b2a6f] via-[#0b3dbd] to-[#1b4cff]"
>
      {/* Decorative gradient orbs */}
      <div className="absolute top-20 right-20 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 pt-32 pb-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Content */}
          <div ref={heroRef} className="text-white space-y-8">
            <h1 className="font-['Poppins'] text-5xl lg:text-6xl font-bold leading-tight">
              Simplify Your Customer Communication
            </h1>
            <p className="text-xl text-white/80 font-['Inter'] leading-relaxed">
              Manage calls, meetings, and follow-ups — all in one smart platform.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
               
                className="bg-secondary hover:bg-secondary/90 text-white font-semibold px-8 py-2 text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all"
              >
                Start Free Trial
              </button>
              <button
             onClick={()=>navigate('/login')}
                className="border-2 border-white/30 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 font-semibold px-8 py-2 text-lg rounded-2xl"
              >
                Book a Demo
              </button>
            </div>
          </div>

          {/* Right: Hero Image with floating icons */}
          <div className="relative">
            <div className="relative z-10">
              <img
                src={heroImage}
                alt="Call Logs Dashboard"
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
            </div>

            {/* Floating icons */}
            {/* Top right - Phone */}
            <div
              ref={(el) => (floatingIconsRef.current[0] = el)}
              className="absolute -top-6 right-8 bg-secondary/90 backdrop-blur-md p-3 rounded-xl shadow-2xl z-20"
            >
              <Phone className="w-6 h-6 text-white" />
            </div>
            
            {/* Left side - Message bubble */}
            <div
              ref={(el) => (floatingIconsRef.current[1] = el)}
              className="absolute top-20 -left-6 bg-secondary/90 backdrop-blur-md p-4 rounded-2xl shadow-2xl z-20"
            >
              <MessageSquare className="w-8 h-8 text-white" />
            </div>
            
            {/* Right side - Chat bubble */}
            <div
              ref={(el) => (floatingIconsRef.current[2] = el)}
              className="absolute top-1/3 -right-6 bg-secondary/90 backdrop-blur-md p-4 rounded-2xl shadow-2xl z-20"
            >
              <Mail className="w-8 h-8 text-white" />
            </div>
            
            {/* Bottom right - Calendar */}
            <div
              ref={(el) => (floatingIconsRef.current[3] = el)}
              className="absolute -bottom-4 right-12 bg-accent/90 backdrop-blur-md p-3 rounded-xl shadow-2xl z-20"
            >
              <Calendar className="w-6 h-6 text-white" />
            </div>
            
            {/* Left bottom - Customers icon */}
            <div
              ref={(el) => (floatingIconsRef.current[4] = el)}
              className="absolute bottom-12 -left-8 bg-accent/90 backdrop-blur-md p-3 rounded-xl shadow-2xl z-20"
            >
              <Users className="w-7 h-7 text-white" />
            </div>
            
            {/* Top left - Staff icon */}
            <div
              ref={(el) => (floatingIconsRef.current[5] = el)}
              className="absolute top-8 left-16 bg-primary/80 backdrop-blur-md p-2 rounded-lg shadow-xl z-20"
            >
              <UserCheck className="w-5 h-5 text-white" />
            </div>
            
            {/* Right bottom - Documents */}
            <div
              ref={(el) => (floatingIconsRef.current[6] = el)}
              className="absolute bottom-20 right-4 bg-primary/80 backdrop-blur-md p-2 rounded-lg shadow-xl z-20"
            >
              <FileText className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>

        {/* Large Feature Icons Section - Below the fold */}
        <div className="mt-32 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          {/* Call Management */}
          <div className="flex flex-col items-center text-center group">
            <div className="w-24 h-24 bg-secondary/20 backdrop-blur-md rounded-3xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-xl">
              <Phone className="w-12 h-12 text-white" />
            </div>
            <p className="text-white/90 font-semibold font-['Inter']">Call Management</p>
          </div>

          {/* Customer Support */}
          <div className="flex flex-col items-center text-center group">
            <div className="w-24 h-24 bg-accent/20 backdrop-blur-md rounded-3xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-xl">
              <Headphones className="w-12 h-12 text-white" />
            </div>
            <p className="text-white/90 font-semibold font-['Inter']">24/7 Support</p>
          </div>

          {/* Customer Analytics */}
          <div className="flex flex-col items-center text-center group">
            <div className="w-24 h-24 bg-secondary/20 backdrop-blur-md rounded-3xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-xl">
              <Target className="w-12 h-12 text-white" />
            </div>
            <p className="text-white/90 font-semibold font-['Inter']">Customer Insights</p>
          </div>

          {/* Performance */}
          <div className="flex flex-col items-center text-center group">
            <div className="w-24 h-24 bg-accent/20 backdrop-blur-md rounded-3xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-xl">
              <TrendingUp className="w-12 h-12 text-white" />
            </div>
            <p className="text-white/90 font-semibold font-['Inter']">Growth Tracking</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
