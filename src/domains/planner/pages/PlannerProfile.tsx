import React, { useState, useEffect, useRef } from 'react';
import { useForm, Controller, useController, useFieldArray } from 'react-hook-form';
import type { Control } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Select from 'react-select';
import { City } from 'country-state-city';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { useDropzone } from 'react-dropzone';
import { Plus, UploadCloud, X, Check, Loader2, Image as ImageIcon, Edit2, XCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { EVENT_WIZARD_CONFIG } from '../../client/config/eventWizardConfig';
import { Button } from '../../../core/components/ui/Button';
import { supabase } from '../../../core/lib/supabase';
import { useAuth } from '../../auth/components/AuthProvider';

// Validation Schema
const themeSchema = z.object({
  theme_name: z.string().min(1, "Theme name is required"),
  images: z.array(z.any()).max(4, "Maximum 4 images allowed")
});

const styleSchema = z.object({
  style_name: z.string(),
  themes: z.array(themeSchema)
});

const portfolioSchema = z.object({
  budget_min: z.number(),
  budget_max: z.number(),
  services: z.array(z.string()),
  styles: z.array(styleSchema)
});

const profileSchema = z.object({
  business_name: z.string().min(2, "Business name is required"),
  contact_name: z.string().optional().or(z.literal('')),
  company_address: z.string().min(5, "Full address is required"),
  city: z.string().optional().or(z.literal('')),
  phone: z.string().min(10, "Valid phone number is required"),
  instagram: z.string().optional(),
  website: z.string().url("Must be a valid URL").optional().or(z.literal('')),
  short_description: z.string().optional().or(z.literal('')),
  operatable_cities: z.array(z.string()).min(1, "Select at least one city"),
  selected_events: z.array(z.string()),
  portfolios: z.record(z.string(), portfolioSchema)
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const indianCities = City.getCitiesOfCountry('IN')?.map(city => ({
  value: city.name,
  label: city.name
})) || [];

const getEventStyleImagePath = (eventName: string, styleName: string) => {
  const folder = eventName === 'Private Parties' ? 'private' : eventName.toLowerCase().replace(/\s+/g, '-');
  const file = styleName.toLowerCase().replace(/[^a-z0-9]/g, '');
  return `/event-styles/${folder}/${file}.webp`;
};

// Memoized Select using useController to prevent form-wide re-renders
const CitySelect = React.memo(({ control, name, isDisabled }: { control: Control<ProfileFormValues>, name: 'operatable_cities', isDisabled: boolean }) => {
  const { field } = useController({ name, control });
  return (
    <Select
      isMulti
      isDisabled={isDisabled}
      options={indianCities}
      className="react-select-container"
      classNamePrefix="react-select"
      onChange={(selected) => field.onChange(selected.map((s: any) => s.value))}
      value={indianCities.filter(c => (field.value || []).includes(c.value))}
    />
  );
});
CitySelect.displayName = 'CitySelect';

export const PlannerProfile: React.FC = () => {
  const { user } = useAuth();
  const [activeEventTab, setActiveEventTab] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasFetched, setHasFetched] = useState(false);

  const { register, handleSubmit, control, watch, setValue, reset, formState: { errors, isDirty } } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      business_name: '',
      contact_name: '',
      company_address: '',
      city: '',
      phone: '',
      instagram: '',
      website: '',
      short_description: '',
      operatable_cities: [],
      selected_events: [],
      portfolios: {}
    }
  });

  const selectedEvents = watch('selected_events') || [];
  const portfolios = (watch('portfolios') || {}) as ProfileFormValues['portfolios'];

  // Prevent data loss on accidental reload/tab close
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isEditing && isDirty) {
        e.preventDefault();
        e.returnValue = ''; // Required for modern browsers to show the standard alert
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isEditing, isDirty]);

  // Fetch data on mount
  useEffect(() => {
    const fetchProfile = async () => {
      // The bug fix: Do not fetch and reset if we already fetched. 
      // Supabase auth state changes (like switching tabs) trigger re-renders. 
      // If we fetch again, `reset()` wipes the user's unsaved edits!
      if (!user || hasFetched) return; 

      try {
        const { data: profile, error } = await supabase
          .from('planner_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();
          
        if (error && error.code !== 'PGRST116') throw error;
        
        if (profile) {
          const { data: eventTypes } = await supabase.from('event_types').select('id, name');
          const typeMap = new Map();
          const reverseTypeMap = new Map();
          if (eventTypes) {
             eventTypes.forEach((et: any) => {
                 typeMap.set(et.name, et.id);
                 reverseTypeMap.set(et.id, et.name);
             });
          }

          const { data: portData } = await supabase
            .from('planner_portfolios')
            .select('*')
            .eq('planner_id', user.id);
            
          const loadedPortfolios: Record<string, any> = {};
          const loadedSelectedEvents: string[] = [];

          if (portData) {
            portData.forEach((p: any) => {
                const eventName = reverseTypeMap.get(p.event_type_id);
                if (eventName) {
                    loadedSelectedEvents.push(eventName);
                    loadedPortfolios[eventName] = {
                        budget_min: p.budget_min,
                        budget_max: p.budget_max,
                        services: p.services || [],
                        styles: p.themes || [] 
                    };
                }
            });
          }

          reset({
            business_name: profile.business_name || '',
            contact_name: profile.contact_name || '',
            company_address: profile.company_address || '',
            city: profile.city || '',
            phone: profile.phone || '',
            instagram: profile.instagram || '',
            website: profile.website || '',
            short_description: profile.short_description || '',
            operatable_cities: profile.operatable_cities || [],
            selected_events: loadedSelectedEvents,
            portfolios: loadedPortfolios
          });
        }
      } catch (err) {
        console.error("Error fetching profile", err);
      } finally {
        setIsLoading(false);
        setHasFetched(true);
      }
    };
    fetchProfile();
  }, [user, hasFetched, reset]);

  const uploadFiles = async (files: any[], bucket: string, path: string) => {
      const uploadedUrls: string[] = [];
      for (const file of files) {
          if (typeof file === 'string') {
              uploadedUrls.push(file);
              continue;
          }
          const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
          const filePath = `${path}/${fileName}`;
          const { error } = await supabase.storage.from(bucket).upload(filePath, file);
          if (error) throw error;
          const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(filePath);
          uploadedUrls.push(publicUrl);
      }
      return uploadedUrls;
  };

  const onSubmit = async (data: ProfileFormValues) => {
    if (!user) return;
    setIsSubmitting(true);

    try {
        const { error: profileError } = await supabase
            .from('planner_profiles')
            .upsert({
                user_id: user.id,
                business_name: data.business_name,
                contact_name: data.contact_name,
                company_address: data.company_address,
                city: data.city,
                phone: data.phone,
                instagram: data.instagram,
                website: data.website,
                short_description: data.short_description,
                operatable_cities: data.operatable_cities,
                updated_at: new Date().toISOString()
            });
        if (profileError) throw profileError;

        const { data: eventTypes, error: typesError } = await supabase.from('event_types').select('id, name');
        if (typesError) throw typesError;
        
        const eventTypeMap = new Map(eventTypes.map((et: any) => [et.name, et.id]));

        for (const eventName of data.selected_events) {
            const eventTypeId = eventTypeMap.get(eventName);
            if (!eventTypeId) continue;

            const portfolio = data.portfolios[eventName];
            if (!portfolio) continue;

            const processedStyles = [];

            for (const style of portfolio.styles) {
                const processedThemes = [];
                for (const theme of style.themes) {
                    const safeStyleName = style.style_name.replace(/[^a-zA-Z0-9.-]/g, '_');
                    const safeThemeName = theme.theme_name.replace(/[^a-zA-Z0-9.-]/g, '_');
                    const storagePath = `${user.id}/${eventTypeId}/${safeStyleName}/${safeThemeName}`;
                    const imageUrls = await uploadFiles(theme.images, 'planner-portfolio-media', storagePath);
                    processedThemes.push({
                        theme_name: theme.theme_name,
                        images: imageUrls
                    });
                }
                processedStyles.push({
                    style_name: style.style_name,
                    themes: processedThemes
                });
            }

            const { error: portError } = await supabase
                .from('planner_portfolios')
                .upsert({
                    planner_id: user.id,
                    event_type_id: eventTypeId,
                    budget_min: portfolio.budget_min,
                    budget_max: portfolio.budget_max,
                    services: portfolio.services,
                    themes: processedStyles,
                    updated_at: new Date().toISOString()
                }, { onConflict: 'planner_id, event_type_id' }); 
            
            if (portError) throw portError;
        }

        setIsEditing(false);
        // Reset the dirty state by completely re-setting the form with the current data
        reset(data);
        alert("Profile and Portfolio saved successfully!");
    } catch (error: any) {
        console.error(error);
        alert(`Error saving profile: ${error.message}`);
    } finally {
        setIsSubmitting(false);
    }
  };

  const toggleEvent = (eventName: string) => {
    if (!isEditing) return;
    const current = [...selectedEvents];
    if (current.includes(eventName)) {
      setValue('selected_events', current.filter(e => e !== eventName), { shouldDirty: true });
      if (activeEventTab === eventName) setActiveEventTab(null);
    } else {
      setValue('selected_events', [...current, eventName], { shouldDirty: true });
      
      const currentPortfolios = { ...portfolios };
      if (!currentPortfolios[eventName]) {
        currentPortfolios[eventName] = {
          budget_min: 0.5,
          budget_max: 5.0,
          services: [],
          styles: []
        };
        setValue('portfolios', currentPortfolios, { shouldDirty: true });
      }
      setActiveEventTab(eventName);
    }
  };

  if (isLoading) {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-celebrate-navy" />
        </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-sans text-celebrate-navy">
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
      <div className="flex justify-between items-end mb-8 border-b pb-6 border-gray-100">
        <div>
          <h1 className="font-serif text-4xl mb-2">Profile & Portfolio</h1>
          <p className="text-celebrate-navy/70">Manage your business identity and showcase your best work.</p>
        </div>
        <div className="flex gap-4">
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)}>
              <Edit2 className="w-4 h-4 mr-2" /> Edit Profile
            </Button>
          ) : (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)} disabled={isSubmitting}>
                <XCircle className="w-4 h-4 mr-2" /> Cancel
              </Button>
              <Button onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
                {isSubmitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : <><Check className="w-4 h-4 mr-2" /> Save Profile</>}
              </Button>
            </>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
        <section className={`bg-white rounded-3xl p-8 shadow-sm border transition-all ${isEditing ? 'border-celebrate-navy/30 ring-4 ring-celebrate-navy/5' : 'border-celebrate-navy/5'}`}>
          <h2 className="font-serif text-2xl mb-6 flex items-center">
            Business Details
            {!isEditing && <span className="ml-4 text-xs font-sans bg-gray-100 px-2 py-1 rounded-full text-gray-500">Read Only</span>}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Business Name</label>
              <input disabled={!isEditing} {...register("business_name")} className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-celebrate-navy/20 outline-none transition disabled:bg-gray-50 disabled:text-gray-500" />
              {errors.business_name && <p className="text-red-500 text-xs mt-1">{errors.business_name.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Contact Name</label>
              <input disabled={!isEditing} {...register("contact_name")} className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-celebrate-navy/20 outline-none transition disabled:bg-gray-50 disabled:text-gray-500" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Contact Number</label>
              <input disabled={!isEditing} {...register("phone")} className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-celebrate-navy/20 outline-none transition disabled:bg-gray-50 disabled:text-gray-500" />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">City</label>
              <input disabled={!isEditing} {...register("city")} className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-celebrate-navy/20 outline-none transition disabled:bg-gray-50 disabled:text-gray-500" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Company Address</label>
              <input disabled={!isEditing} {...register("company_address")} className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-celebrate-navy/20 outline-none transition disabled:bg-gray-50 disabled:text-gray-500" />
              {errors.company_address && <p className="text-red-500 text-xs mt-1">{errors.company_address.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Instagram Handle</label>
              <input disabled={!isEditing} {...register("instagram")} placeholder="@yourbusiness" className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-celebrate-navy/20 outline-none transition disabled:bg-gray-50 disabled:text-gray-500" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Website URL</label>
              <input disabled={!isEditing} {...register("website")} placeholder="https://" className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-celebrate-navy/20 outline-none transition disabled:bg-gray-50 disabled:text-gray-500" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Short Description</label>
              <textarea disabled={!isEditing} {...register("short_description")} rows={3} className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-celebrate-navy/20 outline-none transition disabled:bg-gray-50 disabled:text-gray-500 resize-none" placeholder="Tell clients about your planning style..." />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Operatable Cities</label>
              <CitySelect control={control} name="operatable_cities" isDisabled={!isEditing} />
              {errors.operatable_cities && <p className="text-red-500 text-xs mt-1">{errors.operatable_cities.message}</p>}
            </div>
          </div>
        </section>

        <section className={`bg-white rounded-3xl p-8 shadow-sm border transition-all ${isEditing ? 'border-celebrate-navy/30 ring-4 ring-celebrate-navy/5' : 'border-celebrate-navy/5'}`}>
          <h2 className="font-serif text-2xl mb-2">Events You Operate</h2>
          <p className="text-sm text-celebrate-navy/60 mb-6">Select the types of events you plan and manage.</p>
          <div className="flex flex-wrap gap-3">
            {Object.keys(EVENT_WIZARD_CONFIG).map((eventName) => {
              const isSelected = selectedEvents.includes(eventName);
              return (
                <button
                  key={eventName}
                  type="button"
                  onClick={() => toggleEvent(eventName)}
                  disabled={!isEditing}
                  className={`px-5 py-3 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                    isSelected
                      ? 'bg-celebrate-navy text-white shadow-md'
                      : 'bg-gray-50 text-celebrate-navy/70 border border-gray-200'
                  } ${!isEditing && !isSelected ? 'opacity-50 cursor-not-allowed' : ''} ${!isEditing ? 'cursor-default' : 'hover:bg-gray-100'}`}
                >
                  {isSelected && <Check className="w-4 h-4" />}
                  {eventName}
                </button>
              );
            })}
          </div>
        </section>

        {selectedEvents.length > 0 && (
          <section className="space-y-6">
            <h2 className="font-serif text-2xl px-2 flex items-center">
              Configure Portfolios
              {!isEditing && <span className="ml-4 text-xs font-sans bg-gray-100 px-2 py-1 rounded-full text-gray-500">Read Only</span>}
            </h2>
            {selectedEvents.map((eventName) => {
              const isActive = activeEventTab === eventName;
              return (
                <div key={eventName} className={`bg-white rounded-3xl overflow-hidden shadow-sm border transition-all ${isEditing && isActive ? 'border-celebrate-navy/30 ring-4 ring-celebrate-navy/5' : 'border-celebrate-navy/5'}`}>
                  <button
                    type="button"
                    onClick={() => setActiveEventTab(isActive ? null : eventName)}
                    className="w-full px-8 py-6 flex justify-between items-center bg-gray-50/50 hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-serif text-xl">{eventName} Portfolio</span>
                    <span className="text-2xl">{isActive ? '−' : '+'}</span>
                  </button>
                  
                  {isActive && (
                    <div className="p-8 border-t border-gray-100 space-y-8 animate-in slide-in-from-top-4 duration-300">
                      <EventPortfolioForm eventName={eventName} control={control} isEditing={isEditing} />
                    </div>
                  )}
                </div>
              );
            })}
          </section>
        )}
      </form>
    </div>
  );
};

// --- Subcomponents ---

const EventPortfolioForm = ({ eventName, control, isEditing }: { eventName: string, control: Control<ProfileFormValues>, isEditing: boolean }) => {
    const config = EVENT_WIZARD_CONFIG[eventName];

    const { fields: styleFields, append: appendStyle, remove: removeStyle } = useFieldArray({
        control,
        name: `portfolios.${eventName}.styles`
    });

    const toggleStyle = (styleName: string) => {
        if (!isEditing) return;
        const existingIdx = styleFields.findIndex(s => s.style_name === styleName);
        if (existingIdx >= 0) {
            removeStyle(existingIdx);
        } else {
            appendStyle({ style_name: styleName, themes: [] });
        }
    };

    return (
        <div className={`space-y-8 ${!isEditing ? 'opacity-90 pointer-events-none' : ''}`}>
            {/* Budget Slider */}
            <div>
                <label className="block font-medium mb-4">Budget Range (₹)</label>
                <Controller
                    name={`portfolios.${eventName}.budget_min`}
                    control={control}
                    render={({ field: minField }) => (
                    <Controller
                        name={`portfolios.${eventName}.budget_max`}
                        control={control}
                        render={({ field: maxField }) => (
                        <div className="px-4">
                            <Slider
                            range
                            disabled={!isEditing}
                            min={0.5}
                            max={500}
                            step={0.1}
                            value={[minField.value || 0.5, maxField.value || 5.0]}
                            onChange={(val) => {
                                if (Array.isArray(val)) {
                                minField.onChange(val[0]);
                                maxField.onChange(val[1]);
                                }
                            }}
                            styles={{
                                track: { backgroundColor: '#1E293B' },
                                handle: { borderColor: '#1E293B', backgroundColor: '#fff' }
                            }}
                            />
                            <div className="flex justify-between text-sm mt-4 text-celebrate-navy/70">
                            <span>₹{(minField.value || 0.5).toFixed(1)}L</span>
                            <span>₹{(maxField.value || 5.0).toFixed(1)}L</span>
                            </div>
                        </div>
                        )}
                    />
                    )}
                />
            </div>

            {/* Services */}
            <div>
                <label className="block font-medium mb-4">Services Provided</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {config.services.map(service => (
                    <Controller
                        key={service}
                        name={`portfolios.${eventName}.services`}
                        control={control}
                        render={({ field }) => {
                        const currentServices = field.value || [];
                        const isChecked = currentServices.includes(service);
                        return (
                            <label className={`flex items-center p-3 rounded-xl border transition-colors ${isChecked ? 'bg-celebrate-navy/5 border-celebrate-navy' : 'border-gray-200'} ${isEditing ? 'cursor-pointer hover:bg-gray-50' : 'cursor-default'}`}>
                            <input
                                type="checkbox"
                                className="hidden"
                                checked={isChecked}
                                disabled={!isEditing}
                                onChange={(e) => {
                                if (!isEditing) return;
                                if (e.target.checked) field.onChange([...currentServices, service]);
                                else field.onChange(currentServices.filter((v: string) => v !== service));
                                }}
                            />
                            <div className={`w-5 h-5 rounded border mr-3 flex items-center justify-center ${isChecked ? 'bg-celebrate-navy border-celebrate-navy text-white' : 'border-gray-300'}`}>
                                {isChecked && <Check className="w-3 h-3" />}
                            </div>
                            <span className="text-sm">{service}</span>
                            </label>
                        );
                        }}
                    />
                    ))}
                </div>
            </div>

            {/* Event Styles Carousel */}
            {config.styles && config.styles.length > 0 && (
                <div className="pt-6 border-t border-gray-100">
                    <label className="block font-medium mb-4">Aesthetic Styles You Serve</label>
                    <StyleCarousel 
                        config={config} 
                        eventName={eventName} 
                        styleFields={styleFields} 
                        toggleStyle={toggleStyle} 
                        isEditing={isEditing} 
                    />
                </div>
            )}

            {/* Style Portfolios (Themes) */}
            {styleFields.map((style, styleIdx) => (
                <StylePortfolioSection 
                    key={style.id} 
                    eventName={eventName} 
                    styleIdx={styleIdx} 
                    styleName={style.style_name} 
                    control={control} 
                    isEditing={isEditing}
                />
            ))}
        </div>
    );
};

// Drag-to-Scroll Horizontal Carousel component
const StyleCarousel = ({ config, eventName, styleFields, toggleStyle, isEditing }: any) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const checkScroll = () => {
        if (!scrollRef.current) return;
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth);
    };

    useEffect(() => {
        checkScroll();
        window.addEventListener('resize', checkScroll);
        return () => window.removeEventListener('resize', checkScroll);
    }, [config.styles]);

    const scroll = (direction: 'left' | 'right') => {
        if (!scrollRef.current) return;
        const scrollAmount = 320;
        scrollRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    };

    // Mitigation for Mouse vs Drag collision
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeftState, setScrollLeftState] = useState(0);
    const dragStarted = useRef(false);

    const onMouseDown = (e: React.MouseEvent) => {
        if (!scrollRef.current) return;
        setIsDragging(false);
        dragStarted.current = true;
        setStartX(e.pageX - scrollRef.current.offsetLeft);
        setScrollLeftState(scrollRef.current.scrollLeft);
    };

    const onMouseLeave = () => {
        dragStarted.current = false;
    };

    const onMouseUp = () => {
        dragStarted.current = false;
        // Delay resetting isDragging so the click handler can block the event if we were dragging
        setTimeout(() => setIsDragging(false), 50); 
    };

    const onMouseMove = (e: React.MouseEvent) => {
        if (!dragStarted.current || !scrollRef.current) return;
        e.preventDefault();
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = (x - startX) * 1.5; 
        if (Math.abs(walk) > 5) setIsDragging(true); // Exceeded 5px threshold -> this is a drag, not a click
        scrollRef.current.scrollLeft = scrollLeftState - walk;
    };

    return (
        <div className="relative group">
            {canScrollLeft && (
                <button type="button" onClick={() => scroll('left')} className="absolute -left-5 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 border border-gray-100 hover:bg-gray-50 text-celebrate-navy transition-all">
                    <ChevronLeft className="w-6 h-6" />
                </button>
            )}
            
            <div 
                ref={scrollRef}
                onScroll={checkScroll}
                onMouseDown={onMouseDown}
                onMouseLeave={onMouseLeave}
                onMouseUp={onMouseUp}
                onMouseMove={onMouseMove}
                className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide py-4 px-2 -mx-2"
            >
                {config.styles.map((style: any) => {
                    const isSelected = styleFields.some((s: any) => s.style_name === style.name);
                    const imagePath = getEventStyleImagePath(eventName, style.name);
                    return (
                        <div
                            key={style.name}
                            onClick={(e) => {
                                if (isDragging) {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    return;
                                }
                                if (isEditing) toggleStyle(style.name);
                            }}
                            className={`shrink-0 w-[280px] sm:w-[320px] snap-start relative flex flex-col text-left rounded-xl overflow-hidden transition-all outline-none border ${
                                isSelected
                                ? 'ring-2 ring-celebrate-navy border-transparent bg-celebrate-navy/5 shadow-md'
                                : 'border-gray-200 hover:border-celebrate-navy/30 bg-white hover:shadow-sm'
                            } ${!isEditing && !isSelected ? 'opacity-50 cursor-default' : 'cursor-pointer'} ${!isEditing && isSelected ? 'cursor-default' : ''}`}
                        >
                            <div className="relative w-full aspect-video bg-gray-100 border-b border-gray-200 pointer-events-none">
                                <img src={imagePath} alt={style.name} className="w-full h-full object-cover select-none pointer-events-none" draggable={false} />
                                {isSelected && (
                                    <div className="absolute top-2 right-2 bg-celebrate-navy text-white rounded-full p-1 shadow-md">
                                        <Check className="w-4 h-4" />
                                    </div>
                                )}
                            </div>
                            <div className="p-5 flex-1 pointer-events-none select-none">
                                <h4 className="font-serif text-lg text-celebrate-navy mb-2">{style.name}</h4>
                                <p className="text-xs text-celebrate-navy/70 leading-relaxed line-clamp-3">{style.description}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {canScrollRight && (
                <button type="button" onClick={() => scroll('right')} className="absolute -right-5 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 border border-gray-100 hover:bg-gray-50 text-celebrate-navy transition-all">
                    <ChevronRight className="w-6 h-6" />
                </button>
            )}
        </div>
    );
};


const StylePortfolioSection = ({ eventName, styleIdx, styleName, control, isEditing }: { eventName: string, styleIdx: number, styleName: string, control: Control<ProfileFormValues>, isEditing: boolean }) => {
    
    const { fields: themeFields, append: appendTheme, remove: removeTheme } = useFieldArray({
        control,
        name: `portfolios.${eventName}.styles.${styleIdx}.themes`
    });

    return (
        <div className="mt-8 bg-gray-50 p-6 rounded-2xl border border-gray-200">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-serif text-xl">{styleName} Themes</h3>
                {isEditing && (
                    <button 
                        type="button" 
                        onClick={() => appendTheme({ theme_name: `Theme ${themeFields.length + 1}`, images: [] })} 
                        className="text-sm flex items-center text-celebrate-navy hover:underline"
                    >
                        <Plus className="w-4 h-4 mr-1" /> Add Theme
                    </button>
                )}
            </div>
            
            {themeFields.length === 0 && (
                <div className="text-center py-10 bg-white rounded-xl border border-dashed border-gray-300">
                <p className="text-sm text-gray-500">No themes added for {styleName} yet.</p>
                </div>
            )}

            <div className="space-y-6">
                {themeFields.map((theme, themeIdx) => (
                    <div key={theme.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative">
                        {isEditing && (
                            <button 
                            type="button" 
                            className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
                            onClick={() => removeTheme(themeIdx)}
                            >
                            <X className="w-5 h-5" />
                            </button>
                        )}
                        
                        <Controller 
                            name={`portfolios.${eventName}.styles.${styleIdx}.themes.${themeIdx}.theme_name`}
                            control={control}
                            render={({ field }) => (
                                <input
                                    {...field}
                                    disabled={!isEditing}
                                    className="font-serif text-xl border-b border-gray-200 outline-none pb-1 mb-6 focus:border-celebrate-navy bg-transparent disabled:border-transparent disabled:text-celebrate-navy w-full"
                                    placeholder="Theme Name (e.g. Royal Palace)"
                                />
                            )}
                        />

                        <div className="mt-2">
                            <p className="text-sm font-medium mb-2">Theme Visuals (Max 4 assets)</p>
                            <Controller
                                name={`portfolios.${eventName}.styles.${styleIdx}.themes.${themeIdx}.images`}
                                control={control}
                                render={({ field }) => (
                                    <ImageDropzone 
                                        files={field.value || []}
                                        isEditing={isEditing}
                                        onUpload={(files) => {
                                            if (!isEditing) return;
                                            const existing = field.value || [];
                                            const availableSlots = 4 - existing.length;
                                            if (availableSlots > 0) {
                                                field.onChange([...existing, ...files.slice(0, availableSlots)]);
                                            }
                                        }}
                                        onRemove={(fileIdx) => {
                                            if (!isEditing) return;
                                            const existing = [...(field.value || [])];
                                            existing.splice(fileIdx, 1);
                                            field.onChange(existing);
                                        }}
                                    />
                                )}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Helper component for Dropzone & Previews
const ImageDropzone = ({ files, onUpload, onRemove, isEditing }: { files: any[], onUpload: (files: File[]) => void, onRemove: (idx: number) => void, isEditing: boolean }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] },
    disabled: !isEditing,
    onDrop: acceptedFiles => onUpload(acceptedFiles)
  });

  return (
    <div className="space-y-3">
      {isEditing && (
        <div 
            {...getRootProps()} 
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
            isDragActive ? 'border-celebrate-navy bg-celebrate-navy/5' : 'border-gray-300 hover:border-celebrate-navy/50 bg-gray-50'
            }`}
        >
            <input {...getInputProps()} />
            <UploadCloud className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p className="text-xs text-gray-500">
            {isDragActive ? 'Drop images here...' : 'Drag & drop images here, or click to select'}
            </p>
        </div>
      )}

      {files.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {files.map((file, idx) => (
            <div key={idx} className="relative group">
              <div className="w-24 h-24 bg-gray-100 rounded-lg flex flex-col items-center justify-center overflow-hidden border border-gray-200">
                {typeof file === 'string' ? (
                  <img src={file} alt="upload" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <ImageIcon className="w-6 h-6 text-gray-400 mb-1" />
                    <span className="text-[9px] text-gray-500 truncate w-full px-1 text-center">{file.name}</span>
                  </>
                )}
              </div>
              {isEditing && (
                <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); onRemove(idx); }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <X className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
