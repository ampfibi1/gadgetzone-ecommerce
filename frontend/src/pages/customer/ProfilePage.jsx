import React, { useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { User, Phone, MapPin, Save } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, updateProfile, loading } = useAuthStore();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await updateProfile(formData);
    if (res.success) {
      toast.success('Profile details updated successfully!');
    } else {
      toast.error(res.message);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight mb-1">Profile & delivery address</h1>
        <p className="text-xs text-slate-500 mb-6">
          Update your contact details and default delivery destination in Bangladesh
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Email address (Account ID)
            </label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="w-full px-3.5 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-500 text-xs sm:text-sm cursor-not-allowed"
            />
            <p className="text-[11px] text-slate-400 mt-1">Email address cannot be changed.</p>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Full name
            </label>
            <div className="relative">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full pl-9 pr-3.5 py-2 rounded-lg border border-slate-200 text-xs sm:text-sm focus:ring-1 focus:ring-sky-500 focus:outline-hidden"
              />
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Contact phone number
            </label>
            <div className="relative">
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="01712345678"
                className="w-full pl-9 pr-3.5 py-2 rounded-lg border border-slate-200 text-xs sm:text-sm focus:ring-1 focus:ring-sky-500 focus:outline-hidden"
              />
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Delivery address (Bangladesh)
            </label>
            <div className="relative">
              <textarea
                name="address"
                rows={3}
                value={formData.address}
                onChange={handleChange}
                placeholder="House 42, Road 7, Uttara, Dhaka"
                className="w-full pl-9 pr-3.5 py-2 rounded-lg border border-slate-200 text-xs sm:text-sm focus:ring-1 focus:ring-sky-500 focus:outline-hidden"
              />
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-500 disabled:bg-slate-200 disabled:text-slate-400 text-white font-medium rounded-lg text-xs sm:text-sm transition-colors flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              {loading ? 'Saving...' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
