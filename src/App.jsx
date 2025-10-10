import React, { useReducer, useEffect, useMemo, Suspense, useState, useCallback } from 'react';

// Import Redux-like Store
import { initialState, profileReducer } from './store/profileReducer.js';
// Import Data
import { PROFILE_DATA } from './data/profileData.js';
// Import Components
import Header from './components/layout/Header.jsx';
import ProfileSidebar from './components/ProfileSidebar.jsx';
import Icon from './components/ui/Icon.jsx';
// Import Pages
import Overview from './pages/Overview.jsx';
import Experience from './pages/Experience.jsx';
import Projects from './pages/Projects.jsx';
import Skills from './pages/Skills.jsx';
import CodingProfiles from './pages/CodingProfiles.jsx';

// --- Utility for Theme Persistence ---
const getInitialTheme = () => {
  if (typeof window !== 'undefined' && window.localStorage) {
    const storedPrefs = localStorage.getItem('color-theme');
    if (typeof storedPrefs === 'string') {
      return storedPrefs === 'dark';
    }
  }
  // Default to dark mode if no preference is found
  return true; 
};

// --- Tab Navigation Component ---
const ProfileTabs = ({ activeTab, dispatch, isLoading }) => {
  const tabs = useMemo(() => ([
    { id: 'Overview', label: 'Overview', count: null },
    { id: 'Experience', label: 'Experience', count: PROFILE_DATA.experience.length },
    { id: 'Projects', label: 'Projects', count: PROFILE_DATA.projects.length },
    { id: 'Skills', label: 'Skills', count: Object.values(PROFILE_DATA.skills).flat().length },
    { id: 'CodingProfiles', label: 'Coding Profiles', count: PROFILE_DATA.codingProfiles.length },
  ]), []);

  const handleTabClick = (tabId) => {
    // Only prevent re-clicking the same tab
    if (tabId === activeTab) return; 
    
    // Start loading state
    dispatch({ type: 'SET_ACTIVE_TAB' });
    
    // Simulate loading/transition delay and load the new tab
    setTimeout(() => {
      dispatch({ type: 'TAB_LOADED', payload: tabId });
    }, 300); 
  };

  return (
    <nav className="border-b border-github-border mb-4 px-4 md:px-0">
      <ul className="flex space-x-4 md:space-x-6 overflow-x-auto text-sm font-medium">
        {tabs.map((tab) => (
          <li key={tab.id} className="cursor-pointer">
            <button
              onClick={() => handleTabClick(tab.id)}
              className={`flex items-center space-x-2 py-3 px-1 transition-all duration-200 ${
                tab.id === activeTab
                  ? 'border-b-2 border-github-pink text-white' // Using pink for accent
                  : 'border-b-2 border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-600'
              } ${isLoading && tab.id === activeTab ? 'opacity-50 pointer-events-none' : ''}`}
              disabled={isLoading}
            >
              <span className="whitespace-nowrap">{tab.label}</span>
              {tab.count !== null && (
                <span className={`bg-github-border text-xs font-bold rounded-full px-2 py-0.5 ${tab.id === activeTab ? 'text-white' : 'text-gray-300'}`}>
                  {tab.count}
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

// --- Main Content Router Component (Handles which page to show) ---
const MainContent = ({ activeTab, data }) => {
  const ContentComponent = () => {
    switch (activeTab) {
      case 'Overview':
        return <Overview user={data.user} />;
      // FIX: Ensure data.experience is passed correctly to the Experience component
      case 'Experience':
        return <Experience experience={data.experience} />; 
      case 'Projects':
        return <Projects projects={data.projects} />;
      case 'Skills':
        return <Skills skills={data.skills} />;
      case 'CodingProfiles':
        return <CodingProfiles profiles={data.codingProfiles} />;
      default:
        return <Overview user={data.user} />;
    }
  };

  return (
    <Suspense fallback={
      <div className="p-10 text-center text-gray-400">
        <Icon name="Code" className="w-8 h-8 mx-auto animate-spin text-github-accent" />
        <p className="mt-3">Loading {activeTab}...</p>
      </div>
    }>
      <ContentComponent />
    </Suspense>
  );
};

// --- The Main App Component ---
const App = () => {
  const [state, dispatch] = useReducer(profileReducer, initialState);
  const { activeTab, isLoading } = state;
  const [isDarkMode, setIsDarkMode] = useState(getInitialTheme);

  // Effect to apply 'dark' class and persist preference
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('color-theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('color-theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = useCallback(() => {
    setIsDarkMode(prevMode => !prevMode);
  }, []);

  const LoadingOverlay = () => (
    <div className={`fixed inset-0 z-50 bg-github-bg/70 backdrop-blur-sm flex items-center justify-center transition-opacity duration-300 ${isLoading ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
      <div className="flex items-center space-x-3 bg-github-card p-4 rounded-xl shadow-2xl border border-github-border transform scale-105 animate-pulse">
        <Icon name="Code" className="w-6 h-6 text-pink-500" />
        <span className="text-lg font-semibold text-gray-200">Loading {activeTab} section...</span>
      </div>
      
      {/* Fix for visibility: If isLoading is false, we must still show content */}
      {!isLoading && <div className="absolute inset-0 z-0"></div>}
    </div>
  );

  return (
    <div className="min-h-screen font-inter antialiased">
      <LoadingOverlay />
      <Header isDarkMode={isDarkMode} onToggleTheme={toggleTheme} />
      <main className="container mx-auto px-0 md:px-6 py-6 md:py-8">
        <div className="block md:hidden">
          <ProfileTabs activeTab={activeTab} dispatch={dispatch} isLoading={isLoading} />
        </div>
        <div className="md:flex md:space-x-8">
          <div className="md:w-1/4">
            <ProfileSidebar user={PROFILE_DATA.user} />
          </div>
          <div className="md:w-3/4">
            <div className="hidden md:block">
              <ProfileTabs activeTab={activeTab} dispatch={dispatch} isLoading={isLoading} />
            </div>
            <div className="mt-4">
              <MainContent 
                activeTab={activeTab} 
                data={PROFILE_DATA} // PROFILE_DATA contains the experience array
              />
            </div>
          </div>
        </div>
      </main>
      <footer className="py-6 border-t border-github-border text-center text-gray-500 text-sm mt-10">
        &copy; {new Date().getFullYear()} {PROFILE_DATA.user.name}.
        <p className="mt-1">GitHub-inspired design built with React & Tailwind CSS.</p>
      </footer>
    </div>
  );
};

export default App;
