import { Link } from 'react-router-dom';
import { GraduationCap, MapPin, Phone, Mail, Facebook, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 bg-gradient-to-br from-sky-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-white font-bold text-lg leading-tight">Kurmitola High School</div>
                <div className="text-sky-400 text-sm leading-tight">& College | Est. 1948</div>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm mb-5">
              A prestigious educational institution located in Khilkhet, Dhaka. Committed to excellence in education,
              character development, and national progress since 1948.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
              <span className="font-medium text-slate-400">EIIN:</span> 107823
              <span className="mx-2 text-slate-700">|</span>
              <span className="font-medium text-slate-400">School Code:</span> 1260
              <span className="mx-2 text-slate-700">|</span>
              <span className="font-medium text-slate-400">College Code:</span> 1253
            </div>
            <a href="https://www.facebook.com/KHSC.edu" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 px-4 py-2.5 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-600/30 rounded-xl text-blue-400 text-sm font-medium transition-all duration-200 group">
              <Facebook className="w-4 h-4" />
              Follow on Facebook
              <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
            </a>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Quick Links</h3>
            <ul className="space-y-2.5">
              {[
                { label: 'Home', path: '/' },
                { label: 'About Us', path: '/about' },
                { label: 'Academic Hub', path: '/academic' },
                { label: 'Notice Board', path: '/academic#notices' },
                { label: 'Faculty', path: '/faculty' },
                { label: 'Photo Gallery', path: '/album' },
                { label: 'Admission Info', path: '/academic#admission' },
              ].map((link) => (
                <li key={link.label}>
                  <Link to={link.path}
                    className="text-sm text-slate-400 hover:text-sky-400 transition-colors duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Contact</h3>
            <ul className="space-y-3.5">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-sky-400 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-slate-400 leading-relaxed">
                  Ka-3, 5 মাতবর বাড়ি রোড,<br />
                  Khilkhet, Dhaka 1229
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-sky-400 flex-shrink-0" />
                <span className="text-sm text-slate-400">01309107823</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-sky-400 flex-shrink-0" />
                <span className="text-sm text-slate-400">khsc1948@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-500">
            Developed by{' '}
            <span className="text-sky-400 font-medium">Arafat Hossain Tushar</span>
            {' '}(Batch: HSC 2027)
          </p>
          <p className="text-xs text-slate-500 text-center">
            © Copyright 2026 Kurmitola High School & College | All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
