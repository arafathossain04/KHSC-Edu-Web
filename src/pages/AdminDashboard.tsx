import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutGrid, FileText, Users, MessageSquare, LogOut, Plus, Trash2, Check, X, Loader, Upload } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import type { Notice, Faculty, Review, AcademicFile } from '../types';

type TabType = 'overview' | 'notices' | 'faculty' | 'reviews' | 'files';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { isAdmin, adminLogout } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [loading, setLoading] = useState(false);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [academicFiles, setAcademicFiles] = useState<AcademicFile[]>([]);

  // Form states
  const [noticeForm, setNoticeForm] = useState({ title: '', content: '', category: 'general', is_pinned: false });
  const [facultyForm, setFacultyForm] = useState({ name: '', designation: '', subject: '', faculty_type: 'teacher', email: '', photo_url: '', bio: '' });
  const [fileForm, setFileForm] = useState({ title: '', file_type: 'routine', class_level: 'All', file_url: '' });
  const [fileTypeFilter, setFileTypeFilter] = useState<'routine' | 'syllabus' | 'calendar' | 'lift'>('routine');

  const [showNoticeForm, setShowNoticeForm] = useState(false);
  const [showFacultyForm, setShowFacultyForm] = useState(false);
  const [showFileForm, setShowFileForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isAdmin) navigate('/');
    loadData();
  }, [isAdmin, navigate]);

  const loadData = async () => {
    setLoading(true);
    const [noticesRes, reviewsRes, facultyRes, filesRes] = await Promise.all([
      supabase.from('notices').select('*').order('created_at', { ascending: false }),
      supabase.from('reviews').select('*').order('created_at', { ascending: false }),
      supabase.from('faculty').select('*').order('sort_order', { ascending: true }),
      supabase.from('academic_files').select('*').order('uploaded_at', { ascending: false }),
    ]);
    setNotices(noticesRes.data || []);
    setReviews(reviewsRes.data || []);
    setFaculty(facultyRes.data || []);
    setAcademicFiles(filesRes.data || []);
    setLoading(false);
  };

  // Notice handlers
  const handleAddNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeForm.title.trim() || !noticeForm.content.trim()) return;
    setSubmitting(true);
    const { error } = await supabase.from('notices').insert({
      title: noticeForm.title,
      content: noticeForm.content,
      category: noticeForm.category,
      is_pinned: noticeForm.is_pinned,
    });
    setSubmitting(false);
    if (!error) {
      setNoticeForm({ title: '', content: '', category: 'general', is_pinned: false });
      setShowNoticeForm(false);
      loadData();
    }
  };

  const handleDeleteNotice = async (id: string) => {
    if (confirm('Delete this notice?')) {
      await supabase.from('notices').delete().eq('id', id);
      loadData();
    }
  };

  // Faculty handlers
  const handleAddFaculty = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!facultyForm.name.trim() || !facultyForm.designation.trim()) return;
    setSubmitting(true);
    const { error } = await supabase.from('faculty').insert({
      name: facultyForm.name,
      designation: facultyForm.designation,
      subject: facultyForm.subject || '',
      faculty_type: facultyForm.faculty_type,
      email: facultyForm.email || '',
      photo_url: facultyForm.photo_url || '',
      bio: facultyForm.bio || '',
    });
    setSubmitting(false);
    if (!error) {
      setFacultyForm({ name: '', designation: '', subject: '', faculty_type: 'teacher', email: '', photo_url: '', bio: '' });
      setShowFacultyForm(false);
      loadData();
    }
  };

  const handleDeleteFaculty = async (id: string) => {
    if (confirm('Delete this faculty member?')) {
      await supabase.from('faculty').delete().eq('id', id);
      loadData();
    }
  };

  // File handlers
  const handleAddFile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileForm.title.trim() || !fileForm.file_url.trim()) return;
    setSubmitting(true);
    const { error } = await supabase.from('academic_files').insert({
      title: fileForm.title,
      file_type: fileForm.file_type,
      class_level: fileForm.class_level,
      file_url: fileForm.file_url,
    });
    setSubmitting(false);
    if (!error) {
      setFileForm({ title: '', file_type: 'routine', class_level: 'All', file_url: '' });
      setShowFileForm(false);
      loadData();
    }
  };

  const handleDeleteFile = async (id: string) => {
    if (confirm('Delete this file?')) {
      await supabase.from('academic_files').delete().eq('id', id);
      loadData();
    }
  };

  // Review handlers
  const handleApproveReview = async (id: string) => {
    await supabase.from('reviews').update({ is_approved: true }).eq('id', id);
    loadData();
  };

  const handleRejectReview = async (id: string) => {
    await supabase.from('reviews').delete().eq('id', id);
    loadData();
  };

  const handleLogout = () => {
    adminLogout();
    navigate('/');
  };

  const filteredFiles = academicFiles.filter(f => f.file_type === fileTypeFilter);

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Top Nav */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <h1 className="font-display text-2xl font-bold text-slate-900">Admin Dashboard</h1>
          <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl transition-all">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </nav>

      <div className="pt-20 pb-12 max-w-7xl mx-auto px-4 sm:px-6">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {[
            { id: 'overview', label: 'Overview', icon: LayoutGrid },
            { id: 'notices', label: 'Notices', icon: FileText },
            { id: 'reviews', label: 'Reviews', icon: MessageSquare },
            { id: 'faculty', label: 'Faculty', icon: Users },
            { id: 'files', label: 'Academic Files', icon: FileText },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-slate-900 text-white'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                }`}>
                <Icon className="w-4 h-4" /> {tab.label}
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader className="w-8 h-8 text-sky-600 animate-spin" />
          </div>
        ) : (
          <>
            {/* Overview */}
            {activeTab === 'overview' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { icon: FileText, label: 'Notices', value: notices.length, color: 'rose' },
                  { icon: MessageSquare, label: 'Pending Reviews', value: reviews.filter(r => !r.is_approved).length, color: 'amber' },
                  { icon: Users, label: 'Faculty Members', value: faculty.length, color: 'blue' },
                  { icon: Check, label: 'Approved Reviews', value: reviews.filter(r => r.is_approved).length, color: 'emerald' },
                ].map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div key={stat.label} className={`bg-${stat.color}-50 border border-${stat.color}-200 rounded-3xl p-6`}>
                      <div className={`w-12 h-12 bg-${stat.color}-100 rounded-2xl flex items-center justify-center mb-4`}>
                        <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                      </div>
                      <p className={`text-${stat.color}-700 text-sm font-medium`}>{stat.label}</p>
                      <p className={`text-3xl font-bold text-${stat.color}-900 mt-2`}>{stat.value}</p>
                    </div>
                  );
                })}
              </motion.div>
            )}

            {/* Notices */}
            {activeTab === 'notices' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-2xl font-bold text-slate-900">Manage Notices</h2>
                  <button onClick={() => setShowNoticeForm(!showNoticeForm)}
                    className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-xl hover:bg-sky-700 transition-all">
                    <Plus className="w-4 h-4" /> Add Notice
                  </button>
                </div>

                {showNoticeForm && (
                  <form onSubmit={handleAddNotice} className="bg-white rounded-3xl p-6 border border-slate-200 space-y-4">
                    <input type="text" placeholder="Notice Title" value={noticeForm.title}
                      onChange={(e) => setNoticeForm({ ...noticeForm, title: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none text-sm" required />
                    <textarea placeholder="Notice Content" value={noticeForm.content}
                      onChange={(e) => setNoticeForm({ ...noticeForm, content: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none text-sm resize-none" required />
                    <select value={noticeForm.category}
                      onChange={(e) => setNoticeForm({ ...noticeForm, category: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none text-sm">
                      <option value="general">General</option>
                      <option value="admission">Admission</option>
                      <option value="exam">Exam</option>
                      <option value="event">Event</option>
                      <option value="result">Result</option>
                    </select>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={noticeForm.is_pinned}
                        onChange={(e) => setNoticeForm({ ...noticeForm, is_pinned: e.target.checked })} />
                      <span className="text-sm font-medium">Pin this notice</span>
                    </label>
                    <div className="flex gap-2">
                      <button type="submit" disabled={submitting}
                        className="flex-1 py-2.5 bg-sky-600 text-white rounded-xl font-medium hover:bg-sky-700 disabled:opacity-60 transition-all">
                        {submitting ? 'Saving...' : 'Add Notice'}
                      </button>
                      <button type="button" onClick={() => setShowNoticeForm(false)}
                        className="px-4 py-2.5 bg-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-300 transition-all">
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                <div className="space-y-3">
                  {notices.map((notice) => (
                    <div key={notice.id} className="bg-white rounded-2xl p-5 border border-slate-200 flex items-start justify-between hover:shadow-sm transition-all">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {notice.is_pinned && <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">Pinned</span>}
                          <span className="text-xs font-medium text-slate-500 capitalize">{notice.category}</span>
                        </div>
                        <h3 className="font-semibold text-slate-900">{notice.title}</h3>
                        <p className="text-sm text-slate-500 mt-1 line-clamp-2">{notice.content}</p>
                      </div>
                      <button onClick={() => handleDeleteNotice(notice.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all ml-2 flex-shrink-0">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {notices.length === 0 && <p className="text-center text-slate-500 py-8">No notices yet</p>}
                </div>
              </motion.div>
            )}

            {/* Faculty */}
            {activeTab === 'faculty' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-2xl font-bold text-slate-900">Faculty & Staff</h2>
                  <button onClick={() => setShowFacultyForm(!showFacultyForm)}
                    className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-xl hover:bg-sky-700 transition-all">
                    <Plus className="w-4 h-4" /> Add Faculty
                  </button>
                </div>

                {showFacultyForm && (
                  <form onSubmit={handleAddFaculty} className="bg-white rounded-3xl p-6 border border-slate-200 space-y-4">
                    <input type="text" placeholder="Full Name" value={facultyForm.name}
                      onChange={(e) => setFacultyForm({ ...facultyForm, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none text-sm" required />
                    <input type="text" placeholder="Designation" value={facultyForm.designation}
                      onChange={(e) => setFacultyForm({ ...facultyForm, designation: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none text-sm" required />
                    <input type="text" placeholder="Subject (if teacher)" value={facultyForm.subject}
                      onChange={(e) => setFacultyForm({ ...facultyForm, subject: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none text-sm" />
                    <select value={facultyForm.faculty_type}
                      onChange={(e) => setFacultyForm({ ...facultyForm, faculty_type: e.target.value as any })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none text-sm">
                      <option value="principal">Principal</option>
                      <option value="teacher">Teacher</option>
                      <option value="staff">Staff</option>
                      <option value="ex_principal">Ex-Principal</option>
                      <option value="ex_chairman">Ex-Chairman</option>
                    </select>
                    <input type="email" placeholder="Email" value={facultyForm.email}
                      onChange={(e) => setFacultyForm({ ...facultyForm, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none text-sm" />
                    <input type="url" placeholder="Photo URL" value={facultyForm.photo_url}
                      onChange={(e) => setFacultyForm({ ...facultyForm, photo_url: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none text-sm" />
                    <textarea placeholder="Bio" value={facultyForm.bio}
                      onChange={(e) => setFacultyForm({ ...facultyForm, bio: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none text-sm resize-none" />
                    <div className="flex gap-2">
                      <button type="submit" disabled={submitting}
                        className="flex-1 py-2.5 bg-sky-600 text-white rounded-xl font-medium hover:bg-sky-700 disabled:opacity-60 transition-all">
                        {submitting ? 'Saving...' : 'Add Faculty'}
                      </button>
                      <button type="button" onClick={() => setShowFacultyForm(false)}
                        className="px-4 py-2.5 bg-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-300 transition-all">
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {faculty.map((member) => (
                    <div key={member.id} className="bg-white rounded-2xl p-5 border border-slate-200 hover:shadow-sm transition-all">
                      {member.photo_url && <img src={member.photo_url} alt={member.name} className="w-full h-32 object-cover rounded-xl mb-3" />}
                      <h3 className="font-semibold text-slate-900">{member.name}</h3>
                      <p className="text-sm text-slate-500">{member.designation}</p>
                      {member.subject && <p className="text-xs text-sky-600 mt-1">{member.subject}</p>}
                      <button onClick={() => handleDeleteFaculty(member.id)}
                        className="w-full mt-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-all">
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
                {faculty.length === 0 && <p className="text-center text-slate-500 py-8">No faculty members added</p>}
              </motion.div>
            )}

            {/* Reviews */}
            {activeTab === 'reviews' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <h2 className="font-display text-2xl font-bold text-slate-900">Approve Reviews</h2>
                <div className="space-y-3">
                  {reviews.filter(r => !r.is_approved).map((review) => (
                    <div key={review.id} className="bg-white rounded-2xl p-5 border border-slate-200 hover:shadow-sm transition-all">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-slate-900">{review.student_name}</h3>
                          <p className="text-xs text-slate-500">{review.batch}</p>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => handleApproveReview(review.id)}
                            className="p-2 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200 transition-all">
                            <Check className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleRejectReview(review.id)}
                            className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-slate-600 text-sm">{review.content}</p>
                      <div className="flex items-center gap-1 mt-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <div key={i} className={`w-4 h-4 rounded-full ${i < review.rating ? 'bg-amber-400' : 'bg-slate-200'}`} />
                        ))}
                      </div>
                    </div>
                  ))}
                  {reviews.filter(r => !r.is_approved).length === 0 && <p className="text-center text-slate-500 py-8">No pending reviews</p>}
                </div>
              </motion.div>
            )}

            {/* Academic Files */}
            {activeTab === 'files' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-2xl font-bold text-slate-900">Academic Files</h2>
                  <button onClick={() => setShowFileForm(!showFileForm)}
                    className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-xl hover:bg-sky-700 transition-all">
                    <Plus className="w-4 h-4" /> Upload File
                  </button>
                </div>

                {/* File Type Tabs */}
                <div className="flex gap-2">
                  {(['routine', 'syllabus', 'calendar', 'lift'] as const).map(type => (
                    <button key={type} onClick={() => setFileTypeFilter(type)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                        fileTypeFilter === type
                          ? 'bg-slate-900 text-white'
                          : 'bg-white text-slate-600 border border-slate-200'
                      }`}>
                      {type === 'routine' ? 'Class Routine' : type === 'syllabus' ? 'Syllabus' : type === 'calendar' ? 'Academic Calendar' : 'Lift Late'}
                    </button>
                  ))}
                </div>

                {showFileForm && (
                  <form onSubmit={handleAddFile} className="bg-white rounded-3xl p-6 border border-slate-200 space-y-4">
                    <input type="text" placeholder="File Title" value={fileForm.title}
                      onChange={(e) => setFileForm({ ...fileForm, title: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none text-sm" required />
                    <select value={fileForm.file_type}
                      onChange={(e) => setFileForm({ ...fileForm, file_type: e.target.value as any })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none text-sm">
                      <option value="routine">Class Routine</option>
                      <option value="syllabus">Syllabus</option>
                      <option value="calendar">Academic Calendar</option>
                      <option value="lift">Lift Late</option>
                    </select>
                    <input type="text" placeholder="Class Level (e.g., 'Class VI-X' or 'All')" value={fileForm.class_level}
                      onChange={(e) => setFileForm({ ...fileForm, class_level: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none text-sm" required />
                    <input type="url" placeholder="File URL (PDF link)" value={fileForm.file_url}
                      onChange={(e) => setFileForm({ ...fileForm, file_url: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none text-sm" required />
                    <div className="flex gap-2">
                      <button type="submit" disabled={submitting}
                        className="flex-1 py-2.5 bg-sky-600 text-white rounded-xl font-medium hover:bg-sky-700 disabled:opacity-60 transition-all">
                        {submitting ? 'Uploading...' : 'Upload File'}
                      </button>
                      <button type="button" onClick={() => setShowFileForm(false)}
                        className="px-4 py-2.5 bg-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-300 transition-all">
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                <div className="space-y-3">
                  {filteredFiles.map((file) => (
                    <div key={file.id} className="bg-white rounded-2xl p-5 border border-slate-200 flex items-center justify-between hover:shadow-sm transition-all">
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900">{file.title}</h3>
                        <p className="text-sm text-slate-500 mt-1">Class: {file.class_level}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <a href={file.file_url} target="_blank" rel="noopener noreferrer"
                          className="p-2 bg-sky-50 text-sky-600 rounded-lg hover:bg-sky-100 transition-all">
                          <FileText className="w-4 h-4" />
                        </a>
                        <button onClick={() => handleDeleteFile(file.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {filteredFiles.length === 0 && <p className="text-center text-slate-500 py-8">No files for this category</p>}
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
