import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Users, BookOpen, Trophy, Building, Star, Calendar } from 'lucide-react';

const stats = [
  { icon: Users, value: '5,000+', label: 'Students Enrolled', color: 'text-sky-600', bg: 'bg-sky-50' },
  { icon: BookOpen, value: '150+', label: 'Expert Teachers', color: 'text-blue-600', bg: 'bg-blue-50' },
  { icon: Trophy, value: '97%', label: 'Success Rate', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { icon: Building, value: '75+', label: 'Years of Excellence', color: 'text-amber-600', bg: 'bg-amber-50' },
  { icon: Star, value: '5k+', label: 'Alumni Worldwide', color: 'text-rose-600', bg: 'bg-rose-50' },
  { icon: Calendar, value: '1948', label: 'Year Established', color: 'text-violet-600', bg: 'bg-violet-50' },
];

export default function Stats() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="py-24 bg-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          ref={ref}
          className="text-center mb-14"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}>
          <span className="inline-block px-4 py-1.5 bg-sky-500/15 border border-sky-500/30 text-sky-400 text-sm font-medium rounded-full mb-4">
            Our Achievements
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-white mb-4">
            Numbers That Speak
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Over seven decades of shaping futures, building character, and creating leaders.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="bg-slate-800/60 border border-slate-700/60 rounded-3xl p-6 text-center hover:bg-slate-800 transition-all duration-300 hover:-translate-y-1 hover:border-slate-600 cursor-default"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08 }}>
              <div className={`w-12 h-12 ${stat.bg} rounded-2xl flex items-center justify-center mx-auto mb-4 opacity-90`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-xs text-slate-400 leading-snug">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
