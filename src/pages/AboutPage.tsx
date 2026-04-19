import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Target, Eye, Award, BookOpen, Users, Heart, Star, Shield } from 'lucide-react';

const historyText = `"কুর্মিটোলা হাই স্কুল এন্ড কলেজ" রাজধানী ঢাকার খিলক্ষেত থানার অন্তর্গত কুর্মিটোলা এলাকায় অবস্থিত একটি স্বনামধন্য শিক্ষা প্রতিষ্ঠান। ১৯৪৮ সালে প্রতিষ্ঠিত এই বিদ্যালয়টি দীর্ঘ সাত দশকেরও বেশি সময় ধরে এই অঞ্চলের শিক্ষা বিস্তারে অগ্রণী ভূমিকা পালন করে আসছে।

প্রতিষ্ঠার পর থেকেই বিদ্যালয়টি শিক্ষার মান উন্নয়নে নিরলস প্রচেষ্টা চালিয়ে যাচ্ছে। শুরুতে একটি ছোট বিদ্যালয় হিসেবে যাত্রা শুরু করলেও বর্তমানে এটি একটি পূর্ণাঙ্গ হাই স্কুল ও কলেজে পরিণত হয়েছে। বাংলাদেশের স্বাধীনতার পর থেকে এই প্রতিষ্ঠানটি আরও বিকশিত হয়ে উঠেছে এবং জাতীয় শিক্ষা ব্যবস্থায় গুরুত্বপূর্ণ অবদান রেখে চলেছে।

বিদ্যালয়টির অবকাঠামো ক্রমান্বয়ে উন্নত হয়েছে। বর্তমানে এখানে আধুনিক শ্রেণীকক্ষ, সুসজ্জিত বিজ্ঞান ল্যাবরেটরি, একটি সমৃদ্ধ গ্রন্থাগার এবং খেলার মাঠ রয়েছে। শিক্ষার্থীদের সামগ্রিক বিকাশের জন্য পাঠ্যক্রম বহির্ভূত কার্যক্রম, সাংস্কৃতিক অনুষ্ঠান এবং ক্রীড়া প্রতিযোগিতার আয়োজন করা হয়।

কুর্মিটোলা হাই স্কুল এন্ড কলেজ শিক্ষার্থীদের মেধা বিকাশের পাশাপাশি তাদের নৈতিক মূল্যবোধ এবং দেশপ্রেম সৃষ্টিতে বিশেষ মনোযোগ দেয়। এই প্রতিষ্ঠান থেকে উত্তীর্ণ অনেক শিক্ষার্থী আজ দেশে-বিদেশে বিভিন্ন গুরুত্বপূর্ণ পদে কর্মরত এবং সমাজের উন্নয়নে অবদান রেখে চলেছেন।

প্রতিষ্ঠানটি বাংলাদেশ মাধ্যমিক ও উচ্চ মাধ্যমিক শিক্ষা বোর্ড, ঢাকার অধীনে পরিচালিত এবং এর EIIN নম্বর ১০৭৮২৩। বছরের পর বছর ধরে এটি পাবলিক পরীক্ষায় উল্লেখযোগ্য ফলাফল অর্জন করে আসছে এবং এই অঞ্চলের অন্যতম সেরা শিক্ষা প্রতিষ্ঠান হিসেবে নিজেকে প্রতিষ্ঠিত করেছে।

আমাদের প্রতিষ্ঠানের শিক্ষকবৃন্দ অত্যন্ত দক্ষ এবং নিবেদিতপ্রাণ। তারা শিক্ষার্থীদের শুধু পাঠ্যবিষয়ে নয়, জীবনের প্রতিটি ক্ষেত্রে সফল হওয়ার জন্য অনুপ্রাণিত করেন। আমাদের লক্ষ্য হলো প্রতিটি শিক্ষার্থীকে একজন সৎ, দেশপ্রেমিক এবং কর্মক্ষম নাগরিক হিসেবে গড়ে তোলা।

ভবিষ্যতে আরও উন্নত শিক্ষা পরিবেশ তৈরি এবং আধুনিক প্রযুক্তির সমন্বয়ে শিক্ষার মান আরও উন্নত করার লক্ষ্যে আমরা দৃঢ় প্রত্যয়ী।"`;

const missions = [
  { icon: Target, title: 'Our Mission', color: 'text-sky-600', bg: 'bg-sky-50', content: 'To provide quality education that empowers students with knowledge, skills, and values to succeed in a rapidly changing world, while fostering a deep sense of national identity and social responsibility.' },
  { icon: Eye, title: 'Our Vision', color: 'text-blue-600', bg: 'bg-blue-50', content: 'To be the leading educational institution in Dhaka, recognized for academic excellence, character development, and producing globally competitive graduates who contribute meaningfully to Bangladesh and the world.' },
  { icon: Heart, title: 'Our Values', color: 'text-rose-600', bg: 'bg-rose-50', content: 'Integrity, excellence, inclusivity, and innovation. We believe every student deserves equal opportunities and personalized support to reach their full potential in all aspects of life.' },
];

const qualities = [
  { icon: BookOpen, title: 'Curriculum Excellence', desc: 'Following the National Curriculum with additional enrichment programs in science, arts, and humanities.' },
  { icon: Users, title: 'Dedicated Faculty', desc: 'Over 150 experienced and passionate teachers committed to student success and holistic development.' },
  { icon: Award, title: 'Academic Results', desc: 'Consistently achieving 97%+ pass rates in SSC and HSC examinations with numerous GPA 5.00 holders.' },
  { icon: Star, title: 'Co-curricular Activities', desc: 'Annual sports day, cultural programs, science fairs, and debate competitions for all-round development.' },
  { icon: Shield, title: 'Safe Environment', desc: 'A secure, disciplined, and nurturing campus environment that supports focused learning and growth.' },
  { icon: Heart, title: 'Community Engagement', desc: 'Active participation in national events, community services, and social development programs.' },
];

function Section({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay }}>
      {children}
    </motion.div>
  );
}

export default function AboutPage() {
  return (
    <main className="pt-20">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.span
            className="inline-block px-4 py-1.5 bg-sky-500/15 border border-sky-500/30 text-sky-400 text-sm font-medium rounded-full mb-5"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            About KHSC
          </motion.span>
          <motion.h1
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}>
            Our Story & Legacy
          </motion.h1>
          <motion.p
            className="text-slate-300 text-lg max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
            Over 75 years of shaping minds, building character, and creating leaders who make Bangladesh proud.
          </motion.p>
        </div>
      </section>

      {/* History */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <Section>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-50 border border-amber-200 text-amber-700 text-sm font-medium rounded-full mb-6">
                <BookOpen className="w-4 h-4" />
                ইতিহাস — Our History
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
                A Journey of Excellence
              </h2>
              <div className="text-slate-600 leading-[1.9] text-[15px] space-y-4 font-['Hind_Siliguri',_'Noto_Sans_Bengali',_sans-serif]">
                {historyText.split('\n\n').map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </Section>

            <Section delay={0.2}>
              <div className="sticky top-24 space-y-5">
                <div className="rounded-3xl overflow-hidden shadow-xl border border-slate-100">
                  <img
                    src="/about.jpg"
                    alt="KHSC Campus"
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-6 bg-slate-50">
                    <h3 className="font-display text-xl font-bold text-slate-900 mb-3">At a Glance</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: 'Established', value: '1948' },
                        { label: 'EIIN', value: '107823' },
                        { label: 'School Code', value: '1260' },
                        { label: 'College Code', value: '1253' },
                        { label: 'Students', value: '5,000+' },
                        { label: 'Teachers', value: '150+' },
                      ].map((item) => (
                        <div key={item.label} className="bg-white rounded-2xl p-3 border border-slate-100">
                          <p className="text-xs text-slate-500">{item.label}</p>
                          <p className="font-bold text-slate-900 text-sm">{item.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Section>
          </div>
        </div>
      </section>

      {/* Mission / Vision / Values */}
      <section className="py-24 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <Section>
            <div className="text-center mb-14">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-sky-50 border border-sky-200 text-sky-700 text-sm font-medium rounded-full mb-4">
                <Target className="w-4 h-4" />
                Mission & Vision
              </span>
              <h2 className="font-display text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
                What Drives Us
              </h2>
            </div>
          </Section>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {missions.map((item, i) => (
              <Section key={item.title} delay={i * 0.1}>
                <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 h-full">
                  <div className={`w-14 h-14 ${item.bg} rounded-2xl flex items-center justify-center mb-5`}>
                    <item.icon className={`w-7 h-7 ${item.color}`} />
                  </div>
                  <h3 className="font-display text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                  <p className="text-slate-600 leading-relaxed text-sm">{item.content}</p>
                </div>
              </Section>
            ))}
          </div>
        </div>
      </section>

      {/* Quality of Education */}
      <section className="py-24 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <Section>
            <div className="text-center mb-14">
              <span className="inline-block px-4 py-1.5 bg-sky-500/15 border border-sky-500/30 text-sky-400 text-sm font-medium rounded-full mb-4">
                Quality of Education
              </span>
              <h2 className="font-display text-4xl sm:text-5xl font-bold text-white mb-4">
                Excellence in Every Aspect
              </h2>
              <p className="text-slate-400 text-lg max-w-xl mx-auto">
                We maintain the highest standards across academics, co-curriculars, and character building.
              </p>
            </div>
          </Section>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {qualities.map((q, i) => (
              <Section key={q.title} delay={i * 0.08}>
                <div className="bg-slate-800/60 border border-slate-700/60 rounded-3xl p-6 hover:bg-slate-800 hover:border-slate-600 transition-all duration-300 hover:-translate-y-1">
                  <div className="w-12 h-12 bg-sky-500/15 rounded-2xl flex items-center justify-center mb-4">
                    <q.icon className="w-6 h-6 text-sky-400" />
                  </div>
                  <h3 className="font-semibold text-white mb-2 text-base">{q.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{q.desc}</p>
                </div>
              </Section>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
