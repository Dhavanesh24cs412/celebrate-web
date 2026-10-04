import React from 'react';

export const ClientProposals: React.FC = () => {
  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl text-celebrate-navy">Proposals</h1>
      </div>
      
      <div className="bg-white rounded-3xl p-10 shadow-sm border border-celebrate-navy/5 text-center">
        <h3 className="text-xl font-medium text-celebrate-navy mb-2">No proposals yet</h3>
        <p className="text-celebrate-navy/70">
          When planners bid on your events, their proposals will appear here.
        </p>
      </div>
    </div>
  );
};
