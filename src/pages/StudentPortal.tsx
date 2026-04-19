import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, LogOut, Upload, Loader, Camera, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import type { Profile } from '../types';

export default function StudentPortal() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ full_name: '', avatar_url: '' });
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [passwordForm, setPasswordForm] = useState({ old: '', new: '', confirm: '' });
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadProfile();
  }, [user, navigate]);

  const loadProfile = async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle();
    if (data) {
      setProfile(data);
      setForm({ full_name: data.full_name, avatar_url: data.avatar_url || '' });
    }
    setLoading(false);
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !form.full_name.trim()) {
      setMessage({ type: 'error', text: 'Please fill in all fields' });
      return;
    }
    setUploading(true);
    const { error } = await supabase.from('profiles').update({
      full_name: form.full_name,
      avatar_url: form.avatar_url,
    }).eq('id', user.id);
    setUploading(false);
    if (error) {
      setMessage({ type: 'error', text: 'Failed to update profile' });
    } else {
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setEditing(false);
      loadProfile();
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  if (!user) return null;

  return (
    <main className="min-h-screen pt-24 pb-12 bg-gradient-to-br from-slate-50 via-white to-sky-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div className="mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="font-display text-4xl font-bold text-slate-900">Student Portal</h1>
              <p className="text-slate-500 mt-2">Manage your profile and academic information</p>
            </div>
            <button onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 rounded-xl font-medium hover:bg-red-100 transition-all">
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </motion.div>

        {/* Main Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader className="w-8 h-8 text-sky-600 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sidebar - Profile Card */}
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
                {/* Avatar */}
                <div className="mb-6">
                  <div className="relative w-24 h-24 mx-auto">
                    {form.avatar_url ? (
                      <img src={form.avatar_url} alt={form.full_name}
                        className="w-full h-full rounded-2xl object-cover border-4 border-sky-100" />
                    ) : (
                      <div className="w-full h-full rounded-2xl bg-sky-100 flex items-center justify-center border-4 border-sky-100">
                        <User className="w-10 h-10 text-sky-600" />
                      </div>
                    )}
                    {editing && (
                      <button className="absolute bottom-0 right-0 p-2 bg-sky-600 text-white rounded-xl hover:bg-sky-700 transition-all">
                        <Camera className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Quick Info */}
                <div className="text-center mb-6">
                  <h2 className="font-bold text-slate-900 text-lg">{profile?.full_name || 'Student'}</h2>
                  <div className="flex items-center gap-2 text-slate-500 text-sm justify-center mt-2">
                    <Mail className="w-4 h-4" />
                    {user.email}
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-4 space-y-3 text-sm">
                  <div>
                    <p className="text-slate-500 mb-1">Member Since</p>
                    <p className="font-medium text-slate-900">{new Date(profile?.created_at || '').toLocaleDateString('en-BD', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 mb-1">Batch</p>
                    <p className="font-medium text-slate-900">{profile?.batch || 'Not specified'}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Main Content */}
            <motion.div className="lg:col-span-2 space-y-6" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
              {/* Messages */}
              {message && (
                <div className={`flex items-center gap-3 p-4 rounded-2xl border ${
                  message.type === 'success'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                    : 'bg-red-50 border-red-200 text-red-700'
                }`}>
                  {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                  {message.text}
                </div>
              )}

              {/* Edit Profile Card */}
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-display text-2xl font-bold text-slate-900">Profile Information</h3>
                  <button onClick={() => { setEditing(!editing); setMessage(null); }}
                    className={`px-4 py-2 rounded-xl font-medium transition-all ${
                      editing
                        ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        : 'bg-sky-600 text-white hover:bg-sky-700'
                    }`}>
                    {editing ? 'Cancel' : 'Edit Profile'}
                  </button>
                </div>

                {editing ? (
                  <form onSubmit={handleUpdateProfile} className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                      <input type="text" value={form.full_name}
                        onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none text-sm transition-all" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Avatar URL</label>
                      <input type="url" placeholder="https://..." value={form.avatar_url}
                        onChange={(e) => setForm({ ...form, avatar_url: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none text-sm transition-all" />
                      <p className="text-xs text-slate-500 mt-1">Paste a direct image URL (PNG, JPG, etc.)</p>
                    </div>
                    <button type="submit" disabled={uploading}
                      className="w-full py-3 bg-sky-600 text-white rounded-xl font-medium hover:bg-sky-700 transition-all disabled:opacity-60">
                      {uploading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-slate-500 mb-1">Full Name</p>
                      <p className="text-base font-medium text-slate-900">{profile?.full_name || 'Not set'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 mb-1">Email Address</p>
                      <p className="text-base font-medium text-slate-900">{user.email}</p>
                    </div>
                    {form.avatar_url && (
                      <div>
                        <p className="text-sm text-slate-500 mb-2">Profile Picture</p>
                        <img src={form.avatar_url} alt="Profile" className="w-24 h-24 rounded-xl object-cover border border-slate-200" />
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Change Password Card */}
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-display text-2xl font-bold text-slate-900">Security</h3>
                  <button onClick={() => { setShowPasswordForm(!showPasswordForm); setMessage(null); }}
                    className={`px-4 py-2 rounded-xl font-medium transition-all ${
                      showPasswordForm
                        ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}>
                    {showPasswordForm ? 'Cancel' : 'Change Password'}
                  </button>
                </div>

                {showPasswordForm ? (
                  <div className="space-y-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                    <p className="text-sm text-amber-900">Password changes are handled by Supabase auth. Please use the password reset feature in email for security.</p>
                  </div>
                ) : (
                  <p className="text-slate-600 text-sm">Your account is protected with secure authentication. For password changes, use the email-based reset link sent to your inbox.</p>
                )}
              </div>

              {/* Account Info */}
              <div className="bg-slate-50 rounded-3xl border border-slate-100 p-6">
                <h3 className="font-semibold text-slate-900 mb-4">Account Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-slate-500 mb-1">Account Status</p>
                    <p className="font-medium text-emerald-600">Active</p>
                  </div>
                  <div>
                    <p className="text-slate-500 mb-1">Last Login</p>
                    <p className="font-medium text-slate-900">Today</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </main>
  );
}
