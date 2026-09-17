export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="footer" className="bg-celebrate-navy text-celebrate-cream py-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Col */}
          <div className="col-span-1 md:col-span-1">
            <h3 className="font-display text-3xl mb-4 text-white">Celebrate</h3>
            <p className="text-sm text-celebrate-sage/80 mb-6 max-w-xs">
              The AI-powered Operating System unifying clients, event management teams, and event professionals.
            </p>
          </div>

          {/* Links Col 1 */}
          <div>
            <h4 className="font-bold text-white mb-4 uppercase tracking-wider text-xs">Product</h4>
            <ul className="space-y-3">
              <li><a href="#about" className="text-sm text-celebrate-sage hover:text-white transition-colors">About</a></li>
              <li><a href="#how-it-works" className="text-sm text-celebrate-sage hover:text-white transition-colors">How It Works</a></li>
              <li><a href="#clients" className="text-sm text-celebrate-sage hover:text-white transition-colors">For Clients</a></li>
              <li><a href="#planners" className="text-sm text-celebrate-sage hover:text-white transition-colors">For Planners</a></li>
            </ul>
          </div>

          {/* Links Col 2 */}
          <div>
            <h4 className="font-bold text-white mb-4 uppercase tracking-wider text-xs">Company</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm text-celebrate-sage hover:text-white transition-colors">Contact</a></li>
              <li><a href="#" className="text-sm text-celebrate-sage hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-sm text-celebrate-sage hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>

          {/* Action Col */}
          <div>
            <h4 className="font-bold text-white mb-4 uppercase tracking-wider text-xs">Get Started</h4>
            <div className="flex flex-col gap-3">
              <button className="bg-celebrate-terracotta text-white px-4 py-2 rounded text-sm font-medium hover:bg-celebrate-terracotta/90 transition-colors w-full sm:w-auto text-left flex justify-center items-center">
                Sign In
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-celebrate-sage/20 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-celebrate-sage/60">
            &copy; {currentYear} Celebrate. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
