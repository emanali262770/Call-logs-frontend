import { useState } from "react";
import { Phone, Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full bg-primary/95 backdrop-blur-md z-50 border-b border-white/10">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Phone className="w-6 h-6 text-secondary" />
            <span className="text-2xl font-bold text-white font-['Poppins']">CMS</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#product" className="text-white/80 hover:text-white transition-colors font-['Inter']">
              Product
            </a>
            <a href="#company" className="text-white/80 hover:text-white transition-colors font-['Inter']">
              Company
            </a>
            <a href="#legal" className="text-white/80 hover:text-white transition-colors font-['Inter']">
              Legal
            </a>
            <button className="bg-secondary hover:bg-secondary/90 text-white font-medium rounded-xl px-6 py-3 transition-all duration-200 hover:scale-105 active:scale-95">
              BuiltFree You!
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-4 border-t border-white/10">
            <a 
              href="#product" 
              className="block text-white/80 hover:text-white transition-colors font-['Inter'] py-3 px-2 rounded-lg hover:bg-white/5"
              onClick={() => setIsOpen(false)}
            >
              Product
            </a>
            <a 
              href="#company" 
              className="block text-white/80 hover:text-white transition-colors font-['Inter'] py-3 px-2 rounded-lg hover:bg-white/5"
              onClick={() => setIsOpen(false)}
            >
              Company
            </a>
            <a 
              href="#legal" 
              className="block text-white/80 hover:text-white transition-colors font-['Inter'] py-3 px-2 rounded-lg hover:bg-white/5"
              onClick={() => setIsOpen(false)}
            >
              Legal
            </a>
            <button className="w-full bg-secondary hover:bg-secondary/90 text-white font-medium rounded-xl py-3 px-4 transition-all duration-200 hover:scale-[1.02] active:scale-95 mt-2">
              BuiltFree You!
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
