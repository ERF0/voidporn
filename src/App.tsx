import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { BottomNav, DesktopNav } from '@/components/BottomNav';
import { Hero } from '@/sections/Hero';
import { Home } from '@/pages/Home';
import { Search } from '@/pages/Search';
import { Categories } from '@/pages/Categories';
import { Favorites } from '@/pages/Favorites';
import { Profile } from '@/pages/Profile';
import { Admin } from '@/pages/Admin';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-vp-black">
        {/* Desktop Navigation */}
        <div className="hidden md:block fixed top-0 left-0 right-0 z-50 bg-vp-black/80 backdrop-blur-xl border-b border-vp-surface-light">
          <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
            {/* Logo */}
            <a href="/" className="flex items-center gap-2 group">
              <span className="text-xl font-black text-white tracking-tight">
                VOID
                <span className="text-vp-red">PORN</span>
              </span>
            </a>

            {/* Desktop Nav */}
            <DesktopNav />

            {/* Right side actions */}
            <div className="flex items-center gap-3">
              <button className="w-9 h-9 rounded-full bg-vp-surface flex items-center justify-center hover:bg-vp-surface-light transition-colors">
                <BellIcon size={18} className="text-vp-text" />
              </button>
              <a
                href="/profile"
                className="w-9 h-9 rounded-full bg-vp-red/20 flex items-center justify-center hover:bg-vp-red/30 transition-colors"
              >
                <UserIcon size={18} className="text-vp-red" />
              </a>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:pt-16">
          <Routes>
            {/* Landing Page */}
            <Route path="/" element={<Hero />} />

            {/* Main App Routes */}
            <Route path="/home" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin" element={<Admin />} />

            {/* Redirect any unknown routes to home */}
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
        </div>

        {/* Mobile Bottom Navigation */}
        <BottomNav />
      </div>
    </BrowserRouter>
  );
}

// Import icons used in App.tsx
import { BellIcon, UserIcon } from '@/components/icons';

export default App;
