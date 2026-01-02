import { useState } from "react";
import { toast } from "sonner";
import { Mail, Calendar } from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Thank you! We'll be in touch soon.");
    setFormData({ name: "", company: "", email: "", message: "" });
  };

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* LEFT – FORM */}
          <div>
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4 font-['Poppins']">
              Ready to Get Started?
            </h2>

            <p className="text-slate-500 text-lg mb-10 max-w-xl font-['Inter']">
              Book a demo and see how CMS can transform your communication workflow.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
              <input
                type="text"
                placeholder="Your Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                className="h-14 w-full rounded-xl border border-slate-200 px-5 text-slate-700
                placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="text"
                placeholder="Company Name"
                value={formData.company}
                onChange={(e) =>
                  setFormData({ ...formData, company: e.target.value })
                }
                required
                className="h-14 w-full rounded-xl border border-slate-200 px-5 text-slate-700
                placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                className="h-14 w-full rounded-xl border border-slate-200 px-5 text-slate-700
                placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <textarea
                placeholder="Tell us about your needs..."
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                required
                className="min-h-36 w-full rounded-xl border border-slate-200 px-5 py-4
                text-slate-700 placeholder-slate-400 focus:outline-none
                focus:ring-2 focus:ring-blue-500"
              />

              <button
                type="submit"
                className="
                  w-full h-14 rounded-xl text-white font-semibold text-lg
                  bg-gradient-to-r from-indigo-500 to-blue-600
                  shadow-lg shadow-blue-500/30
                  hover:opacity-95 transition
                "
              >
                Book a Meeting
              </button>
            </form>
          </div>

          {/* RIGHT – ILLUSTRATION */}
          <div className="hidden lg:flex flex-col items-center justify-center">
            <div className="relative flex items-center justify-center">

              {/* Mail Icon */}
              <div className="w-44 h-44 rounded-full flex items-center justify-center">
                <Mail className="w-28 h-28 text-indigo-500" />
              </div>

              {/* Calendar Floating */}
              <div className="absolute -top-6 -right-6 bg-teal-400 p-4 rounded-2xl shadow-xl">
                <Calendar className="w-7 h-7 text-white" />
              </div>
            </div>

            <div className="text-center mt-8">
              <p className="text-2xl font-bold text-slate-900 font-['Poppins'] mb-1">
                Schedule a Demo
              </p>
              <p className="text-slate-500 font-['Inter']">
                See CMS in action
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Contact;
