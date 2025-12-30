import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CheckCircle } from "lucide-react";
import dashboardImage from "@/assets/dashboard-preview.png";

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    if (sectionRef.current) {
      gsap.fromTo(
        sectionRef.current.children,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.2,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          },
        }
      );
    }
  }, []);

  const features = [
    "Centralized meeting scheduling",
    "Automatic customer follow-up tracking",
    "Real-time product inquiry responses",
    "Integrated analytics dashboard",
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-muted/30">
      <div className="container mx-auto px-6">
        <div ref={sectionRef}>
          <h2 className="text-4xl lg:text-5xl font-bold text-center mb-4 font-['Poppins'] text-primary">
            A Unified Platform for Communication & Growth
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-16 max-w-2xl mx-auto font-['Inter']">
            Everything you need to manage customer interactions in one place
          </p>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <img
                src={dashboardImage}
                alt="Call Logs Dashboard"
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
            </div>

            <div className="order-1 lg:order-2 space-y-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-secondary flex-shrink-0 mt-1" />
                  <p className="text-lg text-foreground font-['Inter']">{feature}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
