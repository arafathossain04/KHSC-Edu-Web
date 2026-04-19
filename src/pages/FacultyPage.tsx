import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { Users, Mail, BookOpen, CircleUser as UserCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Faculty } from '../types';

type FacultyType = 'principal' | 'teacher' | 'staff' | 'ex_principal' | 'ex_chairman';

const tabs: { value: FacultyType; label: string }[] = [
  { value: 'principal', label: 'Principal' },
  { value: 'teacher', label: "Teachers' Info" },
  { value: 'staff', label: "Staff's Info" },
  { value: 'ex_principal', label: 'Ex-Principals' },
  { value: 'ex_chairman', label: 'Ex-Chairmen' },
];

function Section({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay }}>
      {children}
    </motion.div>
  );
}

function FacultyCard({ faculty, index }: { faculty: Faculty; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.07 }}
      className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 overflow-hidden group">
      <div className="relative h-48 bg-gradient-to-br from-sky-50 to-blue-50 overflow-hidden">
        {faculty.photo_url ? (
          <img src={faculty.photo_url} alt={faculty.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <UserCircle className="w-24 h-24 text-sky-200" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 to-transparent" />
      </div>
      <div className="p-5">
        <h3 className="font-display font-bold text-slate-900 text-lg leading-tight">{faculty.name}</h3>
        <p className="text-sky-600 font-medium text-sm mt-1">{faculty.designation}</p>
        {faculty.subject && (
          <div className="flex items-center gap-1.5 mt-2">
            <BookOpen className="w-3.5 h-3.5 text-slate-400" />
            <p className="text-slate-500 text-xs">{faculty.subject}</p>
          </div>
        )}
        {faculty.bio && (
          <p className="text-slate-500 text-xs mt-3 leading-relaxed line-clamp-2">{faculty.bio}</p>
        )}
        {faculty.email && (
          <a href={`mailto:${faculty.email}`}
            className="flex items-center gap-1.5 mt-3 text-xs text-sky-600 hover:text-sky-800 transition-colors">
            <Mail className="w-3.5 h-3.5" /> {faculty.email}
          </a>
        )}
      </div>
    </motion.div>
  );
}

export default function FacultyPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const typeParam = (searchParams.get('type') as FacultyType) || 'teacher';
  const [activeType, setActiveType] = useState<FacultyType>(typeParam);
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setActiveType((searchParams.get('type') as FacultyType) || 'teacher');
  }, [searchParams]);

  useEffect(() => {
    setLoading(true);
    supabase.from('faculty').select('*').eq('faculty_type', activeType).eq('is_active', true)
      .order('sort_order', { ascending: true })
      .then(({ data }) => {
        setFaculty(data || []);
        setLoading(false);
      });
  }, [activeType]);

  const handleTabChange = (type: FacultyType) => {
    setActiveType(type);
    setSearchParams({ type });
  };

  return (
    <main className="pt-20">
      {/* Hero */}
      <section className="py-16 bg-gradient-to-br from-slate-50 to-white border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div className="flex items-center justify-center gap-3 mb-5"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="w-14 h-14 bg-sky-100 rounded-2xl flex items-center justify-center">
              <Users className="w-7 h-7 text-sky-600" />
            </div>
          </motion.div>
          <motion.h1 className="font-display text-4xl sm:text-5xl font-bold text-slate-900 mb-4"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}>
            Faculty & Staff
          </motion.h1>
          <motion.p className="text-slate-500 text-lg"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
            Meet the dedicated educators and staff who make KHSC exceptional.
          </motion.p>
        </div>
      </section>

      {/* Tabs */}
      <section className="bg-white border-b border-slate-100 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex gap-1 overflow-x-auto py-3 scrollbar-hide">
            {tabs.map((tab) => (
              <button key={tab.value} onClick={() => handleTabChange(tab.value)}
                className={`flex-shrink-0 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  activeType === tab.value
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Faculty Grid */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <Section>
            <h2 className="font-display text-2xl font-bold text-slate-900 mb-8">
              {tabs.find(t => t.value === activeType)?.label}
              <span className="ml-3 text-base font-normal text-slate-400">({faculty.length} members)</span>
            </h2>
          </Section>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white rounded-3xl h-72 animate-pulse border border-slate-100" />
              ))}
            </div>
          ) : faculty.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
              <UserCircle className="w-16 h-16 text-slate-200 mx-auto mb-4" />
              <p className="text-slate-500 font-medium">No records found</p>
              <p className="text-slate-400 text-sm mt-1">This section will be updated soon.</p>
            </div>
          ) : (
            <div className={`grid gap-5 ${
              activeType === 'principal' || activeType === 'ex_chairman'
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-3xl'
                : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
            }`}>
              {faculty.map((f, i) => (
                <FacultyCard key={f.id} faculty={f} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
