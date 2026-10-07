import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Home, Inbox, Send, User } from 'lucide-react';

export const PlannerLayout: React.FC = () => {
  const navItems = [
    { to: "/planner", label: "Home", icon: Home, end: true },
    { to: "/planner/leads", label: "Leads", icon: Inbox, end: false },
    { to: "/planner/submissions", label: "Submissions", icon: Send, end: false },
    { to: "/planner/profile", label: "Profile", icon: User, end: false },
  ];

  return (
    <div className="flex h-screen bg-celebrate-cream font-sans text-celebrate-navy">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-celebrate-navy/5 shadow-sm">
        <div className="h-16 flex items-center px-6 border-b border-celebrate-navy/5">
          <span className="font-serif text-2xl text-celebrate-navy">Celebrate</span>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
                  isActive
                    ? 'bg-celebrate-navy text-white shadow-sm'
                    : 'text-celebrate-navy/70 hover:bg-celebrate-navy/5 hover:text-celebrate-navy'
                }`
              }
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-celebrate-navy/5 flex justify-around p-2 pb-safe shadow-lg z-50">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex flex-col items-center p-2 rounded-lg transition-colors ${
                isActive
                  ? 'text-celebrate-navy'
                  : 'text-celebrate-navy/40 hover:text-celebrate-navy/70'
              }`
            }
          >
            {({ isActive }) => (
              <React.Fragment>
                <item.icon className={`w-6 h-6 mb-1 ${isActive ? 'fill-current opacity-20' : ''}`} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </React.Fragment>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};
