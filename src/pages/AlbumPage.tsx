import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { Image as ImageIcon, Trash2, Upload, Loader, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { GalleryItem } from '../types';

function Section({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay }}>
      {children}
    </motion.div>
  );
}

export default function AlbumPage() {
  const { isAdmin } = useAuth();
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [filter, setFilter] = useState<'all' | 'photo' | 'video'>('all');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [newItem, setNewItem] = useState({ title: '', media_url: '', media_type: 'photo' as 'photo' | 'video', category: 'general' });
  const [showForm, setShowForm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadError, setUploadError] = useState('');

  useEffect(() => {
    loadGallery();
  }, []);

  const loadGallery = async () => {
    setLoading(true);
    const { data } = await supabase.from('gallery').select('*').order('created_at', { ascending: false });
    setGallery(data || []);
    setLoading(false);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError('');

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File size must be less than 5MB');
      return;
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm'];
    if (!validTypes.includes(file.type)) {
      setUploadError('Only JPG, PNG, WebP, MP4, and WebM files are allowed');
      return;
    }

    setUploading(true);

    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
      const filePath = `gallery/${fileName}`;

      // Upload file to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from('public')
        .upload(filePath, file, { cacheControl: '3600', upsert: false });

      if (uploadError) {
        setUploadError('Failed to upload file');
        setUploading(false);
        return;
      }

      // Get public URL
      const { data } = supabase.storage.from('public').getPublicUrl(filePath);
      const mediaUrl = data?.publicUrl || '';

      // Detect media type from file
      const mediaType = file.type.startsWith('video') ? 'video' : 'photo';

      // Save to database
      const { error: dbError } = await supabase.from('gallery').insert({
        title: newItem.title || file.name,
        media_url: mediaUrl,
        media_type: mediaType,
        category: newItem.category,
      });

      setUploading(false);

      if (!dbError) {
        setNewItem({ title: '', media_url: '', media_type: 'photo', category: 'general' });
        setShowForm(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
        loadGallery();
      } else {
        setUploadError('Failed to save file information');
      }
    } catch (err) {
      setUploadError('An error occurred during upload');
      setUploading(false);
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.title.trim() || !newItem.media_url.trim()) return;
    setUploadError('');
    setUploading(true);
    const { error } = await supabase.from('gallery').insert({
      title: newItem.title,
      media_url: newItem.media_url,
      media_type: newItem.media_type,
      category: newItem.category,
    });
    setUploading(false);
    if (!error) {
      setNewItem({ title: '', media_url: '', media_type: 'photo', category: 'general' });
      setShowForm(false);
      loadGallery();
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure?')) {
      await supabase.from('gallery').delete().eq('id', id);
      loadGallery();
    }
  };

  const filteredGallery = filter === 'all' ? gallery : gallery.filter(item => item.media_type === filter);

  return (
    <main className="pt-20">
      {/* Hero */}
      <section className="py-16 bg-gradient-to-br from-slate-50 to-white border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div className="flex items-center justify-center gap-3 mb-5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="w-14 h-14 bg-violet-100 rounded-2xl flex items-center justify-center">
              <ImageIcon className="w-7 h-7 text-violet-600" />
            </div>
          </motion.div>
          <motion.h1 className="font-display text-4xl sm:text-5xl font-bold text-slate-900 mb-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}>
            Photo & Video Gallery
          </motion.h1>
          <motion.p className="text-slate-500 text-lg" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
            Explore our campus life, events, and memorable moments.
          </motion.p>
        </div>
      </section>

      {/* Admin Controls & Filters */}
      <section className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex gap-2">
              {(['all', 'photo', 'video'] as const).map(type => (
                <button key={type} onClick={() => setFilter(type)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    filter === type
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}>
                  {type === 'all' ? 'All' : type === 'photo' ? 'Photos' : 'Videos'}
                </button>
              ))}
            </div>
            {isAdmin && (
              <button onClick={() => setShowForm(!showForm)}
                className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-xl text-sm font-medium hover:bg-sky-700 transition-all">
                <Upload className="w-4 h-4" />
                Add Item
              </button>
            )}
          </div>

          {/* Admin Form */}
          {isAdmin && showForm && (
            <Section delay={0.1}>
              <div className="mt-6 bg-sky-50 rounded-3xl p-6 border border-sky-100 space-y-4">
                <h3 className="font-semibold text-slate-900 mb-4">Add Gallery Item</h3>

                {/* File Upload Method */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">Upload Photo or Video</label>
                  <div className="border-2 border-dashed border-sky-300 rounded-2xl p-6 text-center hover:border-sky-400 transition-all cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}>
                    <Upload className="w-8 h-8 text-sky-600 mx-auto mb-2" />
                    <p className="text-sm font-medium text-slate-700">Click to upload or drag and drop</p>
                    <p className="text-xs text-slate-500 mt-1">JPG, PNG, WebP, MP4, WebM (max 5MB)</p>
                  </div>
                  <input ref={fileInputRef} type="file" onChange={handleFileSelect}
                    accept="image/*,video/*" className="hidden" />
                </div>

                {/* Or URL Method */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-sky-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-sky-50 text-slate-500 font-medium">OR</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">Add from URL</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input type="text" placeholder="Title" value={newItem.title} onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                      className="px-4 py-2 rounded-xl border border-sky-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none text-sm" />
                    <input type="url" placeholder="Image/Video URL" value={newItem.media_url} onChange={(e) => setNewItem({ ...newItem, media_url: e.target.value })}
                      className="px-4 py-2 rounded-xl border border-sky-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none text-sm" />
                    <select value={newItem.media_type} onChange={(e) => setNewItem({ ...newItem, media_type: e.target.value as 'photo' | 'video' })}
                      className="px-4 py-2 rounded-xl border border-sky-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none text-sm">
                      <option value="photo">Photo</option>
                      <option value="video">Video</option>
                    </select>
                    <input type="text" placeholder="Category" value={newItem.category} onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                      className="px-4 py-2 rounded-xl border border-sky-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none text-sm" />
                  </div>
                  {newItem.media_url && (
                    <button type="button" onClick={handleAddItem} disabled={uploading}
                      className="w-full py-2 bg-sky-600 text-white rounded-xl font-medium hover:bg-sky-700 disabled:opacity-60 transition-all">
                      {uploading ? 'Adding...' : 'Add from URL'}
                    </button>
                  )}
                </div>

                {uploadError && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                    <AlertCircle className="w-4 h-4" /> {uploadError}
                  </div>
                )}

                <div className="flex gap-2">
                  <button type="button" onClick={() => setShowForm(false)}
                    className="flex-1 px-4 py-2 bg-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-300 transition-all">
                    Close
                  </button>
                </div>
              </div>
            </Section>
          )}
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader className="w-8 h-8 text-sky-600 animate-spin" />
            </div>
          ) : filteredGallery.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
              <ImageIcon className="w-16 h-16 text-slate-200 mx-auto mb-4" />
              <p className="text-slate-500 font-medium">No items yet</p>
              <p className="text-slate-400 text-sm mt-1">{isAdmin ? 'Add the first gallery item above.' : 'Check back soon!'}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGallery.map((item, i) => (
                <Section key={item.id} delay={i * 0.05}>
                  <div className="group relative bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
                    <div className="relative aspect-video bg-slate-100 overflow-hidden">
                      {item.media_type === 'video' ? (
                        <iframe src={item.media_url} title={item.title}
                          className="w-full h-full object-cover"
                          allowFullScreen />
                      ) : (
                        <img src={item.media_url} alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="font-semibold text-slate-900 mb-1">{item.title}</h3>
                      <span className="inline-block text-xs bg-sky-50 text-sky-700 px-3 py-1 rounded-full font-medium capitalize">{item.category}</span>
                      {isAdmin && (
                        <button onClick={() => handleDelete(item.id)}
                          className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </Section>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
