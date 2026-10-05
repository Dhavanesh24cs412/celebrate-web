import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../core/components/ui/Button';
import { ArrowLeft, ArrowRight, Check, UploadCloud } from 'lucide-react';
import { EVENT_WIZARD_CONFIG } from '../config/eventWizardConfig';
import { EventCarousel } from '../components/EventCarousel';
import { StyleCarousel } from '../components/StyleCarousel';
import { supabase } from '../../../core/lib/supabase';
import { useAuth } from '../../auth/components/AuthProvider';
import { HexColorPicker } from "react-colorful";
import namer from "color-namer";

const STEPS = [
  { id: 1, title: 'Details', subtitle: 'Event basics' },
  { id: 2, title: 'Requirements', subtitle: 'What do you need?' },
  { id: 3, title: 'Look & Feel', subtitle: 'Style & references' },
  { id: 4, title: 'Special', subtitle: 'Anything else?' },
];

export const EventWizard: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [themeColorHex, setThemeColorHex] = useState('#c54228');

  // Core Form State
  const [formData, setFormData] = useState({
    type: Object.keys(EVENT_WIZARD_CONFIG)[0],
    name: '',
    date: '',
    city: '',
    venueStatus: '',
    venueAddress: '',
    guestCount: '',
    budgetMin: '',
    budgetMax: '',
    budgetFlexibility: '',
    services: [] as string[],
    style: '',
    colors: '',
    specialRequirements: '',
    referenceMedia: [] as File[],
    structuredAnswers: {} as Record<string, string | boolean>
  });

  const { user } = useAuth();

  const activeConfig = formData.type ? EVENT_WIZARD_CONFIG[formData.type] : null;

  const handleColorChange = (color: string) => {
    setThemeColorHex(color);
    try {
      const names = namer(color);
      const semanticName = names.ntc[0].name;
      updateForm('colors', semanticName);
    } catch (e) {
      // safe fallback
    }
  };

  const updateForm = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateStructuredAnswer = (key: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      structuredAnswers: { ...prev.structuredAnswers, [key]: value }
    }));
  };

  const toggleService = (service: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const selectedFile = files[0];
      setFormData(prev => ({
        ...prev,
        referenceMedia: [selectedFile]
      }));
    }
  };

  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      referenceMedia: prev.referenceMedia.filter((_, i) => i !== index)
    }));
  };

  const handleNext = () => {
    if (currentStep === 1 && !formData.type) {
      alert("Please select an event type to continue.");
      return;
    }
    if (currentStep < STEPS.length) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
    else navigate('/client');
  };

  const handleSubmit = async () => {
    if (!user) return;
    setIsSubmitting(true);
    
    try {
      const { data: eventType } = await supabase
        .from('event_types')
        .select('id')
        .eq('name', formData.type)
        .single();
      
      if (!eventType) throw new Error("Event type not found in database.");

      let mappedVenueStatus = null;
      if (formData.venueStatus === 'booked') mappedVenueStatus = 'selected';
      if (formData.venueStatus === 'need_venue') mappedVenueStatus = 'not_selected';

      // 2. Upload Files to Supabase Storage
      const uploadedPaths: string[] = [];
      for (const file of formData.referenceMedia) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('client-event-media')
          .upload(filePath, file);
        
        if (uploadError) {
          console.error("Upload error:", uploadError);
          throw new Error(`Failed to upload ${file.name}`);
        }
        uploadedPaths.push(filePath);
      }

      // 3. Create Payload
      const payload = {
        client_id: user.id,
        event_type_id: eventType.id,
        name: formData.name,
        event_date: formData.date || new Date().toISOString(),
        city: formData.city,
        venue: formData.venueStatus === 'booked' ? 'Booked Venue' : null,
        venue_status: mappedVenueStatus,
        venue_address: formData.venueAddress,
        guest_count: parseInt(formData.guestCount) || 1,
        budget_min: formData.budgetMin ? parseFloat(formData.budgetMin) : null,
        budget_max: parseFloat(formData.budgetMax) || 1,
        budget_flexibility: 'flexible',
        services: formData.services,
        reference_media: uploadedPaths,
        requirements: {
          special: formData.specialRequirements,
          ...formData.structuredAnswers
        },
        style_preferences: {
          style: formData.style,
          colors: formData.colors || 'Terracotta',
          color_hex: themeColorHex
        },
        status: 'open'
      };

      const { error } = await supabase.from('events').insert(payload);
      if (error) throw error;
      
      navigate('/client/events');
    } catch (err: any) {
      console.error("Submission Error:", err);
      alert("Failed to save event. Did you run the SQL update script?");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      {/* Header & Progress */}
      <div className="mb-10">
        <button 
          onClick={handleBack}
          className="flex items-center text-sm font-medium text-celebrate-navy/60 hover:text-celebrate-navy mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {currentStep === 1 ? 'Cancel & Return' : 'Back'}
        </button>

        <h1 className="font-serif text-4xl text-celebrate-navy mb-8">Plan your celebration</h1>
        
        {/* Progress Tracker */}
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[2px] bg-celebrate-navy/10 -z-10"></div>
          <div 
            className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] bg-celebrate-terracotta transition-all duration-300 -z-10"
            style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
          ></div>
          
          {STEPS.map((step) => {
            const isCompleted = step.id < currentStep;
            const isCurrent = step.id === currentStep;
            return (
              <div key={step.id} className="flex flex-col items-center">
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    isCompleted 
                      ? 'bg-celebrate-terracotta text-white border-2 border-white' 
                      : isCurrent 
                        ? 'bg-celebrate-navy text-white border-2 border-white' 
                        : 'bg-white text-celebrate-navy/40 border-2 border-celebrate-navy/10'
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : step.id}
                </div>
                <span className={`mt-2 text-xs font-medium hidden sm:block ${isCurrent ? 'text-celebrate-navy' : 'text-celebrate-navy/50'}`}>
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content Container */}
      <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-celebrate-navy/5 min-h-[400px] flex flex-col">
        
        <div className="flex-1">
          {/* STEP 1: EVENT DETAILS */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-serif text-celebrate-navy">Event Details</h2>
              <p className="text-celebrate-navy/70">Let's start with the basics.</p>
              
              <div className="mt-8 space-y-8">
                <div className="flex flex-col items-center">
                  <EventCarousel 
                    eventTypes={Object.keys(EVENT_WIZARD_CONFIG)}
                    selectedType={formData.type}
                    onSelect={(t) => updateForm('type', t)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-celebrate-navy mb-2">Name your event *</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => updateForm('name', e.target.value)}
                    placeholder="e.g. Ananya & Arjun Wedding"
                    className="w-full px-4 py-3 rounded-xl border border-celebrate-navy/20 focus:border-celebrate-navy focus:ring-1 focus:ring-celebrate-navy outline-none transition-all"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-celebrate-navy mb-2">When is your event *</label>
                    <input 
                      type="date" 
                      value={formData.date}
                      onChange={(e) => updateForm('date', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-celebrate-navy/20 focus:border-celebrate-navy focus:ring-1 focus:ring-celebrate-navy outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-celebrate-navy mb-2">Location / City *</label>
                    <input 
                      type="text" 
                      value={formData.city}
                      onChange={(e) => updateForm('city', e.target.value)}
                      placeholder="e.g. Mumbai"
                      className="w-full px-4 py-3 rounded-xl border border-celebrate-navy/20 focus:border-celebrate-navy focus:ring-1 focus:ring-celebrate-navy outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-celebrate-navy mb-2">Expected Guests *</label>
                  <input 
                    type="number" 
                    value={formData.guestCount}
                    onChange={(e) => updateForm('guestCount', e.target.value)}
                    placeholder="e.g. 250"
                    className="w-full px-4 py-3 rounded-xl border border-celebrate-navy/20 focus:border-celebrate-navy focus:ring-1 focus:ring-celebrate-navy outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: WHAT DO YOU NEED? (Dynamic) */}
          {currentStep === 2 && activeConfig && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-serif text-celebrate-navy">What do you need?</h2>
              <p className="text-celebrate-navy/70">Select the specific requirements for your {formData.type}.</p>
              
              <div className="mt-8 space-y-8">
                
                {/* Specific Questions based on Event Type */}
                {activeConfig.specificQuestions.length > 0 && (
                  <div className="space-y-4 p-6 bg-celebrate-cream/30 rounded-2xl border border-celebrate-navy/5">
                    <h4 className="font-medium text-celebrate-navy mb-4">Specific Requirements</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {activeConfig.specificQuestions.map(q => (
                        <div key={q.id}>
                          <label className="block text-sm font-medium text-celebrate-navy mb-2">{q.label}</label>
                          
                          {q.type === 'select' && q.options && (
                            <select 
                              value={formData.structuredAnswers[q.id] as string || ''}
                              onChange={(e) => updateStructuredAnswer(q.id, e.target.value)}
                              className="w-full px-4 py-3 rounded-xl border border-celebrate-navy/20 focus:border-celebrate-navy outline-none bg-white transition-all"
                            >
                              <option value="" disabled>Select...</option>
                              {q.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                          )}

                          {q.type === 'text' && (
                            <input 
                              type="text"
                              value={formData.structuredAnswers[q.id] as string || ''}
                              onChange={(e) => updateStructuredAnswer(q.id, e.target.value)}
                              className="w-full px-4 py-3 rounded-xl border border-celebrate-navy/20 focus:border-celebrate-navy outline-none bg-white transition-all"
                            />
                          )}

                          {q.type === 'boolean' && (
                            <div className="flex items-center space-x-4 h-12">
                              <label className="flex items-center space-x-2 cursor-pointer">
                                <input 
                                  type="radio" 
                                  name={q.id} 
                                  checked={formData.structuredAnswers[q.id] === true}
                                  onChange={() => updateStructuredAnswer(q.id, true)}
                                  className="w-4 h-4 text-celebrate-navy"
                                />
                                <span>Yes</span>
                              </label>
                              <label className="flex items-center space-x-2 cursor-pointer">
                                <input 
                                  type="radio" 
                                  name={q.id} 
                                  checked={formData.structuredAnswers[q.id] === false}
                                  onChange={() => updateStructuredAnswer(q.id, false)}
                                  className="w-4 h-4 text-celebrate-navy"
                                />
                                <span>No</span>
                              </label>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Services Checkboxes */}
                <div>
                  <h4 className="font-medium text-celebrate-navy mb-3">Services Needed</h4>
                  <div className="flex flex-wrap gap-2">
                    {activeConfig.services.map(svc => (
                      <button
                        key={svc}
                        onClick={() => toggleService(svc)}
                        className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors ${
                          formData.services.includes(svc) 
                            ? 'border-celebrate-navy bg-celebrate-navy text-white' 
                            : 'border-celebrate-navy/20 text-celebrate-navy/70 hover:border-celebrate-navy/50'
                        }`}
                      >
                        {svc}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Venue Status */}
                <div>
                  <label className="block text-sm font-medium text-celebrate-navy mb-2">Venue Status</label>
                  <select 
                    value={formData.venueStatus}
                    onChange={(e) => updateForm('venueStatus', e.target.value)}
                    className="w-full sm:w-1/2 px-4 py-3 rounded-xl border border-celebrate-navy/20 focus:border-celebrate-navy outline-none bg-white transition-all"
                  >
                    <option value="" disabled>Select venue status...</option>
                    <option value="booked">Booked</option>
                    <option value="need_venue">Need Venue</option>
                  </select>
                </div>

                {formData.venueStatus === 'booked' && (
                  <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                    <label className="block text-sm font-medium text-celebrate-navy mb-2">Venue Address / Google Maps Link *</label>
                    <input 
                      type="text" 
                      value={formData.venueAddress}
                      onChange={(e) => updateForm('venueAddress', e.target.value)}
                      placeholder="Enter the full address or paste a Google Maps link"
                      className="w-full px-4 py-3 rounded-xl border border-celebrate-navy/20 focus:border-celebrate-navy focus:ring-1 focus:ring-celebrate-navy outline-none transition-all"
                    />
                  </div>
                )}

              </div>
            </div>
          )}

          {/* STEP 3: LOOK & FEEL */}
          {currentStep === 3 && activeConfig && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-serif text-celebrate-navy">Look & Feel</h2>
              <p className="text-celebrate-navy/70">Define the visual identity of your event.</p>
              
              <div className="mt-8 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-celebrate-navy mb-2">Overall Style</label>
                  <StyleCarousel 
                    eventType={formData.type}
                    styles={activeConfig.styles}
                    selectedStyle={formData.style}
                    onSelect={(styleName) => updateForm('style', styleName)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-celebrate-navy mb-4">Preferred Colors / Theme</label>
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 bg-celebrate-cream/30 p-6 rounded-2xl border border-celebrate-navy/5">
                    <HexColorPicker color={themeColorHex} onChange={handleColorChange} />
                    <div className="flex flex-col items-center justify-center space-y-4 pt-4 sm:pt-0">
                      <div 
                        className="w-24 h-24 rounded-full border-4 border-white shadow-md transition-colors duration-200"
                        style={{ backgroundColor: themeColorHex }}
                      />
                      <div className="text-center">
                        <span className="block text-xs font-bold text-celebrate-navy/50 uppercase tracking-wider mb-1">Semantic Match</span>
                        <span className="block text-xl font-serif text-celebrate-navy">
                          {formData.colors || 'Terracotta'}
                        </span>
                        <span className="block text-sm text-celebrate-navy/60 font-mono mt-1">
                          {themeColorHex.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-celebrate-navy mb-2">Reference Image</label>
                  
                  {formData.referenceMedia.length === 0 ? (
                    <label className="w-full border-2 border-dashed border-celebrate-navy/20 rounded-2xl p-8 flex flex-col items-center justify-center bg-celebrate-cream/30 hover:bg-celebrate-cream/50 transition-colors cursor-pointer min-h-[200px]">
                      <input 
                        type="file" 
                        accept="image/png, image/jpeg" 
                        className="hidden" 
                        onChange={handleFileUpload}
                      />
                      <UploadCloud className="w-8 h-8 text-celebrate-navy/40 mb-3" />
                      <p className="text-sm font-medium text-celebrate-navy">Click to upload reference image</p>
                      <p className="text-xs text-celebrate-navy/50 mt-1">PNG, JPG up to 5MB</p>
                    </label>
                  ) : (
                    <div className="relative group w-full">
                      <label className="block w-full border-2 border-dashed border-celebrate-navy/20 rounded-2xl overflow-hidden cursor-pointer bg-celebrate-cream/30">
                        <input 
                          type="file" 
                          accept="image/png, image/jpeg" 
                          className="hidden" 
                          onChange={handleFileUpload}
                        />
                        <img 
                          src={URL.createObjectURL(formData.referenceMedia[0])} 
                          alt="preview" 
                          className="w-full object-cover max-h-[400px]" 
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <p className="text-white font-medium flex items-center gap-2">
                            <UploadCloud className="w-5 h-5" /> Change Image
                          </p>
                        </div>
                      </label>
                      <button 
                        type="button"
                        onClick={() => removeFile(0)}
                        className="absolute -top-3 -right-3 w-8 h-8 bg-celebrate-terracotta text-white rounded-full text-lg font-bold shadow-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: SPECIAL REQUIREMENTS */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-serif text-celebrate-navy">Anything Special?</h2>
              <p className="text-celebrate-navy/70">Any final notes for the planners.</p>
              
              <div className="mt-8 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-celebrate-navy mb-2">Budget Range (in Lakhs) *</label>
                  <div className="flex items-center space-x-2">
                    <div className="relative w-full">
                      <input 
                        type="number" 
                        step="0.1"
                        value={formData.budgetMin}
                        onChange={(e) => updateForm('budgetMin', e.target.value)}
                        placeholder="Min (e.g. 0.5)"
                        className="w-full pl-4 pr-8 py-3 rounded-xl border border-celebrate-navy/20 focus:border-celebrate-navy outline-none transition-all"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-celebrate-navy/50 font-medium">L</span>
                    </div>
                    <span className="text-celebrate-navy/40">-</span>
                    <div className="relative w-full">
                      <input 
                        type="number" 
                        step="0.1"
                        value={formData.budgetMax}
                        onChange={(e) => updateForm('budgetMax', e.target.value)}
                        placeholder="Max (e.g. 5)"
                        className="w-full pl-4 pr-8 py-3 rounded-xl border border-celebrate-navy/20 focus:border-celebrate-navy outline-none transition-all"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-celebrate-navy/50 font-medium">L</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-celebrate-navy mb-2">Special Requirements & Notes</label>
                  <textarea 
                    value={formData.specialRequirements}
                    onChange={(e) => updateForm('specialRequirements', e.target.value)}
                    placeholder="e.g. Need wheelchair accessibility, entirely vegetarian menu without onion/garlic, etc."
                    className="w-full px-4 py-3 rounded-xl border border-celebrate-navy/20 focus:border-celebrate-navy focus:ring-1 focus:ring-celebrate-navy outline-none transition-all min-h-[150px] resize-y"
                  />
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="mt-12 flex items-center justify-between pt-6 border-t border-celebrate-navy/5">
          <Button 
            variant="outline" 
            onClick={handleBack}
            className={currentStep === 1 ? 'invisible' : ''}
            disabled={isSubmitting}
          >
            Previous
          </Button>
          
          <Button onClick={handleNext} disabled={isSubmitting} className="shadow-lg shadow-celebrate-navy/10 group">
            {isSubmitting ? 'Saving...' : currentStep === STEPS.length ? 'Submit Requirements' : 'Continue'}
            {!isSubmitting && currentStep < STEPS.length && <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />}
          </Button>
        </div>
      </div>

    </div>
  );
};
