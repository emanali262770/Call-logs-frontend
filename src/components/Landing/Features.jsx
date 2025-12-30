import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Phone,
  Bot,
  Calendar,
  BarChart3,
  Users,
  FolderOpen,
  Bell,
  Cloud,
  Search,
  Share2,
  TrendingUp,
  ShoppingCart,
  Code,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const Features = () => {
  const cardsRef = useRef([]);

  useEffect(() => {
    cardsRef.current.forEach((card, index) => {
      if (card) {
        gsap.fromTo(
          card,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            delay: index * 0.1,
            scrollTrigger: {
              trigger: card,
              start: "top 90%",
            },
          }
        );
      }
    });
  }, []);

  const features = [
    {
      icon: Phone,
      title: "Call & Meeting Management",
      description: "Organize and track all your communication effortlessly",
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: Bot,
      title: "AI ChatBot Integration",
      description: "Automate responses and improve customer engagement",
      color: "bg-amber-100 text-amber-600",
    },
    {
      icon: Calendar,
      title: "Calendar & Reminders",
      description: "Never miss an important meeting or follow-up",
      color: "bg-purple-100 text-purple-600",
    },
    {
      icon: BarChart3,
      title: "Reports & Analytics",
      description: "Gain insights from comprehensive data analysis",
      color: "bg-cyan-100 text-cyan-600",
    },
    {
      icon: Users,
      title: "Staff & Role Control",
      description: "Manage team permissions and access levels",
      color: "bg-green-100 text-green-600",
    },
    {
      icon: FolderOpen,
      title: "Customer CRM Profiles",
      description: "Centralized customer information and history",
      color: "bg-rose-100 text-rose-600",
    },
    {
      icon: Bell,
      title: "Real-Time Notifications",
      description: "Stay updated with instant alerts and updates",
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      icon: Cloud,
      title: "Cloud Storage",
      description: "Secure file management with Cloudinary integration",
      color: "bg-indigo-100 text-indigo-600",
    },
    {
      icon: Search,
      title: "Search Engine Marketing",
      description: "Optimize your online presence and drive targeted traffic",
      color: "bg-teal-100 text-teal-600",
    },
    {
      icon: Share2,
      title: "Social Media Management",
      description: "Manage and grow your social media presence effectively",
      color: "bg-pink-100 text-pink-600",
    },
    {
      icon: TrendingUp,
      title: "Digital Marketing",
      description: "Comprehensive digital strategies to grow your business",
      color: "bg-orange-100 text-orange-600",
    },
    {
      icon: ShoppingCart,
      title: "E-commerce Solutions",
      description: "Build and manage your online store seamlessly",
      color: "bg-emerald-100 text-emerald-600",
    },
    {
      icon: Code,
      title: "Software Development",
      description: "Custom software solutions tailored to your needs",
      color: "bg-slate-100 text-slate-600",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-muted/30 to-white">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl lg:text-5xl font-bold text-center mb-4 font-['Poppins'] text-primary">
          Core Features
        </h2>
        <p className="text-center text-muted-foreground text-lg mb-16 max-w-2xl mx-auto font-['Inter']">
          Everything you need to streamline customer communication
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                ref={(el) => (cardsRef.current[index] = el)}
                className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-border/50"
              >
                <div className={`${feature.color} w-14 h-14 rounded-xl flex items-center justify-center mb-4`}>
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-2 font-['Poppins'] text-primary">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground font-['Inter'] text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
