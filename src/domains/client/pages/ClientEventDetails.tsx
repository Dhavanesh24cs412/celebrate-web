import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../../core/lib/supabase';
import { useAuth } from '../../auth/components/AuthProvider';
import { ArrowLeft, Calendar, MapPin, Users, Wallet, Loader2, Image as ImageIcon } from 'lucide-react';

export const ClientEventDetails: React.FC = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);

  useEffect(() => {
    const fetchEventData = async () => {
      if (!user || !eventId) return;

      // Fetch event
      const { data, error } = await supabase
        .from('events')
        .select(`*, event_types (name)`)
        .eq('id', eventId)
        .eq('client_id', user.id)
        .single();

      if (error || !data) {
        console.error('Error fetching event details:', error);
        navigate('/client/events');
        return;
      }

      setEvent(data);

      // Fetch reference media URLs if any
      if (data.reference_media && data.reference_media.length > 0) {
        const urls = await Promise.all(
          data.reference_media.map(async (path: string) => {
            const { data: urlData } = await supabase.storage
              .from('client-event-media')
              .createSignedUrl(path, 3600); // 1 hour expiry
            return urlData?.signedUrl || '';
          })
        );
        setMediaUrls(urls.filter(Boolean));
      }

      setLoading(false);
    };

    fetchEventData();
  }, [eventId, user, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <Loader2 className="w-8 h-8 animate-spin text-celebrate-navy" />
      </div>
    );
  }

  if (!event) return null;

  // Formatting helpers
  const requirements = event.requirements || {};
  const stylePreferences = event.style_preferences || {};
  const specialNotes = requirements.special;
  
  // Format dynamic questions (excluding 'special')
  const structuredAnswers = Object.entries(requirements).filter(([key]) => key !== 'special');

  return (
    <div className="max-w-4xl mx-auto pb-16 animate-in fade-in duration-500">
      
      {/* Header Section */}
      <button 
        onClick={() => navigate('/client/events')}
        className="flex items-center text-sm font-medium text-celebrate-navy/60 hover:text-celebrate-navy mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Events
      </button>

      <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-8 gap-4">
        <div>
          <div className="text-sm font-bold text-celebrate-terracotta uppercase tracking-wider mb-2">
            {event.event_types?.name || 'Event'}
          </div>
          <h1 className="font-serif text-4xl text-celebrate-navy leading-tight">{event.name}</h1>
        </div>
        <span className={`px-4 py-1.5 rounded-full text-sm font-medium border whitespace-nowrap ${
          event.status === 'draft' ? 'bg-gray-50 text-gray-600 border-gray-200' :
          event.status === 'open' ? 'bg-blue-50 text-blue-700 border-blue-200' :
          event.status === 'booked' ? 'bg-green-50 text-green-700 border-green-200' :
          event.status === 'active' ? 'bg-green-50 text-green-700 border-green-200' :
          'bg-purple-50 text-purple-700 border-purple-200'
        }`}>
          {event.status ? event.status.charAt(0).toUpperCase() + event.status.slice(1) : 'Open'}
        </span>
      </div>

      {/* Core Metrics Grid */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-celebrate-navy/5 mb-8">
        <h3 className="text-lg font-medium text-celebrate-navy mb-6">Event Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex flex-col">
            <div className="flex items-center text-celebrate-terracotta mb-2">
              <Calendar className="w-5 h-5 mr-2" />
              <span className="font-medium text-sm text-celebrate-navy">Date</span>
            </div>
            <span className="text-celebrate-navy/80 font-medium">
              {new Date(event.event_date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center text-celebrate-terracotta mb-2">
              <MapPin className="w-5 h-5 mr-2" />
              <span className="font-medium text-sm text-celebrate-navy">Location</span>
            </div>
            <span className="text-celebrate-navy/80 font-medium">{event.city}</span>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center text-celebrate-terracotta mb-2">
              <Users className="w-5 h-5 mr-2" />
              <span className="font-medium text-sm text-celebrate-navy">Guests</span>
            </div>
            <span className="text-celebrate-navy/80 font-medium">{event.guest_count}</span>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center text-celebrate-terracotta mb-2">
              <Wallet className="w-5 h-5 mr-2" />
              <span className="font-medium text-sm text-celebrate-navy">Budget</span>
            </div>
            <span className="text-celebrate-navy/80 font-medium">
              {event.budget_min ? `${event.budget_min}L - ` : ''}{event.budget_max}L
            </span>
          </div>
        </div>
      </div>

      {/* Detailed Requirements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        
        {/* Style & Preferences */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-celebrate-navy/5">
          <h3 className="text-lg font-medium text-celebrate-navy mb-6">Style & Preferences</h3>
          <div className="space-y-4">
            <div>
              <span className="block text-xs font-medium text-celebrate-navy/50 uppercase tracking-wider mb-1">Overall Vibe</span>
              <span className="inline-block px-3 py-1 bg-celebrate-cream text-celebrate-navy rounded-lg text-sm font-medium">
                {stylePreferences.style || 'Not specified'}
              </span>
            </div>
            <div>
              <span className="block text-xs font-medium text-celebrate-navy/50 uppercase tracking-wider mb-1">Colors / Theme</span>
              <p className="text-celebrate-navy/80">{stylePreferences.colors || 'Not specified'}</p>
            </div>
            {event.services && event.services.length > 0 && (
              <div className="pt-2">
                <span className="block text-xs font-medium text-celebrate-navy/50 uppercase tracking-wider mb-2">Services Needed</span>
                <div className="flex flex-wrap gap-2">
                  {event.services.map((svc: string, idx: number) => (
                    <span key={idx} className="px-2 py-1 bg-celebrate-navy/5 text-celebrate-navy text-xs rounded-md">
                      {svc}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Venue & Event Specifics */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-celebrate-navy/5">
          <h3 className="text-lg font-medium text-celebrate-navy mb-6">Venue & Specifics</h3>
          <div className="space-y-4">
            <div>
              <span className="block text-xs font-medium text-celebrate-navy/50 uppercase tracking-wider mb-1">Venue Status</span>
              <p className="text-celebrate-navy/80 capitalize">
                {event.venue_status ? event.venue_status.replace('_', ' ') : 'Not specified'}
              </p>
            </div>
            
            {event.venue_status === 'booked' && event.venue && (
              <div>
                <span className="block text-xs font-medium text-celebrate-navy/50 uppercase tracking-wider mb-1">Venue Address</span>
                <p className="text-celebrate-navy/80">{event.venue}</p>
              </div>
            )}

            {structuredAnswers.length > 0 && (
              <div className="pt-2 space-y-3">
                {structuredAnswers.map(([key, value]) => (
                  <div key={key}>
                    <span className="block text-xs font-medium text-celebrate-navy/50 uppercase tracking-wider mb-1">
                      {key.replace(/_/g, ' ')}
                    </span>
                    <p className="text-celebrate-navy/80">
                      {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Special Requirements */}
      {specialNotes && (
        <div className="bg-celebrate-cream/30 rounded-3xl p-6 sm:p-8 border border-celebrate-terracotta/20 mb-8">
          <h3 className="text-lg font-medium text-celebrate-navy mb-3">Special Requirements</h3>
          <p className="text-celebrate-navy/80 leading-relaxed whitespace-pre-wrap">{specialNotes}</p>
        </div>
      )}

      {/* Reference Media */}
      {mediaUrls.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-celebrate-navy mb-4 flex items-center">
            <ImageIcon className="w-5 h-5 mr-2 text-celebrate-terracotta" />
            Reference Media
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {mediaUrls.map((url, idx) => (
              <div key={idx} className="aspect-square rounded-2xl overflow-hidden border border-celebrate-navy/10 relative group">
                <img 
                  src={url} 
                  alt={`Reference ${idx + 1}`} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
