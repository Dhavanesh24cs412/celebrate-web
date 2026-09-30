import { Search, Bell, Home, Zap, Layers, User, ChevronRight, CheckCircle2, Clock, MapPin, Users, Activity, FileText, CreditCard, Calendar } from "lucide-react";

export function PlannerDashboardMockup() {
  return (
    <div className="w-full max-w-[640px] bg-[#0c1f33] rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex relative z-10 text-white font-sans text-sm mx-auto">
      
      {/* Sidebar */}
      <div className="w-16 md:w-[170px] bg-[#0a1829] flex flex-col border-r border-white/5 shrink-0">
        <div className="p-4 md:p-6 flex justify-center md:justify-start">
          <h2 className="font-display text-xl md:text-2xl text-white hidden md:block">Celebrate</h2>
          <h2 className="font-display text-xl text-white md:hidden">C</h2>
        </div>
        
        <nav className="flex-1 px-2 md:px-4 space-y-1.5 mt-2">
          <a href="#" className="flex items-center justify-center md:justify-start gap-3 px-2 md:px-4 py-2.5 bg-white/10 rounded-lg text-white font-medium">
            <Home size={16} />
            <span className="hidden md:block text-sm">Home</span>
          </a>
          <a href="#" className="flex items-center justify-center md:justify-start gap-3 px-2 md:px-4 py-2.5 text-white/60 hover:bg-white/5 rounded-lg">
            <Zap size={16} />
            <span className="hidden md:block text-sm">Leads</span>
            <span className="hidden md:block ml-auto bg-celebrate-terracotta/20 text-celebrate-terracotta text-[10px] font-bold px-1.5 py-0.5 rounded-full">3</span>
          </a>
          <a href="#" className="flex items-center justify-center md:justify-start gap-3 px-2 md:px-4 py-2.5 text-white/60 hover:bg-white/5 rounded-lg">
            <Layers size={16} />
            <span className="hidden md:block text-sm">Overlays</span>
          </a>
          <a href="#" className="flex items-center justify-center md:justify-start gap-3 px-2 md:px-4 py-2.5 text-white/60 hover:bg-white/5 rounded-lg">
            <User size={16} />
            <span className="hidden md:block text-sm">Profile</span>
          </a>
        </nav>
        
        <div className="p-3 md:p-4 border-t border-white/5 mt-auto">
          <div className="flex items-center justify-center md:justify-start gap-3 md:px-2">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-xs text-white shrink-0">
              RP
            </div>
            <div className="overflow-hidden hidden md:block">
              <div className="font-medium text-white text-xs truncate">Rohit Planner</div>
              <div className="text-[10px] text-white/50 truncate hover:text-white/80 cursor-pointer">View Profile</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-[#0c1f33] min-w-0">
        {/* Top Header */}
        <div className="h-14 border-b border-white/5 flex items-center justify-between px-4 md:px-6 shrink-0">
          <div className="relative w-full max-w-[200px] hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={14} />
            <div className="w-full bg-white/5 border border-white/10 rounded-full py-1.5 pl-9 pr-4 text-xs text-white/50">
              Search opportunities...
            </div>
          </div>
          <div className="sm:hidden text-white/50 text-xs font-medium">Home</div>
          <button className="relative p-2 text-white/50 ml-auto">
            <Bell size={16} />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-celebrate-terracotta rounded-full"></span>
          </button>
        </div>
        
        {/* Dashboard Content - No internal scrolling */}
        <div className="p-4 md:p-6 flex flex-col gap-6">
          
          {/* Marketplace Banner */}
          <div className="relative w-full bg-celebrate-cream rounded-xl overflow-hidden flex shadow-lg shrink-0 min-h-[160px]">
            <div className="w-[65%] sm:w-[55%] p-4 sm:p-6 flex flex-col justify-center relative z-10">
              <h3 className="font-display text-xl sm:text-2xl text-celebrate-navy mb-2 leading-tight">Find your next perfect event.</h3>
              <p className="text-[10px] sm:text-xs text-celebrate-navy/70 mb-4 max-w-[220px] leading-snug">Explore new event opportunities from clients looking for planners like you.</p>
              <div className="bg-celebrate-navy text-white text-[10px] sm:text-[11px] font-medium px-3 sm:px-4 py-2 rounded-lg w-fit flex items-center">
                Browse Marketplace <ChevronRight size={14} className="ml-1" />
              </div>
            </div>
            <div className="absolute right-0 top-0 bottom-0 w-[55%] pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-r from-celebrate-cream via-celebrate-cream/60 to-transparent z-10"></div>
              <img src="/images/driftwall/wedding-2.webp" alt="Wedding Event" className="w-full h-full object-cover" />
            </div>
          </div>
          
          {/* Active Event CRM */}
          <div className="shrink-0 flex flex-col">
            <h4 className="font-display text-lg text-white mb-3">Your Active Events</h4>
            <div className="w-full bg-white/5 border border-white/10 rounded-xl p-4 md:p-5 flex flex-col gap-4">
              <div className="flex items-start gap-4">
                <img src="/images/driftwall/reception-1.webp" alt="Mehta Wedding" className="hidden sm:block w-20 h-20 rounded-lg object-cover shadow-md shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-2">
                    <h5 className="font-display text-lg text-white truncate">Mehta Wedding</h5>
                    <span className="bg-celebrate-sage/20 text-celebrate-sage text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shrink-0">In Progress</span>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-white/50">
                    <div className="flex items-center gap-1.5 shrink-0"><Calendar size={12} /> Dec 14, 2025</div>
                    <div className="flex items-center gap-1.5 shrink-0"><MapPin size={12} /> Chennai</div>
                    <div className="flex items-center gap-1.5 shrink-0"><Users size={12} /> 200 Guests</div>
                  </div>
                </div>
              </div>
              
              {/* Workflow Tracker */}
              <div className="flex items-center justify-between w-full overflow-hidden mt-1 gap-1">
                <div className="flex items-center gap-1.5 md:gap-2 shrink-0">
                  <div className="flex items-center justify-center w-5 h-5 rounded-full bg-white text-[#0c1f33]"><CheckCircle2 size={12} /></div>
                  <div className="hidden sm:block">
                    <div className="text-[11px] font-medium text-white leading-none">Planning</div>
                    <div className="text-[9px] text-white/40 mt-0.5">Completed</div>
                  </div>
                </div>
                <div className="h-px flex-1 bg-white/20 mx-1 min-w-[8px]"></div>
                
                <div className="flex items-center gap-1.5 md:gap-2 shrink-0">
                  <div className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-white text-white"><Clock size={10} /></div>
                  <div className="hidden sm:block">
                    <div className="text-[11px] font-medium text-white leading-none">Vendors</div>
                    <div className="text-[9px] text-white/80 mt-0.5">In Progress</div>
                  </div>
                </div>
                <div className="h-px flex-1 bg-white/20 mx-1 min-w-[8px]"></div>
                
                <div className="flex items-center gap-1.5 md:gap-2 opacity-50 shrink-0">
                  <div className="flex items-center justify-center w-5 h-5 rounded-full border border-white/30 text-white/30"><CreditCard size={10} /></div>
                  <div className="hidden sm:block">
                    <div className="text-[11px] font-medium text-white leading-none">Payments</div>
                    <div className="text-[9px] text-white/50 mt-0.5">Pending</div>
                  </div>
                </div>
                <div className="h-px flex-1 bg-white/10 mx-1 min-w-[8px]"></div>
                
                <div className="flex items-center gap-1.5 md:gap-2 opacity-30 shrink-0">
                  <div className="flex items-center justify-center w-5 h-5 rounded-full border border-white/30 text-white/30"><MapPin size={10} /></div>
                  <div className="hidden sm:block">
                    <div className="text-[11px] font-medium text-white leading-none">Event Day</div>
                    <div className="text-[9px] text-white/50 mt-0.5">Upcoming</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Summary Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 shrink-0 pb-4">
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col justify-center min-w-0">
              <Activity size={14} className="text-white/50 mb-2 shrink-0" />
              <div className="font-display text-xl text-white mb-0.5 truncate">12</div>
              <div className="text-[9px] uppercase tracking-wider font-bold text-white/40 truncate">Open Leads</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col justify-center min-w-0">
              <FileText size={14} className="text-white/50 mb-2 shrink-0" />
              <div className="font-display text-xl text-white mb-0.5 truncate">5</div>
              <div className="text-[9px] uppercase tracking-wider font-bold text-white/40 truncate">Proposals Sent</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col justify-center min-w-0">
              <Calendar size={14} className="text-white/50 mb-2 shrink-0" />
              <div className="font-display text-xl text-white mb-0.5 truncate">3</div>
              <div className="text-[9px] uppercase tracking-wider font-bold text-white/40 truncate">Active Events</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col justify-center min-w-0">
              <CreditCard size={14} className="text-white/50 mb-2 shrink-0" />
              <div className="font-display text-xl text-white mb-0.5 truncate">2</div>
              <div className="text-[9px] uppercase tracking-wider font-bold text-white/40 truncate">Pending Payments</div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
