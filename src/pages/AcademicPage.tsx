import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { BookOpen, Bell, Download, FileText, Calendar, ClipboardList, Info, Pin, ExternalLink } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Notice, AcademicFile } from '../types';

const categoryColors: Record<string, string> = {
  result: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  admission: 'bg-sky-50 text-sky-700 border-sky-200',
  event: 'bg-amber-50 text-amber-700 border-amber-200',
  exam: 'bg-rose-50 text-rose-700 border-rose-200',
  general: 'bg-slate-50 text-slate-700 border-slate-200',
};

function Section({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay }}>
      {children}
    </motion.div>
  );
}

export default function AcademicPage() {
  const [activeTab, setActiveTab] = useState<'routine' | 'syllabus' | 'calendar'>('routine');
  const [notices, setNotices] = useState<Notice[]>([]);
  const [files, setFiles] = useState<AcademicFile[]>([]);
  const location = useLocation();

  const hubRef = useRef<HTMLDivElement>(null);
  const noticesRef = useRef<HTMLDivElement>(null);
  const admissionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.from('notices').select('*').order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false })
      .then(({ data }) => data && setNotices(data));
  }, []);

  useEffect(() => {
    supabase.from('academic_files').select('*').eq('file_type', activeTab)
      .order('uploaded_at', { ascending: false })
      .then(({ data }) => data && setFiles(data));
  }, [activeTab]);

  useEffect(() => {
    const hash = location.hash;
    if (hash === '#hub') hubRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    else if (hash === '#notices') noticesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    else if (hash === '#admission') admissionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [location]);

  const fileTypeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
    routine: ClipboardList,
    syllabus: BookOpen,
    calendar: Calendar,
  };

  return (
    <main className="pt-20">
      {/* Hero */}
      <section className="py-16 bg-gradient-to-br from-sky-50 to-white border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.h1 className="font-display text-4xl sm:text-5xl font-bold text-slate-900 mb-4"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            Academic & Admission
          </motion.h1>
          <motion.p className="text-slate-500 text-lg"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}>
            Resources, schedules, notices, and admission information all in one place.
          </motion.p>
        </div>
      </section>

      {/* Academic Hub */}
      <section className="py-20 bg-white scroll-mt-24" ref={hubRef} id="hub">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <Section>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-sky-100 rounded-2xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-sky-600" />
              </div>
              <div>
                <h2 className="font-display text-3xl font-bold text-slate-900">Academic Hub</h2>
                <p className="text-slate-500 text-sm">Download official academic documents</p>
              </div>
            </div>
          </Section>

          {/* Tabs */}
          <Section delay={0.1}>
            <div className="flex gap-2 mb-8 bg-slate-100 p-1.5 rounded-2xl w-fit">
              {(['routine', 'syllabus', 'calendar'] as const).map((tab) => {
                const Icon = fileTypeIcons[tab];
                return (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold capitalize transition-all duration-200 ${
                      activeTab === tab ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                    }`}>
                    <Icon className="w-4 h-4" />
                    {tab === 'routine' ? 'Class Routine' : tab === 'syllabus' ? 'Syllabus' : 'Academic Calendar'}
                  </button>
                );
              })}
            </div>
          </Section>

          {/* Files List */}
          <Section delay={0.2}>
            {files.length === 0 ? (
              <div className="text-center py-16 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 font-medium">No files uploaded yet</p>
                <p className="text-slate-400 text-sm mt-1">Admin will upload documents here soon.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {files.map((file) => {
                  const Icon = fileTypeIcons[file.file_type] || FileText;
                  return (
                    <div key={file.id} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-white hover:border-sky-200 hover:shadow-sm transition-all group">
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 bg-sky-100 rounded-xl flex items-center justify-center group-hover:bg-sky-200 transition-colors">
                          <Icon className="w-5 h-5 text-sky-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 text-sm">{file.title}</p>
                          <p className="text-xs text-slate-500 mt-0.5">Class: {file.class_level} · {new Date(file.uploaded_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <a href={file.file_url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors">
                        <Download className="w-3.5 h-3.5" /> Download
                      </a>
                    </div>
                  );
                })}
              </div>
            )}
          </Section>
        </div>
      </section>

      {/* Notice Board */}
      <section className="py-20 bg-slate-50 scroll-mt-24" ref={noticesRef} id="notices">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <Section>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-rose-100 rounded-2xl flex items-center justify-center">
                <Bell className="w-6 h-6 text-rose-600" />
              </div>
              <div>
                <h2 className="font-display text-3xl font-bold text-slate-900">Notice Board</h2>
                <p className="text-slate-500 text-sm">Official announcements and updates</p>
              </div>
            </div>
          </Section>

          <div className="space-y-4">
            {notices.map((notice, i) => (
              <Section key={notice.id} delay={i * 0.06}>
                <div className={`bg-white rounded-2xl p-6 border transition-all duration-300 hover:shadow-sm ${notice.is_pinned ? 'border-amber-200 bg-amber-50/30' : 'border-slate-100'}`}>
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        {notice.is_pinned && (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-100 border border-amber-200 px-2.5 py-0.5 rounded-full">
                            <Pin className="w-3 h-3" /> Pinned
                          </span>
                        )}
                        <span className={`inline-block text-xs font-medium border px-2.5 py-0.5 rounded-full capitalize ${categoryColors[notice.category] || categoryColors.general}`}>
                          {notice.category}
                        </span>
                        <span className="text-xs text-slate-400">
                          {new Date(notice.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
                        </span>
                      </div>
                      <h3 className="font-semibold text-slate-900 text-base mb-1.5">{notice.title}</h3>
                      <p className="text-slate-600 text-sm leading-relaxed">{notice.content}</p>
                    </div>
                    {notice.attachment_url && (
                      <a href={notice.attachment_url} target="_blank" rel="noopener noreferrer"
                        className="flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 bg-sky-50 text-sky-700 border border-sky-200 rounded-xl text-xs font-medium hover:bg-sky-100 transition-colors">
                        <Download className="w-3.5 h-3.5" /> Attachment
                      </a>
                    )}
                  </div>
                </div>
              </Section>
            ))}
          </div>
        </div>
      </section>

      {/* Admission */}
      <section className="py-20 bg-white scroll-mt-24" ref={admissionRef} id="admission">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <Section>
            <div className="text-center mb-10">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <Info className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Admission Information</h2>
            </div>
          </Section>

          <Section delay={0.2}>
            <div className="bg-amber-50 border border-amber-200 rounded-3xl p-8 text-center mb-8">
              <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Info className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="font-display text-2xl font-bold text-slate-900 mb-3">Online Admission Not Available</h3>
              <p className="text-slate-600 leading-relaxed mb-6">
                Online admission is not available right now. Interested candidates are requested to visit our campus in person or download the prospectus for detailed offline admission instructions.
              </p>
              <a href="/prospectus.pdf" target="_blank"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-slate-900 text-white rounded-full font-semibold text-sm hover:bg-slate-800 transition-all hover:-translate-y-0.5 hover:shadow-lg">
                <Download className="w-4 h-4" />
                Download Prospectus
              </a>
            </div>
          </Section>

          <Section delay={0.3}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { title: 'Class VI – X', desc: 'Secondary school admission for Classes 6 to 10. Admission tests conducted every academic year.' },
                { title: 'HSC Admission', desc: 'Higher Secondary Certificate. Admission open for Science, Commerce, and Arts groups.' },
                { title: 'Requirements', desc: 'Birth certificate, previous results, and National ID of guardian required for all admissions.' },
                { title: 'Contact Office', desc: 'Visit school office during working hours (Sun–Thu, 8 AM–4 PM) for more information.' },
              ].map((item) => (
                <div key={item.title} className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                  <h4 className="font-semibold text-slate-900 mb-1.5 flex items-center gap-2">
                    <ExternalLink className="w-4 h-4 text-sky-600" /> {item.title}
                  </h4>
                  <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </Section>
        </div>
      </section>
    </main>
  );
}
