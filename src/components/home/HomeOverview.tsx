import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, BookOpen, Image, ArrowRight, Calendar } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Notice } from '../../types';

const sampleImages = [
  '/album_pic1.jpg',
  '/album_pic2.jpg',
  '/album_pic3.jpg',
  '/album_pic4.jpg',
  '/album_pic5.jpg',
  '/album_pic6.jpeg',
];

export default function HomeOverview() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  useEffect(() => {
    supabase.from('notices').select('*').order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false }).limit(3)
      .then(({ data }) => data && setNotices(data));
  }, []);

  const categoryColors: Record<string, string> = {
    result: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    admission: 'bg-sky-50 text-sky-700 border-sky-200',
    event: 'bg-amber-50 text-amber-700 border-amber-200',
    exam: 'bg-rose-50 text-rose-700 border-rose-200',
    general: 'bg-slate-50 text-slate-700 border-slate-200',
  };

  return (
    <section className="py-24 bg-white" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-sky-50 border border-sky-200 text-sky-700 text-sm font-medium rounded-full mb-4">
            <BookOpen className="w-4 h-4" />
            Latest From KHSC
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
            Stay Informed
          </h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            News, academic updates, and a glimpse into our vibrant campus life.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Notice Board Preview */}
          <motion.div
            className="bg-slate-50 rounded-3xl p-7 border border-slate-100"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0 }}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-rose-100 rounded-2xl flex items-center justify-center">
                <Bell className="w-5 h-5 text-rose-600" />
              </div>
              <h3 className="font-display text-xl font-bold text-slate-900">Notice Board</h3>
            </div>
            <div className="space-y-3">
              {notices.map((notice) => (
                <div key={notice.id} className="bg-white rounded-2xl p-4 border border-slate-100">
                  {notice.is_pinned && (
                    <span className="inline-block text-xs font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full mb-2">Pinned</span>
                  )}
                  <span className={`inline-block text-xs font-medium border px-2.5 py-0.5 rounded-full mb-2 ml-1 capitalize ${categoryColors[notice.category] || categoryColors.general}`}>
                    {notice.category}
                  </span>
                  <p className="text-sm font-semibold text-slate-900 leading-tight line-clamp-2">{notice.title}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-xs text-slate-400">
                      {new Date(notice.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/academic#notices"
              className="flex items-center justify-center gap-2 mt-4 py-2.5 text-sm font-semibold text-slate-700 hover:text-sky-700 border border-slate-200 rounded-xl hover:border-sky-300 hover:bg-sky-50 transition-all">
              View All Notices <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          {/* Academic Hub Preview */}
          <motion.div
            className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-3xl p-7 border border-sky-100"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-sky-100 rounded-2xl flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-sky-600" />
              </div>
              <h3 className="font-display text-xl font-bold text-slate-900">Academic Hub</h3>
            </div>
            <div className="space-y-3">
              {[
                { icon: '📋', title: 'Class Routines', desc: 'Download your weekly class schedule' },
                { icon: '📚', title: 'Syllabus', desc: 'Subject-wise curriculum for all classes' },
                { icon: '📅', title: 'Academic Calendar', desc: 'Year-round event and exam schedule' },
              ].map((item) => (
                <div key={item.title} className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-sky-100/80 flex items-start gap-3">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/academic#hub"
              className="flex items-center justify-center gap-2 mt-4 py-2.5 text-sm font-semibold text-sky-700 bg-white/80 border border-sky-200 rounded-xl hover:bg-white transition-all">
              Open Academic Hub <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          {/* Gallery Preview */}
          <motion.div
            className="bg-slate-50 rounded-3xl p-7 border border-slate-100"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-violet-100 rounded-2xl flex items-center justify-center">
                <Image className="w-5 h-5 text-violet-600" />
              </div>
              <h3 className="font-display text-xl font-bold text-slate-900">Photo Gallery</h3>
            </div>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {sampleImages.map((src, i) => (
                <div key={i} className="aspect-square rounded-xl overflow-hidden">
                  <img src={src} alt="Campus" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                </div>
              ))}
              {[...Array(3)].map((_, i) => (
                <div key={`e${i}`} className="aspect-square rounded-xl bg-slate-100 flex items-center justify-center">
                  <Image className="w-6 h-6 text-slate-300" />
                </div>
              ))}
            </div>
            <Link to="/album"
              className="flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-slate-700 hover:text-violet-700 border border-slate-200 rounded-xl hover:border-violet-300 hover:bg-violet-50 transition-all">
              View Full Gallery <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
