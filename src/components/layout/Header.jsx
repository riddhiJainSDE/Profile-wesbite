import React from 'react';
import Icon from '../ui/Icon.jsx';

const Header = ({ isDarkMode, onToggleTheme }) => (
  <header className="bg-github-card border-b border-github-border p-3 shadow-md sticky top-0 z-10">
    <div className="container mx-auto flex justify-between items-center px-4 md:px-6">
      <div className="flex items-center space-x-4">
        <a href="#" className="text-white hover:text-github-accent transition-colors">
          <Icon name="Github" className="w-8 h-8 fill-white" />
        </a>
        <input
          type="text"
          placeholder="Search or jump to..."
          className="hidden md:block bg-[#010409] text-github-text border border-github-border rounded-lg p-1 px-3 text-sm focus:border-github-accent focus:ring-1 focus:ring-github-accent transition-all w-64"
        />
      </div>
      <nav className="text-sm font-semibold space-x-4 hidden md:flex">
        <a href="#" className="text-white hover:text-github-accent transition-colors">Pull requests</a>
        <a href="#" className="text-white hover:text-github-accent transition-colors">Issues</a>
        <a href="#" className="text-white hover:text-github-accent transition-colors">Codespaces</a>
        <a href="#" className="text-white hover:text-github-accent transition-colors">Marketplace</a>
      </nav>
      <div className="flex items-center space-x-3">
        <button 
            onClick={onToggleTheme}
            className="p-2 rounded-full text-github-text hover:bg-github-border transition-colors duration-200"
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDarkMode ? (
            <Icon name="Sun" className="w-5 h-5 text-yellow-400" />
          ) : (
            <Icon name="Moon" className="w-5 h-5 text-gray-400" />
          )}
        </button>
        <div className="w-6 h-6 rounded-full bg-pink-600 text-white flex items-center justify-center text-xs font-bold ring-2 ring-github-accent/50">
          RJ
        </div>
      </div>
    </div>
  </header>
);

export default Header;
