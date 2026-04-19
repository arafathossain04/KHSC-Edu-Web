'use client';

import { useState } from 'react'; // Added for state management
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Film, X } from 'lucide-react'; // Added X for closing the player

const videos = [
  {
    title: 'কুর্মিটোলা হাই স্কুল এন্ড কলেজের ৭৫ বছর পূর্তি উদযাপন',
    subtitle: '75 Years Anniversary Celebration',
    embedId: 'opXut7fheFA',
    channel: 'Jamuna TV',
  },
  {
    title: 'কুর্মিটোলা স্কুল অ্যান্ড কলেজের বার্ষিক ক্রীড়া প্রতিযোগিতা',
    subtitle: 'Annual Sports Competition',
    embedId: 'MFy4fb8QzLE',
    channel: 'YouTube',
  },
  {
    title: 'Kurmitola High School & College Campus Tour',
    subtitle: 'Campus Overview',
    embedId: 'FdaBILIhZNk',
    channel: 'YouTube',
  },
];

export default function DocumentarySection() {
  // State to track which video is being watched in the popup
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest text-gold uppercase mb-3">
            <span className="w-8 h-px bg-gold" />
            Media & Documentary
            <span className="w-8 h-px bg-gold" />
          </span>
          <h2 className="font-playfair text-4xl lg:text-5xl font-extrabold text-navy">
            Our Story in Videos
          </h2>
          <p className="text-gray-500 mt-4 max-w-xl mx-auto">
            Watch documentaries and coverage of our events, celebrations, and campus life
          </p>
        </motion.div>

        {/* Video Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {videos.map((video, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
              onClick={() => setSelectedVideo(video.embedId)} // Open player on click
            >
              {/* Thumbnail Container */}
              <div className="relative w-full aspect-video bg-gradient-to-br from-navy/20 to-gold/20 overflow-hidden">
                <img
                  src={`https://img.youtube.com/vi/${video.embedId}/maxresdefault.jpg`}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />

                {/* Overlay with Play Button */}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/50 transition-colors duration-300 flex items-center justify-center">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="w-16 h-16 bg-gold/90 rounded-full flex items-center justify-center shadow-lg"
                  >
                    <Play className="w-7 h-7 text-white fill-white ml-1" />
                  </motion.div>
                </div>
              </div>

              {/* Info */}
              <div className="bg-white p-5">
                <p className="text-xs font-semibold text-gold uppercase tracking-wider mb-2">
                  {video.channel}
                </p>
                <h3 className="font-semibold text-navy text-sm line-clamp-2 mb-1">
                  {video.title}
                </h3>
                <p className="text-xs text-gray-500">{video.subtitle}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* --- IN-SITE OVERLAY PLAYER --- */}
        <AnimatePresence>
          {selectedVideo && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 md:p-10"
              onClick={() => setSelectedVideo(null)} // Close when clicking background
            >
              <div className="relative w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl">
                <button 
                  className="absolute top-4 right-4 z-[60] p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                  onClick={() => setSelectedVideo(null)}
                >
                  <X className="w-6 h-6" />
                </button>
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Featured Video (Existing Section) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-14 pt-14 border-t border-gray-200"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 text-sm font-semibold text-gold mb-3">
              <Film className="w-5 h-5" />
              <span>FEATURED DOCUMENTARY</span>
            </div>
            <h3 className="font-playfair text-3xl font-bold text-navy">
              75 Years of Excellence
            </h3>
            <p className="text-gray-500 mt-2">
              A documentary celebrating our institution's historic 75-year journey
            </p>
          </div>

          <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl bg-black aspect-video">
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/opXut7fheFA"
              title="Featured Video"
              frameBorder="0"
              allowFullScreen
              className="absolute inset-0"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}