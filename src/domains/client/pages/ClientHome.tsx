import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../../core/components/ui/Button';
import { Plus } from 'lucide-react';

export const ClientHome: React.FC = () => {
  return (
    <div className="flex flex-col space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-celebrate-navy">Welcome to Celebrate</h1>
          <p className="text-celebrate-navy/70 mt-1">Let's start planning your next unforgettable event.</p>
        </div>
        
        <Link to="/client/events/new" className="w-full md:w-auto">
          <Button size="lg" className="w-full px-8 shadow-lg shadow-celebrate-navy/5 group">
            <Plus className="w-5 h-5 mr-2 transition-transform group-hover:rotate-90" />
            Create New Event
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {/* Placeholder for future home widgets */}
        <div className="bg-white rounded-3xl p-8 border border-celebrate-navy/5 shadow-sm h-64 flex flex-col items-center justify-center text-center">
          <p className="text-celebrate-navy/40 font-medium">Upcoming Milestones</p>
          <p className="text-sm text-celebrate-navy/30 mt-2">Will appear here</p>
        </div>
        <div className="bg-white rounded-3xl p-8 border border-celebrate-navy/5 shadow-sm h-64 flex flex-col items-center justify-center text-center">
          <p className="text-celebrate-navy/40 font-medium">Recommended Planners</p>
          <p className="text-sm text-celebrate-navy/30 mt-2">Will appear here</p>
        </div>
      </div>
    </div>
  );
};
