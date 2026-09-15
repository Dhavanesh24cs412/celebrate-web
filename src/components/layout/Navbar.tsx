import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "About", href: "#about" },
    { name: "How It Works", href: "#how-it-works" },
    { name: "For Clients", href: "#clients" },
    { name: "For Planners", href: "#planners" },
  ];

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        isScrolled 
          ? "bg-celebrate-navy/95 backdrop-blur-md shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] py-4" 
          : "bg-celebrate-navy/0 py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 z-50">
          <span 
            className={`text-2xl tracking-tight transition-colors duration-500 ${isScrolled ? "text-celebrate-cream" : "text-celebrate-navy"}`}
            style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}
          >
            Celebrate
          </span>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={`text-sm font-medium transition-colors duration-500 ${
                isScrolled 
                  ? "text-celebrate-cream/80 hover:text-white" 
                  : "text-celebrate-navy/80 hover:text-celebrate-terracotta"
              }`}
            >
              {link.name}
            </a>
          ))}
          
          <a href="/auth" className={`h-10 px-5 inline-flex items-center justify-center rounded-xl text-sm font-medium transition-colors duration-500 ${isScrolled ? "bg-celebrate-cream text-celebrate-navy hover:bg-white" : "bg-celebrate-navy text-white hover:bg-celebrate-navy/90"}`}>
            Login | Signup
          </a>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className={`md:hidden z-50 p-2 transition-colors duration-500 ${
            isScrolled || mobileMenuOpen ? "text-celebrate-cream" : "text-celebrate-navy"
          }`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-0 bg-celebrate-navy z-40 transform transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        } md:hidden`}
      >
        <div className="flex flex-col h-full pt-24 px-6 pb-12 gap-8">
          <div className="flex flex-col gap-6">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-2xl font-display text-celebrate-cream"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="mt-auto flex flex-col gap-6 pt-8 border-t border-celebrate-cream/10">
            <a href="/auth" className="text-2xl font-display text-celebrate-cream" onClick={() => setMobileMenuOpen(false)}>
              Login/Signup
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
