import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, AlertCircle, CheckCircle, GraduationCap, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function AuthPage() {
  const [searchParams] = useSearchParams();
  const tab = searchParams.get('tab') || 'login';
  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'admin'>(tab as any);
  const navigate = useNavigate();
  const { signIn, signUp, adminLogin } = useAuth();

  // Student Login
  const [studentLogin, setStudentLogin] = useState({ email: '', password: '' });
  const [studentError, setStudentError] = useState('');
  const [studentLoading, setStudentLoading] = useState(false);

  // Student Register
  const [studentReg, setStudentReg] = useState({ fullName: '', email: '', password: '', confirmPassword: '' });
  const [regError, setRegError] = useState('');
  const [regLoading, setRegLoading] = useState(false);
  const [regSuccess, setRegSuccess] = useState(false);

  // Admin Login
  const [adminForm, setAdminForm] = useState({ email: '', password: '' });
  const [adminError, setAdminError] = useState('');
  const [adminLoading, setAdminLoading] = useState(false);

  const handleStudentLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setStudentError('');
    setStudentLoading(true);
    const { error } = await signIn(studentLogin.email, studentLogin.password);
    setStudentLoading(false);
    if (error) {
      setStudentError('Invalid email or password');
    } else {
      navigate('/student');
    }
  };

  const handleStudentReg = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');
    if (!studentReg.fullName.trim()) {
      setRegError('Please enter your full name');
      return;
    }
    if (studentReg.password !== studentReg.confirmPassword) {
      setRegError('Passwords do not match');
      return;
    }
    if (studentReg.password.length < 6) {
      setRegError('Password must be at least 6 characters');
      return;
    }
    setRegLoading(true);
    const { error } = await signUp(studentReg.email, studentReg.password, studentReg.fullName);
    setRegLoading(false);
    if (error) {
      setRegError(error.message || 'Registration failed');
    } else {
      setRegSuccess(true);
      setTimeout(() => {
        setActiveTab('login');
        setStudentLogin({ email: studentReg.email, password: '' });
        setStudentReg({ fullName: '', email: '', password: '', confirmPassword: '' });
        setRegSuccess(false);
      }, 2000);
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError('');
    setAdminLoading(true);
    const success = adminLogin(adminForm.email, adminForm.password);
    setAdminLoading(false);
    if (success) {
      navigate('/admin');
    } else {
      setAdminError('Invalid admin credentials');
    }
  };

  return (
    <main className="min-h-screen pt-20 pb-12 bg-gradient-to-br from-slate-50 via-white to-sky-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Branding */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-sky-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <GraduationCap className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-900">KHSC</h1>
                  <p className="text-sky-600 font-medium">Portal</p>
                </div>
              </div>
              <h2 className="font-display text-5xl font-bold text-slate-900 mb-4 leading-tight">
                Welcome Back
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed mb-8">
                {activeTab === 'admin'
                  ? 'Access the admin dashboard to manage school content, faculty data, and approvals.'
                  : 'Login or register as a student to access your personal dashboard and updates.'}
              </p>
              <div className="space-y-4">
                {[
                  { icon: Mail, text: 'Secure authentication' },
                  { icon: Lock, text: 'Protected student data' },
                  { icon: Shield, text: 'Admin approval system' },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-sky-100 rounded-xl flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-sky-600" />
                    </div>
                    <span className="text-slate-600">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right: Forms */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
            <div className="bg-white rounded-3xl border border-slate-100 shadow-lg p-8">
              {/* Tabs */}
              <div className="flex gap-2 mb-8 bg-slate-100 p-1.5 rounded-2xl">
                <button onClick={() => { setActiveTab('login'); setStudentError(''); }}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    activeTab === 'login'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}>
                  Student Login
                </button>
                <button onClick={() => { setActiveTab('register'); setRegError(''); }}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    activeTab === 'register'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}>
                  Register
                </button>
                <button onClick={() => { setActiveTab('admin'); setAdminError(''); }}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-1 ${
                    activeTab === 'admin'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}>
                  <Shield className="w-4 h-4" /> Admin
                </button>
              </div>

              {/* Student Login Form */}
              {activeTab === 'login' && (
                <motion.form onSubmit={handleStudentLogin} className="space-y-4"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                      <input type="email" placeholder="you@example.com" value={studentLogin.email}
                        onChange={(e) => setStudentLogin({ ...studentLogin, email: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none text-sm transition-all" required />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                      <input type="password" placeholder="••••••••" value={studentLogin.password}
                        onChange={(e) => setStudentLogin({ ...studentLogin, password: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none text-sm transition-all" required />
                    </div>
                  </div>
                  {studentError && (
                    <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                      <AlertCircle className="w-4 h-4" /> {studentError}
                    </div>
                  )}
                  <button type="submit" disabled={studentLoading}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-slate-900 text-white rounded-full font-semibold text-sm hover:bg-slate-800 transition-all hover:-translate-y-0.5 disabled:opacity-60">
                    {studentLoading ? 'Logging in...' : (<><ArrowRight className="w-4 h-4" /> Sign In</>)}
                  </button>
                </motion.form>
              )}

              {/* Student Register Form */}
              {activeTab === 'register' && (
                <motion.form onSubmit={handleStudentReg} className="space-y-4"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                  {regSuccess && (
                    <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-sm">
                      <CheckCircle className="w-4 h-4" /> Registration successful! Redirecting...
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                      <input type="text" placeholder="Your full name" value={studentReg.fullName}
                        onChange={(e) => setStudentReg({ ...studentReg, fullName: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none text-sm transition-all" required />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                      <input type="email" placeholder="you@example.com" value={studentReg.email}
                        onChange={(e) => setStudentReg({ ...studentReg, email: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none text-sm transition-all" required />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                      <input type="password" placeholder="••••••••" value={studentReg.password}
                        onChange={(e) => setStudentReg({ ...studentReg, password: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none text-sm transition-all" required />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Confirm Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                      <input type="password" placeholder="••••••••" value={studentReg.confirmPassword}
                        onChange={(e) => setStudentReg({ ...studentReg, confirmPassword: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none text-sm transition-all" required />
                    </div>
                  </div>
                  {regError && (
                    <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                      <AlertCircle className="w-4 h-4" /> {regError}
                    </div>
                  )}
                  <button type="submit" disabled={regLoading}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-sky-600 text-white rounded-full font-semibold text-sm hover:bg-sky-700 transition-all hover:-translate-y-0.5 disabled:opacity-60">
                    {regLoading ? 'Creating Account...' : (<>Create Account</>)}
                  </button>
                </motion.form>
              )}

              {/* Admin Login Form */}
              {activeTab === 'admin' && (
                <motion.form onSubmit={handleAdminLogin} className="space-y-4"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                    <p className="text-sm text-blue-900">Admin credentials required. Contact administration for access.</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Admin ID</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                      <input type="email" placeholder="admin@gmail.com" value={adminForm.email}
                        onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none text-sm transition-all" required />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                      <input type="password" placeholder="••••••••" value={adminForm.password}
                        onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none text-sm transition-all" required />
                    </div>
                  </div>
                  {adminError && (
                    <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                      <AlertCircle className="w-4 h-4" /> {adminError}
                    </div>
                  )}
                  <button type="submit" disabled={adminLoading}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-slate-900 text-white rounded-full font-semibold text-sm hover:bg-slate-800 transition-all hover:-translate-y-0.5 disabled:opacity-60">
                    {adminLoading ? 'Verifying...' : (<><Shield className="w-4 h-4" /> Admin Login</>)}
                  </button>
                </motion.form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
