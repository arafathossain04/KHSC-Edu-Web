import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Star, Send, MessageSquare } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Review } from '../../types';

export default function ReviewSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [form, setForm] = useState({ student_name: '', batch: '', rating: 5, content: '' });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  useEffect(() => {
    supabase.from('reviews').select('*').eq('is_approved', true)
      .order('created_at', { ascending: false })
      .then(({ data }) => data && setReviews(data));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.student_name.trim() || !form.content.trim()) {
      setError('Please fill in all required fields.');
      return;
    }
    setSubmitting(true);
    setError('');
    const { error: err } = await supabase.from('reviews').insert({
      student_name: form.student_name,
      batch: form.batch,
      rating: form.rating,
      content: form.content,
      is_approved: false,
    });
    setSubmitting(false);
    if (err) {
      setError('Failed to submit. Please try again.');
    } else {
      setSubmitted(true);
      setForm({ student_name: '', batch: '', rating: 5, content: '' });
    }
  };

  return (
    <section className="py-24 bg-gradient-to-b from-white to-sky-50/30" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-50 border border-amber-200 text-amber-700 text-sm font-medium rounded-full mb-4">
            <MessageSquare className="w-4 h-4" />
            Student Reviews
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
            What Our Students Say
          </h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            Hear from the alumni and current students who have experienced our institution firsthand.
          </p>
        </motion.div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
          {reviews.map((review, i) => (
            <motion.div
              key={review.id}
              className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}>
              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} className={`w-4 h-4 ${j < review.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />
                ))}
              </div>
              <p className="text-slate-700 text-sm leading-relaxed mb-4 line-clamp-4">"{review.content}"</p>
              <div className="border-t border-slate-100 pt-3">
                <p className="font-semibold text-slate-900 text-sm">{review.student_name}</p>
                {review.batch && <p className="text-xs text-sky-600 font-medium mt-0.5">Batch: {review.batch}</p>}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Submit Form */}
        <motion.div
          className="max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.3 }}>
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
            <h3 className="font-display text-2xl font-bold text-slate-900 mb-2">Share Your Experience</h3>
            <p className="text-slate-500 text-sm mb-6">Your review will be visible after admin approval.</p>

            {submitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-emerald-500 fill-emerald-500" />
                </div>
                <h4 className="font-semibold text-slate-900 text-lg mb-2">Thank You!</h4>
                <p className="text-slate-500 text-sm">Your review has been submitted and is pending approval.</p>
                <button onClick={() => setSubmitted(false)}
                  className="mt-4 text-sky-600 text-sm font-medium hover:text-sky-700">
                  Submit another review
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Your Name *</label>
                    <input
                      value={form.student_name}
                      onChange={(e) => setForm({ ...form, student_name: e.target.value })}
                      placeholder="e.g. Rakibul Hasan"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none text-sm transition-all"
                      required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Batch / Year</label>
                    <input
                      value={form.batch}
                      onChange={(e) => setForm({ ...form, batch: e.target.value })}
                      placeholder="e.g. SSC 2024"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none text-sm transition-all" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Rating *</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((r) => (
                      <button key={r} type="button" onClick={() => setForm({ ...form, rating: r })}>
                        <Star className={`w-7 h-7 transition-colors ${r <= form.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200 hover:text-amber-200'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Your Review *</label>
                  <textarea
                    value={form.content}
                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                    placeholder="Share your experience at KHSC..."
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none text-sm transition-all resize-none"
                    required />
                </div>

                {error && <p className="text-sm text-rose-600 bg-rose-50 px-4 py-2.5 rounded-xl">{error}</p>}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-slate-900 text-white rounded-full font-semibold text-sm hover:bg-slate-800 transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed">
                  {submitting ? 'Submitting...' : (<><Send className="w-4 h-4" /> Submit Review</>)}
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
