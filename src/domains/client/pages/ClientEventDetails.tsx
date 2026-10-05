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

      {/* Venue & Event Specifics */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-celebrate-navy/5 mb-8">
        <h3 className="text-lg font-medium text-celebrate-navy mb-6">Venue & Specifics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex flex-col">
            <span className="block text-xs font-medium text-celebrate-terracotta uppercase tracking-wider mb-2">Venue Status</span>
            <span className="text-celebrate-navy/80 font-medium capitalize">
              {event.venue_status ? event.venue_status.replace('_', ' ') : 'Not specified'}
            </span>
          </div>
          
          {event.venue_status === 'booked' && event.venue && (
            <div className="flex flex-col">
              <span className="block text-xs font-medium text-celebrate-terracotta uppercase tracking-wider mb-2">Venue Address</span>
              <span className="text-celebrate-navy/80 font-medium">{event.venue}</span>
            </div>
          )}

          {structuredAnswers.length > 0 && structuredAnswers.map(([key, value]) => (
            <div className="flex flex-col" key={key}>
              <span className="block text-xs font-medium text-celebrate-terracotta uppercase tracking-wider mb-2">
                {key.replace(/_/g, ' ')}
              </span>
              <span className="text-celebrate-navy/80 font-medium">
                {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Style & Preferences */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-celebrate-navy/5 mb-8">
        <h3 className="text-lg font-medium text-celebrate-navy mb-6">Style & Preferences</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Overall Vibe */}
          <div>
            <span className="block text-xs font-medium text-celebrate-terracotta uppercase tracking-wider mb-4">Overall Vibe</span>
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-2xl bg-celebrate-cream/50 border border-celebrate-navy/10 overflow-hidden flex items-center justify-center shrink-0">
                {stylePreferences.style ? (
                  <img 
                    src={`/event-styles/${event.event_types?.name?.toLowerCase().replace(/ /g, '_') || 'wedding'}/${stylePreferences.style.toLowerCase().replace(/ /g, '_')}.webp`} 
                    alt={stylePreferences.style}
                    className="w-full h-full object-cover"
                    onError={(e) => { 
                      // Fallback if specific event type image doesn't exist
                      if (e.currentTarget.src.includes(event.event_types?.name?.toLowerCase() || '')) {
                        e.currentTarget.src = `/event-styles/wedding/${stylePreferences.style.toLowerCase().replace(/ /g, '_')}.webp`;
                      } else {
                        e.currentTarget.style.display = 'none';
                      }
                    }}
                  />
                ) : (
                  <span className="font-serif text-celebrate-navy/40 capitalize">Vibe</span>
                )}
              </div>
              <div>
                <span className="inline-block px-4 py-2 bg-celebrate-cream text-celebrate-navy rounded-xl text-lg font-serif">
                  {stylePreferences.style || 'Not specified'}
                </span>
              </div>
            </div>
          </div>
          
          {/* Colors / Theme */}
          <div>
            <span className="block text-xs font-medium text-celebrate-terracotta uppercase tracking-wider mb-4">Colors / Theme</span>
            <div className="flex items-center gap-6">
              <div 
                className="w-24 h-24 rounded-full border-4 border-white shadow-md transition-colors duration-200 shrink-0"
                style={{ backgroundColor: stylePreferences.color_hex || '#e2e8f0' }}
              />
              <div className="flex flex-col">
                <span className="block text-xl font-serif text-celebrate-navy mb-1">
                  {stylePreferences.colors || 'Not specified'}
                </span>
                {stylePreferences.color_hex && (
                  <span className="block text-sm text-celebrate-navy/60 font-mono">
                    {stylePreferences.color_hex.toUpperCase()}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Services Needed */}
      {event.services && event.services.length > 0 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-celebrate-navy/5 mb-8">
          <h3 className="text-lg font-medium text-celebrate-navy mb-6">Services Needed</h3>
          <div className="flex flex-wrap gap-3">
            {event.services.map((svc: string, idx: number) => (
              <span key={idx} className="px-5 py-2.5 bg-celebrate-cream text-celebrate-navy font-medium rounded-xl border border-celebrate-navy/5">
                {svc}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Reference Media */}
      {mediaUrls.length > 0 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-celebrate-navy/5 mb-8">
          <h3 className="text-lg font-medium text-celebrate-navy mb-6 flex items-center">
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

      {/* Special Requirements */}
      {specialNotes && (
        <div className="bg-celebrate-cream/30 rounded-3xl p-6 sm:p-8 border border-celebrate-terracotta/20 mb-8">
          <h3 className="text-lg font-medium text-celebrate-navy mb-3">Special Requirements</h3>
          <p className="text-celebrate-navy/80 leading-relaxed whitespace-pre-wrap">{specialNotes}</p>
        </div>
      )}

    </div>
  );
};
