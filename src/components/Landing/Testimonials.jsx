import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Quote } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const Testimonials = () => {
  const cardsRef = useRef([]);

  useEffect(() => {
    cardsRef.current.forEach((card) => {
      if (card) {
        gsap.fromTo(
          card,
          { opacity: 0, scale: 0.9 },
          {
            opacity: 1,
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

  const testimonials = [
    {
      quote: "CMS has transformed our communication process. The dashboard is intuitive and the AI features save us hours every week.",
      author: "Ahsan Malik",
      role: "Sales Manager @ Hashlogics",
      avatar: "AM",
    },
    {
      quote: "The best investment we've made for our customer support team. Real-time notifications keep us on top of every interaction.",
      author: "Sarah Chen",
      role: "Customer Success Lead @ TechCorp",
      avatar: "SC",
    },
    {
      quote: "Integration was seamless and the ROI was immediate. Our team collaboration has improved dramatically.",
      author: "Michael Rodriguez",
      role: "Operations Director @ FinanceHub",
      avatar: "MR",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-muted/30">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl lg:text-5xl font-bold text-center mb-4 font-['Poppins'] text-primary">
          What Our Clients Say
        </h2>
        <p className="text-center text-muted-foreground text-lg mb-16 max-w-2xl mx-auto font-['Inter']">
          Trusted by teams worldwide
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              ref={(el) => (cardsRef.current[index] = el)}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 relative"
            >
              <Quote className="w-10 h-10 text-accent/20 absolute top-4 right-4" />
              <p className="text-foreground font-['Inter'] mb-6 leading-relaxed">
                "{testimonial.quote}"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-bold text-primary font-['Inter']">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground font-['Inter']">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
