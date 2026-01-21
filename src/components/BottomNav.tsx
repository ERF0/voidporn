import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { HomeIcon, SearchIcon, TagIcon, HeartIcon, UserIcon } from '@/components/icons';

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  href: string;
}

const navItems: NavItem[] = [
  { id: 'home', label: 'Home', icon: HomeIcon, href: '/home' },
  { id: 'search', label: 'Search', icon: SearchIcon, href: '/search' },
  { id: 'categories', label: 'Categories', icon: TagIcon, href: '/categories' },
  { id: 'favorites', label: 'Favorites', icon: HeartIcon, href: '/favorites' },
  { id: 'profile', label: 'Profile', icon: UserIcon, href: '/profile' },
];

export function BottomNav() {
  const [activeTab, setActiveTab] = useState('home');
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  // Update active tab based on current route
  useEffect(() => {
    const currentPath = location.pathname;
    const currentItem = navItems.find(item => item.href === currentPath);
    if (currentItem) {
      setActiveTab(currentItem.id);
    } else if (currentPath === '/') {
      setActiveTab('home');
    }
  }, [location.pathname]);

  // Hide/show nav on scroll (mobile only)
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show on scroll up, hide on scroll down (after threshold)
      if (currentScrollY < lastScrollY || currentScrollY < 100) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleNavClick = (item: NavItem) => {
    setActiveTab(item.id);
    navigate(item.href);
  };

  return (
    <nav
      className={`
        fixed bottom-0 left-0 right-0 z-50
        transition-transform duration-300 ease-liquid
        ${isVisible ? 'translate-y-0' : 'translate-y-full'}
        md:hidden
      `}
    >
      {/* Glass background */}
      <div className="absolute inset-0 bg-vp-black/80 backdrop-blur-xl" />
      
      {/* Top border glow */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-vp-red/30 to-transparent" />
      
      {/* Nav content */}
      <div className="relative flex items-center justify-around px-2 pb-safe">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item)}
              className={`
                relative flex flex-col items-center justify-center
                w-14 h-14 rounded-xl
                transition-all duration-200 ease-smooth
                ${isActive 
                  ? 'text-vp-red' 
                  : 'text-vp-text-muted hover:text-vp-text'
                }
              `}
            >
              {/* Active indicator glow */}
              {isActive && (
                <div className="absolute inset-0 rounded-xl bg-vp-red/10 animate-pulse-glow" />
              )}
              
              {/* Icon */}
              <Icon 
                size={22} 
                className={`
                  transition-transform duration-200 ease-elastic
                  ${isActive ? 'scale-110' : 'scale-100'}
                `}
              />
              
              {/* Label */}
              <span
                className={`
                  text-[10px] mt-0.5 font-medium
                  transition-all duration-200
                  ${isActive ? 'opacity-100' : 'opacity-70'}
                `}
              >
                {item.label}
              </span>
              
              {/* Active dot indicator */}
              {isActive && (
                <div className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-vp-red" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export function DesktopNav() {
  const [activeTab, setActiveTab] = useState('home');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const currentPath = location.pathname;
    const currentItem = navItems.find(item => item.href === currentPath);
    if (currentItem) {
      setActiveTab(currentItem.id);
    } else if (currentPath === '/') {
      setActiveTab('home');
    }
  }, [location.pathname]);

  const handleNavClick = (item: NavItem) => {
    setActiveTab(item.id);
    navigate(item.href);
  };

  return (
    <nav className="hidden md:flex items-center gap-1">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        
        return (
          <button
            key={item.id}
            onClick={() => handleNavClick(item)}
            className={`
              relative flex items-center gap-2 px-4 py-2 rounded-lg
              transition-all duration-200 ease-smooth
              ${isActive 
                ? 'text-vp-red bg-vp-red/10' 
                : 'text-vp-text-secondary hover:text-vp-text hover:bg-vp-surface'
              }
            `}
          >
            <Icon size={18} />
            <span className="text-sm font-medium">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
