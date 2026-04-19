import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Award, BookOpen, Users } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-sky-50/40">
      {/* Background Decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-sky-100/50 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-[400px] h-[400px] bg-blue-50/60 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/3 w-[300px] h-[300px] bg-sky-50/80 rounded-full blur-2xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Right: Image (shown first on mobile, second on desktop) */}
          <motion.div
            className="order-first lg:order-last flex items-center justify-center"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: 'easeOut', delay: 0.2 }}>
            <div className="animate-float-slow relative">
              {/* Main Image Card */}
              <div className="relative w-80 h-80 sm:w-[420px] sm:h-[420px]">
                <div className="absolute inset-0 bg-gradient-to-br from-sky-200/60 to-blue-200/40 rounded-3xl blur-2xl transform rotate-6 scale-105" />
                <div className="relative w-full h-full rounded-3xl overflow-hidden border-4 border-white shadow-2xl shadow-sky-200/60">
                  <img
                    src="/khsc_home.jpg"
                    alt="Kurmitola High School & College"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-3">
                      <p className="text-xs font-semibold text-sky-600 uppercase tracking-wider">Est. 1948</p>
                      <p className="text-sm font-bold text-slate-900">Kurmitola high school & college, Dhaka</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Badge 1 */}
              <motion.div
                className="absolute -top-4 -left-6 bg-white rounded-2xl shadow-xl border border-sky-100 px-4 py-3 flex items-center gap-2.5"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}>
                <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center">
                  <Award className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Years of Excellence</p>
                  <p className="text-sm font-bold text-slate-900">75+</p>
                </div>
              </motion.div>

              {/* Floating Badge 2 */}
              <motion.div
                className="absolute -bottom-4 -right-6 bg-white rounded-2xl shadow-xl border border-sky-100 px-4 py-3 flex items-center gap-2.5"
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}>
                <div className="w-9 h-9 bg-sky-50 rounded-xl flex items-center justify-center">
                  <Users className="w-5 h-5 text-sky-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Students</p>
                  <p className="text-sm font-bold text-slate-900">5,000+</p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Left: Text Content */}
          <motion.div
            className="order-last lg:order-first space-y-6"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}>
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-sky-50 border border-sky-200 rounded-full text-sm font-medium text-sky-700">
                <BookOpen className="w-4 h-4" />
                EIIN: 107823 · School: 1260 · College: 1253
              </span>
            </motion.div>

            <motion.h1
              className="font-display text-4xl sm:text-5xl xl:text-6xl font-bold text-slate-900 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7 }}>
              Kurmitola<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-blue-600">
                High School
              </span><br />
              & College
            </motion.h1>

            <motion.p
              className="text-slate-600 text-lg leading-relaxed max-w-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}>
              Nurturing Excellence Since 1948 — A Legacy of Education, Character,
              and Achievement in the Heart of Dhaka.
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-3 pt-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.7 }}>
              <Link to="/about"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-slate-900 text-white rounded-full font-semibold text-sm hover:bg-slate-800 transition-all duration-300 hover:shadow-lg hover:shadow-slate-900/20 hover:-translate-y-0.5">
                Explore More
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/academic#admission"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-white text-slate-900 rounded-full font-semibold text-sm border border-slate-200 hover:border-sky-300 hover:bg-sky-50 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
                Admission Info
              </Link>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              className="flex gap-8 pt-4 border-t border-slate-100"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.7 }}>
              {[
                { value: '75+', label: 'Years of Excellence' },
                { value: '150+', label: 'Dedicated Teachers' },
                { value: '97%', label: 'Pass Rate' },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                  <p className="text-xs text-slate-500 leading-tight">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
