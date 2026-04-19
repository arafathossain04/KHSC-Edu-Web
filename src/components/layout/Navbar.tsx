import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, GraduationCap, ChevronDown, User, Shield } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  {
    label: 'Academic',
    path: '/academic',
    children: [
      { label: 'Academic Hub', path: '/academic#hub' },
      { label: 'Notice Board', path: '/academic#notices' },
      { label: 'Admission', path: '/academic#admission' },
    ],
  },
  {
    label: 'Faculty',
    path: '/faculty',
    children: [
      { label: "Principal", path: '/faculty?type=principal' },
      { label: "Teachers' Info", path: '/faculty?type=teacher' },
      { label: "Staff's Info", path: '/faculty?type=staff' },
      { label: 'Ex-Principals', path: '/faculty?type=ex_principal' },
      { label: 'Ex-Chairmen', path: '/faculty?type=ex_chairman' },
    ],
  },
  { label: 'Album', path: '/album' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const location = useLocation();
  const { user, isAdmin, signOut, adminLogout } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setOpenDropdown(null);
  }, [location]);

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'py-2' : 'py-3'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className={`flex items-center justify-between rounded-2xl px-5 py-3 transition-all duration-500 ${
          scrolled
            ? 'bg-white/90 backdrop-blur-xl border border-sky-200/60 shadow-lg shadow-sky-100/40'
            : 'bg-white/70 backdrop-blur-lg border border-sky-200/40 shadow-md'
        }`}>
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-9 h-9 bg-gradient-to-br from-sky-400 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <div className="text-sm font-bold text-slate-900 leading-tight">KHSC</div>
              <div className="text-[10px] text-sky-600 font-medium leading-tight">Est. 1948</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <div key={link.label} className="relative group"
                onMouseEnter={() => link.children && setOpenDropdown(link.label)}
                onMouseLeave={() => setOpenDropdown(null)}>
                <Link
                  to={link.path}
                  className={`flex items-center gap-1 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive(link.path)
                      ? 'bg-sky-50 text-sky-700'
                      : 'text-slate-700 hover:text-sky-700 hover:bg-sky-50/80'
                  }`}
                >
                  {link.label}
                  {link.children && <ChevronDown className="w-3.5 h-3.5 opacity-60" />}
                </Link>
                {link.children && openDropdown === link.label && (
                  <div className="absolute top-full left-0 mt-1.5 w-52 bg-white/95 backdrop-blur-xl border border-sky-100 rounded-2xl shadow-xl shadow-sky-100/50 py-2 z-50">
                    {link.children.map((child) => (
                      <Link key={child.label} to={child.path}
                        className="block px-4 py-2.5 text-sm text-slate-700 hover:text-sky-700 hover:bg-sky-50/80 mx-2 rounded-xl transition-colors duration-150">
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden lg:flex items-center gap-2">
            {isAdmin ? (
              <div className="flex items-center gap-2">
                <Link to="/admin" className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium text-slate-700 hover:text-sky-700 hover:bg-sky-50 transition-all">
                  <Shield className="w-4 h-4" /> Admin
                </Link>
                <button onClick={adminLogout}
                  className="px-4 py-2 rounded-xl text-sm font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all">
                  Logout
                </button>
              </div>
            ) : user ? (
              <div className="flex items-center gap-2">
                <Link to="/student" className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium text-slate-700 hover:text-sky-700 hover:bg-sky-50 transition-all">
                  <User className="w-4 h-4" /> Portal
                </Link>
                <button onClick={signOut}
                  className="px-4 py-2 rounded-xl text-sm font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all">
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link to="/login"
                  className="px-4 py-2 rounded-xl text-sm font-medium text-slate-700 hover:text-sky-700 hover:bg-sky-50 transition-all duration-200">
                  Login
                </Link>
                <Link to="/login?tab=register"
                  className="px-4 py-2 rounded-xl text-sm font-medium bg-slate-900 text-white hover:bg-slate-800 transition-all duration-200 shadow-sm">
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-sky-50 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden mt-2 bg-white/95 backdrop-blur-xl border border-sky-200/60 rounded-2xl shadow-xl overflow-hidden">
            <div className="py-2 px-3">
              {navLinks.map((link) => (
                <div key={link.label}>
                  <Link to={link.path}
                    className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      isActive(link.path) ? 'bg-sky-50 text-sky-700' : 'text-slate-700 hover:bg-sky-50'
                    }`}>
                    {link.label}
                  </Link>
                  {link.children && (
                    <div className="ml-4 border-l-2 border-sky-100 pl-2 mb-1">
                      {link.children.map((child) => (
                        <Link key={child.label} to={child.path}
                          className="block px-3 py-2 text-sm text-slate-600 hover:text-sky-700 rounded-lg transition-colors">
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="border-t border-sky-100 mt-2 pt-2 flex flex-col gap-2">
                {isAdmin ? (
                  <>
                    <Link to="/admin" className="block px-4 py-3 rounded-xl text-sm font-medium text-sky-700 bg-sky-50">Admin Dashboard</Link>
                    <button onClick={adminLogout} className="px-4 py-2.5 rounded-xl text-sm font-medium bg-slate-100 text-slate-700 text-left">Logout</button>
                  </>
                ) : user ? (
                  <>
                    <Link to="/student" className="block px-4 py-3 rounded-xl text-sm font-medium text-sky-700 bg-sky-50">Student Portal</Link>
                    <button onClick={signOut} className="px-4 py-2.5 rounded-xl text-sm font-medium bg-slate-100 text-slate-700 text-left">Logout</button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="block px-4 py-3 rounded-xl text-sm font-medium text-slate-700 hover:bg-sky-50">Login</Link>
                    <Link to="/login?tab=register" className="block px-4 py-3 rounded-xl text-sm font-medium bg-slate-900 text-white text-center">Register</Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
