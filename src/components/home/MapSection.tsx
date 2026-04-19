import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { MapPin, Phone, Mail, Facebook, ExternalLink, Clock } from 'lucide-react';

export default function MapSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section className="py-24 bg-white" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-sky-50 border border-sky-200 text-sky-700 text-sm font-medium rounded-full mb-4">
            <MapPin className="w-4 h-4" />
            Find Us
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
            Visit Our Campus
          </h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            Located at the heart of Khilkhet, Dhaka — easily accessible from all parts of the city.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Map */}
          <motion.div
            className="lg:col-span-2 rounded-3xl overflow-hidden border border-slate-100 shadow-sm h-80 lg:h-auto min-h-[360px]"
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}>
            <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3649.638421864141!2d90.4154443!3d23.8314444!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c65e71644137%3A0x8e713976935948a!2sKurmitola%20High%20School%20%26%20College!5e0!3m2!1sen!2sbd!4v1712950000000!5m2!1sen!2sbd"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
          </motion.div>

          {/* Info Cards */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}>
            <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 bg-sky-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-sky-600" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 mb-1">Address</p>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Ka-3, 5 মাতবর বাড়ি রোড<br />
                    Khilkhet, Dhaka 1229<br />
                    Bangladesh
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 bg-emerald-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 mb-1">Office Hours</p>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Sunday – Thursday<br />
                    7:00 AM – 5:00 PM<br />
                    <span className="text-rose-500">Closed on Friday & Saturday</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 space-y-3">
              <p className="font-semibold text-slate-900">Contact</p>
              <a href="tel: 01309107823" className="flex items-center gap-3 text-sm text-slate-600 hover:text-sky-700 transition-colors">
                <Phone className="w-4 h-4 text-slate-400" /> 01309107823
              </a>
              <a href="tel: 01309107823" className="flex items-center gap-3 text-sm text-slate-600 hover:text-sky-700 transition-colors">
                <Phone className="w-4 h-4 text-slate-400" /> 01718914123
              </a>
              <a href="tel: 01309107823" className="flex items-center gap-3 text-sm text-slate-600 hover:text-sky-700 transition-colors">
                <Phone className="w-4 h-4 text-slate-400" /> 01718292466
              </a>
              <a href="mailto:info@khsc.edu.bd" className="flex items-center gap-3 text-sm text-slate-600 hover:text-sky-700 transition-colors">
                <Mail className="w-4 h-4 text-slate-400" /> khsc1948@gmail.com
              </a>
              <a
                href="https://www.facebook.com/KHSC.edu"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">
                <Facebook className="w-4 h-4" />
                facebook.com/KHSC.edu
                <ExternalLink className="w-3.5 h-3.5 opacity-60" />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
