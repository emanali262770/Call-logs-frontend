import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Building2, DollarSign, Heart, GraduationCap } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const Industries = () => {
  const cardsRef = useRef([]);

  useEffect(() => {
    cardsRef.current.forEach((card) => {
      if (card) {
        gsap.fromTo(
          card,
          { opacity: 0, y: 30, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
            },
          }
        );
      }
    });
  }, []);

  const industries = [
    {
      icon: Building2,
      title: "B2B SaaS",
      description: "Automate client calls and meetings",
      gradient: "from-blue-500/90 to-cyan-500/90",
    },
    {
      icon: DollarSign,
      title: "Fintech",
      description: "Manage customer discussions securely",
      gradient: "from-emerald-500/90 to-teal-500/90",
    },
    {
      icon: Heart,
      title: "HealthTech",
      description: "Simplify patient or client communication",
      gradient: "from-rose-500/90 to-pink-500/90",
    },
    {
      icon: GraduationCap,
      title: "EdTech",
      description: "Track student or partner follow-ups",
      gradient: "from-violet-500/90 to-purple-500/90",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl lg:text-5xl font-bold text-center mb-4 font-['Poppins'] text-primary">
          Industries We Serve
        </h2>
        <p className="text-center text-muted-foreground text-lg mb-16 max-w-2xl mx-auto font-['Inter']">
          Tailored solutions for diverse business needs
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {industries.map((industry, index) => {
            const Icon = industry.icon;
            return (
              <div
                key={index}
                ref={(el) => (cardsRef.current[index] = el)}
                className={`relative p-8 rounded-2xl bg-gradient-to-br ${industry.gradient} text-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group overflow-hidden`}
              >
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
                <div className="relative z-10">
                  <Icon className="w-12 h-12 mb-4" />
                  <h3 className="text-2xl font-bold mb-2 font-['Poppins']">{industry.title}</h3>
                  <p className="text-white/90 font-['Inter']">{industry.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Industries;
