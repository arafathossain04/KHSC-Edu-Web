import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import AcademicPage from './pages/AcademicPage';
import FacultyPage from './pages/FacultyPage';
import AlbumPage from './pages/AlbumPage';
import AuthPage from './pages/AuthPage';
import StudentPortal from './pages/StudentPortal';
import AdminDashboard from './pages/AdminDashboard';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AuthProvider>
        <div className="min-h-screen bg-white flex flex-col">
          <Navbar />
          <div className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/academic" element={<AcademicPage />} />
              <Route path="/faculty" element={<FacultyPage />} />
              <Route path="/album" element={<AlbumPage />} />
              <Route path="/login" element={<AuthPage />} />
              <Route path="/student" element={<StudentPortal />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="*" element={<div className="pt-32 text-center"><h1>Page not found</h1></div>} />
            </Routes>
          </div>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
