import React, { useEffect, useState } from 'react';
import { supabase } from '../../../core/lib/supabase';
import { useAuth } from '../../auth/components/AuthProvider';
import { MapPin, Users, Calendar, Wallet } from 'lucide-react';

interface EventData {
  id: string;
  name: string;
  event_date: string;
  city: string;
  guest_count: number;
  budget_min: number;
  budget_max: number;
  status: string;
  reference_media: string[];
  signedImageUrl?: string | null;
  event_types: {
    name: string;
  };
}

export const ClientEvents: React.FC = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('events')
        .select(`
          id,
          name,
          event_date,
          city,
          guest_count,
          budget_min,
          budget_max,
          status,
          reference_media,
          event_types ( name )
        `)
        .eq('client_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching events:', error);
      } else {
        const eventsData = (data as any) || [];
        
        // Generate signed URLs for the reference images since the bucket is private
        const eventsWithUrls = await Promise.all(eventsData.map(async (event: any) => {
          if (event.reference_media && event.reference_media.length > 0) {
            const { data: urlData } = await supabase.storage
              .from('client-event-media')
              .createSignedUrl(event.reference_media[0], 3600); // 1 hour expiry
            return { ...event, signedImageUrl: urlData?.signedUrl || null };
          }
          return event;
        }));

        setEvents(eventsWithUrls);
      }
      setLoading(false);
    };

    fetchEvents();
  }, [user]);

  if (loading) {
    return (
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-serif text-3xl text-celebrate-navy">My Events</h1>
        </div>
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-celebrate-navy"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl text-celebrate-navy">My Events</h1>
      </div>
      
      {events.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 shadow-sm border border-celebrate-navy/5 text-center">
          <h3 className="text-xl font-medium text-celebrate-navy mb-2">No events found</h3>
          <p className="text-celebrate-navy/70">
            You haven't created any events yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {events.map((event) => (
            <div 
              key={event.id} 
              onClick={() => window.location.href = `/client/events/${event.id}`}
              className="bg-white rounded-3xl p-6 shadow-sm border border-celebrate-navy/10 hover:shadow-lg transition-all duration-300 group cursor-pointer relative overflow-hidden flex flex-col sm:flex-row gap-6"
            >
              {/* Card highlight effect */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-celebrate-terracotta to-celebrate-gold opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              {/* Image Section */}
              <div className="w-full sm:w-48 h-48 rounded-2xl overflow-hidden bg-celebrate-cream shrink-0 border border-celebrate-navy/5 relative">
                {event.signedImageUrl ? (
                  <img 
                    src={event.signedImageUrl} 
                    alt={event.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-celebrate-navy/30 font-serif text-sm">No Image</span>
                  </div>
                )}
              </div>

              {/* Details Section */}
              <div className="flex-1 flex flex-col justify-between">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="text-xs font-bold text-celebrate-terracotta uppercase tracking-wider mb-1">
                      {event.event_types?.name || 'Event'}
                    </div>
                    <h3 className="text-2xl font-serif text-celebrate-navy leading-tight">{event.name}</h3>
                  </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                  event.status === 'draft' ? 'bg-gray-50 text-gray-600 border-gray-200' :
                  event.status === 'open' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                  event.status === 'booked' ? 'bg-green-50 text-green-700 border-green-200' :
                  event.status === 'active' ? 'bg-green-50 text-green-700 border-green-200' :
                  'bg-purple-50 text-purple-700 border-purple-200'
                }`}>
                  {event.status ? event.status.charAt(0).toUpperCase() + event.status.slice(1) : 'Open'}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-y-4 gap-x-2 mt-8">
                <div className="flex items-center text-sm text-celebrate-navy/80 font-medium">
                  <div className="w-8 h-8 rounded-full bg-celebrate-cream flex items-center justify-center mr-3">
                    <Calendar className="w-4 h-4 text-celebrate-terracotta" />
                  </div>
                  {new Date(event.event_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
                <div className="flex items-center text-sm text-celebrate-navy/80 font-medium">
                  <div className="w-8 h-8 rounded-full bg-celebrate-cream flex items-center justify-center mr-3">
                    <MapPin className="w-4 h-4 text-celebrate-terracotta" />
                  </div>
                  {event.city}
                </div>
                <div className="flex items-center text-sm text-celebrate-navy/80 font-medium">
                  <div className="w-8 h-8 rounded-full bg-celebrate-cream flex items-center justify-center mr-3">
                    <Users className="w-4 h-4 text-celebrate-terracotta" />
                  </div>
                  {event.guest_count} Guests
                </div>
                <div className="flex items-center text-sm text-celebrate-navy/80 font-medium">
                  <div className="w-8 h-8 rounded-full bg-celebrate-cream flex items-center justify-center mr-3">
                    <Wallet className="w-4 h-4 text-celebrate-terracotta" />
                  </div>
                  {event.budget_min ? `${event.budget_min}L - ` : ''}{event.budget_max}L
                </div>
              </div>
            </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
