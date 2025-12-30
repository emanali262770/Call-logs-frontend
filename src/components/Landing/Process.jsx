import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Search,
  Clipboard,
  Rocket,
  TrendingUp,
  Headphones,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const Process = () => {
  const timelineRef = useRef(null);

  useEffect(() => {
    if (!timelineRef.current) return;

    const items = timelineRef.current.querySelectorAll(".process-item");

    items.forEach((item, index) => {
      gsap.fromTo(
        item,
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          delay: index * 0.2,
          scrollTrigger: {
            trigger: item,
            start: "top 85%",
          },
        }
      );
    });
  }, []);

  const steps = [
    {
      icon: Search,
      title: "Discovery",
      description:
        "We analyze your communication needs and current workflow challenges",
    },
    {
      icon: Clipboard,
      title: "Planning",
      description:
        "Design a customized solution that fits your business processes",
    },
    {
      icon: Rocket,
      title: "Implementation",
      description:
        "Seamless integration and deployment with minimal disruption",
    },
    {
      icon: TrendingUp,
      title: "Optimization",
      description:
        "Continuous improvement based on performance metrics",
    },
    {
      icon: Headphones,
      title: "Ongoing Support",
      description: "24/7 assistance to ensure smooth operations",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        
        {/* Heading */}
        <h2 className="text-4xl lg:text-5xl font-bold text-center mb-4 font-['Poppins'] text-slate-900">
          Our Process
        </h2>

        <p className="text-center text-slate-500 text-lg mb-16 max-w-2xl mx-auto font-['Inter']">
          A proven approach to transform your communication workflow
        </p>

        {/* Timeline */}
        <div ref={timelineRef} className="max-w-3xl mx-auto space-y-10">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div
                key={index}
                className="process-item flex gap-6 items-start"
              >
                {/* Icon + Line */}
                <div className="relative flex-shrink-0">
                  
                  {/* Icon Circle */}
                  <div
                    className="
                      w-16 h-16 rounded-full
                      bg-gradient-to-br from-blue-500 to-indigo-600
                      flex items-center justify-center
                      shadow-lg shadow-blue-500/30
                    "
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Vertical Line */}
                  {index < steps.length - 1 && (
                    <div
                      className="
                        absolute top-16 left-1/2 -translate-x-1/2
                        w-0.5 h-12
                        bg-gradient-to-b from-blue-400 to-transparent
                      "
                    />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 pt-2">
                  <h3 className="text-2xl font-bold mb-2 font-['Poppins'] text-slate-900">
                    {step.title}
                  </h3>
                  <p className="text-slate-500 font-['Inter']">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Process;
