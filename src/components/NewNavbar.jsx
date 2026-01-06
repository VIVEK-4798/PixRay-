import React, { useState, useEffect } from 'react';
import {
  Bell,
  MessageSquare,
  User as UserIcon,
  ChevronDown,
  Sparkles,
  Grid,
  Compass,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { IoMdAdd, IoMdSearch } from 'react-icons/io';
import { fetchUser } from '../utils/fetchUser';
import logo from '../assets/LARGE-Black.png';

const PLACEHOLDER_AVATAR = 'https://via.placeholder.com/80?text=Avatar';

const NewNavbar = ({ searchTerm, setSearchTerm, user }) => {
  const [scrolled, setScrolled] = useState(false);
  const [showSearchBg, setShowSearchBg] = useState(false);
  const [activeTab, setActiveTab] = useState('explore');
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const navigate = useNavigate();

  // currentUser state (prefers prop `user`, otherwise localStorage)
  const [currentUser, setCurrentUser] = useState(() =>
    user || (localStorage.getItem('user') !== 'undefined' ? fetchUser() : null)
  );

  // local fallback search so input remains editable always
  const [localSearch, setLocalSearch] = useState(searchTerm || '');

  const [avatarError, setAvatarError] = useState(false);
  const [avatarSrcOverride, setAvatarSrcOverride] = useState(null);

  // sync localSearch when parent searchTerm changes
  useEffect(() => {
    if (typeof searchTerm === 'string' && searchTerm !== localSearch) {
      setLocalSearch(searchTerm);
    }
  }, [searchTerm]);

  // update currentUser when `user` prop changes
  useEffect(() => {
    if (user) setCurrentUser(user);
  }, [user]);

  // watch localStorage changes (other tabs update)
  useEffect(() => {
    const onStorage = () => {
      const stored = localStorage.getItem('user') !== 'undefined' ? fetchUser() : null;
      setCurrentUser(stored || user || null);
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [user]);

  // scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // debug logs to help if avatar fails
  // useEffect(() => {
  //   if (currentUser) {
  //     if (currentUser.imageUrl) console.log('Avatar URL:', currentUser.imageUrl);
  //   }
  // }, [currentUser]);

  const navTabs = [
    { id: 'explore', label: 'Explore', icon: <Compass size={20} /> },
    { id: 'create', label: 'Create', icon: <Sparkles size={20} /> },
  ];

  const profileMenuItems = [
    { label: 'Profile', icon: <UserIcon size={18} />, action: 'profile' },
    { label: 'Your Content', icon: <Sparkles size={18} />, action: 'profile' },
    { label: 'Saved', icon: <Grid size={18} />, action: 'saved' },
    { label: 'Log out', icon: <Bell size={18} />, action: 'logout' },
  ];

  const handleNavTabClick = (tabId) => {
    setActiveTab(tabId);
    if (tabId === 'home') navigate('/home');
    if (tabId === 'explore') navigate('/search');
    if (tabId === 'create') {
      if (currentUser) navigate('/create-pin');
      else navigate('/login');
    }
  };

  const handleProfileMenuClick = (action) => {
    const stored = localStorage.getItem('user') !== 'undefined' ? fetchUser() : null;
    if (action === 'profile' && stored?.googleId) {
      navigate(`/user-profile/${stored.googleId}`);
    } else if (action === 'logout') {
      localStorage.clear();
      setCurrentUser(null);
      navigate('/login');
    }
    setShowProfileMenu(false);
  };

  // Search handlers
  const handleSearchChange = (e) => {
    const v = e.target.value;
    if (typeof setSearchTerm === 'function') setSearchTerm(v);
    setLocalSearch(v);
  };
  const handleSearchFocus = () => {
    navigate('/Search');
    setShowSearchBg(true);
  };

  // Avatar safe onError (do NOT clear src to '')
  const onAvatarError = (e) => {
    console.warn('Avatar failed loading:', e?.target?.src);
    setAvatarError(true);
    // display placeholder; set override so <img> key/props update
    setAvatarSrcOverride(PLACEHOLDER_AVATAR);
  };

  const initials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  };

  const inputValue = typeof searchTerm === 'string' ? searchTerm : localSearch;
  const avatarToShow = avatarSrcOverride || currentUser?.imageUrl || null;

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Left: logo + tabs */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
                <img src={logo} alt="logo" className="w-28" />
              </div>

              <div className="hidden md:flex items-center space-x-1">
                {navTabs.map(tab => (
                  <button key={tab.id} onClick={() => handleNavTabClick(tab.id)} className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200 ${activeTab === tab.id ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'}`}>
                    {tab.icon}
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Center: SEARCH */}
            <div className="flex-1 max-w-2xl mx-8">
              <div className="relative group">
                {/* This overlay used to block clicks — now allow pointer events through */}
                <div className={`absolute inset-0 bg-gradient-to-r from-gray-100 to-gray-50 rounded-full transition-all duration-300 pointer-events-none ${showSearchBg ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
                <div className="relative flex items-center">
                  <IoMdSearch className="absolute left-4 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search for category"
                    value={inputValue}
                    onChange={handleSearchChange}
                    onFocus={handleSearchFocus}
                    onBlur={() => setShowSearchBg(false)}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent text-gray-900 placeholder-gray-500 transition-all duration-300"
                  />
                </div>
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              {currentUser ? (
                <>
                  <button onClick={() => navigate('/create-pin')} className="hidden md:flex items-center justify-center bg-black text-white rounded-full w-10 h-10 hover:bg-gray-900 transition-colors duration-200" aria-label="Create pin">
                    <IoMdAdd />
                  </button>

                  {/* <button className="relative p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 group">
                    <Bell size={22} className="text-gray-700 group-hover:text-gray-900" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                  </button>

                  <button className="relative p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 group">
                    <MessageSquare size={22} className="text-gray-700 group-hover:text-gray-900" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full" />
                  </button> */}

                  <div className="relative">
                    <button onClick={() => setShowProfileMenu(!showProfileMenu)} className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 transition-colors duration-200 group" aria-haspopup="true">
                      {avatarToShow && !avatarError ? (
                        // key ensures re-render if URL changes
                        <img
                          key={avatarToShow}
                          src={avatarToShow}
                          alt={`${currentUser?.name || 'User'}'s profile`}
                          className="w-8 h-8 rounded-full object-cover border-2 border-gray-100"
                          onError={onAvatarError}
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-semibold">
                          {initials(currentUser?.name)}
                        </div>
                      )}
                      <ChevronDown size={16} className={`text-gray-600 transition-transform duration-200 ${showProfileMenu ? 'rotate-180' : ''}`} />
                    </button>

                    {showProfileMenu && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setShowProfileMenu(false)} />
                        <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50 animate-in slide-in-from-top-5 duration-200">
                          <div className="px-4 py-3 border-b border-gray-100">
                            <div className="flex items-center space-x-3">
                              {avatarToShow && !avatarError ? (
                                <img src={avatarToShow} alt={`${currentUser?.name || 'User'}'s profile`} className="w-10 h-10 rounded-full object-cover" onError={onAvatarError} />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-semibold">
                                  {initials(currentUser?.name)}
                                </div>
                              )}
                              <div>
                                <p className="font-semibold text-gray-900">{currentUser?.name || 'User'}</p>
                                {currentUser?.googleId && <p className="text-sm text-gray-500">@{currentUser.googleId.slice(0,8)}</p>}
                              </div>
                            </div>
                          </div>

                          <div className="py-2">
                            {profileMenuItems.map((item, index) => (
                              <button key={index} onClick={() => handleProfileMenuClick(item.action)} className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150">
                                <div className="text-gray-600">{item.icon}</div>
                                <span className="text-gray-700 font-medium">{item.label}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <button onClick={() => navigate('/login')} className="px-4 py-2 text-sm font-medium text-gray-700 rounded-full hover:bg-gray-100 transition-colors duration-200">Log in</button>
                  <button onClick={() => navigate('/login')} className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-full hover:bg-gray-800 transition-colors duration-200">Sign up</button>
                </>
              )}
            </div>
          </div>

          {/* Mobile tabs */}
          <div className="md:hidden flex items-center justify-between px-2 py-3 border-t border-gray-200">
            {navTabs.map((tab) => (
              <button key={tab.id} onClick={() => handleNavTabClick(tab.id)} className={`flex flex-col items-center p-2 rounded-xl transition-all duration-200 ${activeTab === tab.id ? 'text-gray-900 bg-gray-100' : 'text-gray-500 hover:text-gray-700'}`}>
                <div className={`${activeTab === tab.id ? 'text-gray-900' : 'text-gray-500'}`}>{tab.icon}</div>
                <span className="text-xs font-medium mt-1">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      <div className="h-20 md:h-16" />

      <style jsx>{`
        @keyframes slideInFromTop { 0% { transform: translateY(-10px); opacity: 0; } 100% { transform: translateY(0); opacity: 1; } }
        .animate-in { animation: slideInFromTop 0.2s ease-out; }
      `}</style>
    </>
  );
};

export default NewNavbar;
