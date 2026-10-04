import React, { useEffect, useState } from 'react';
import { useAuth } from '../../auth/components/AuthProvider';
import { Button } from '../../../core/components/ui/Button';
import { supabase } from '../../../core/lib/supabase';
import { Save, Loader2, CheckCircle2, Pencil } from 'lucide-react';

export const ClientProfile: React.FC = () => {
  const { user, signOut } = useAuth();
  
  const [formData, setFormData] = useState({
    displayName: '',
    phone: '',
    city: ''
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('client_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
        
      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
      } else if (data) {
        setFormData({
          displayName: data.display_name || '',
          phone: data.phone || '',
          city: data.city || ''
        });
      }
      setLoading(false);
    };

    fetchProfile();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setSuccess(false);
    
    const updates = {
      user_id: user.id,
      display_name: formData.displayName,
      phone: formData.phone,
      city: formData.city,
      updated_at: new Date().toISOString()
    };
    
    const { error } = await supabase
      .from('client_profiles')
      .upsert(updates);
      
    setSaving(false);
    
    if (error) {
      console.error('Error updating profile:', error);
      alert('Failed to save profile. Please try again.');
    } else {
      setSuccess(true);
      setIsEditing(false);
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <Loader2 className="w-8 h-8 animate-spin text-celebrate-navy" />
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-6 w-full max-w-4xl mx-auto px-4 sm:px-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl text-celebrate-navy">My Profile</h1>
      </div>
      
      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-celebrate-navy/5 flex flex-col space-y-8 w-full relative">
        
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-medium text-celebrate-navy mb-1">Account Details</h3>
            <p className="text-sm text-celebrate-navy/70">Manage your profile information and contact details.</p>
          </div>
          {!isEditing && (
            <button 
              onClick={() => setIsEditing(true)}
              className="flex items-center text-sm font-medium text-celebrate-terracotta hover:text-celebrate-navy transition-colors px-3 py-1.5 rounded-lg hover:bg-celebrate-cream"
            >
              <Pencil className="w-4 h-4 mr-2" />
              Edit
            </button>
          )}
        </div>
        
        <div className="h-px bg-celebrate-navy/10 w-full"></div>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-celebrate-navy mb-2">Email Address</label>
            <input 
              type="email" 
              value={user?.email || ''} 
              disabled 
              className="w-full px-4 py-3 rounded-xl border border-transparent bg-celebrate-navy/5 text-celebrate-navy/60 cursor-not-allowed outline-none"
            />
            {isEditing && <p className="text-xs text-celebrate-navy/50 mt-2 ml-1">Email cannot be changed.</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-celebrate-navy mb-2">Display Name</label>
            <input 
              type="text" 
              value={formData.displayName} 
              onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
              placeholder="e.g. Ananya S."
              disabled={!isEditing}
              className={`w-full px-4 py-3 rounded-xl border outline-none transition-all ${
                isEditing 
                  ? 'border-celebrate-navy/20 focus:border-celebrate-navy bg-white' 
                  : 'border-transparent bg-celebrate-cream/30 text-celebrate-navy cursor-default'
              }`}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-celebrate-navy mb-2">Phone Number</label>
              <input 
                type="tel" 
                value={formData.phone} 
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="+91"
                disabled={!isEditing}
                className={`w-full px-4 py-3 rounded-xl border outline-none transition-all ${
                  isEditing 
                    ? 'border-celebrate-navy/20 focus:border-celebrate-navy bg-white' 
                    : 'border-transparent bg-celebrate-cream/30 text-celebrate-navy cursor-default'
                }`}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-celebrate-navy mb-2">City</label>
              <input 
                type="text" 
                value={formData.city} 
                onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                placeholder="e.g. Mumbai"
                disabled={!isEditing}
                className={`w-full px-4 py-3 rounded-xl border outline-none transition-all ${
                  isEditing 
                    ? 'border-celebrate-navy/20 focus:border-celebrate-navy bg-white' 
                    : 'border-transparent bg-celebrate-cream/30 text-celebrate-navy cursor-default'
                }`}
              />
            </div>
          </div>
        </div>
        
        {isEditing && (
          <div className="flex items-center space-x-4 pt-4 border-t border-celebrate-navy/10 animate-fade-in">
            <Button onClick={handleSave} disabled={saving} className="min-w-[120px]">
              {saving ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : (
                <span className="flex items-center">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </span>
              )}
            </Button>
            <button 
              onClick={() => setIsEditing(false)}
              disabled={saving}
              className="text-sm font-medium text-celebrate-navy/60 hover:text-celebrate-navy transition-colors px-3 py-2"
            >
              Cancel
            </button>
          </div>
        )}

        {success && !isEditing && (
          <span className="text-sm font-medium text-green-600 flex items-center pt-2">
            <CheckCircle2 className="w-4 h-4 mr-1" />
            Profile updated successfully
          </span>
        )}

        <div className="pt-4 mt-8 border-t border-celebrate-navy/10">
          <Button variant="outline" onClick={signOut} className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300">
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
};
