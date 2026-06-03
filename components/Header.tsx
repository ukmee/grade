import React from 'react';

interface HeaderProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
  onReset: () => void;
  onContactClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ isDarkMode, toggleTheme, onReset, onContactClick }) => {
  return (
    <header className="flex flex-col md:flex-row items-center justify-between px-6 py-4 bg-surface-light dark:bg-[#111722] border-b border-gray-200 dark:border-gray-800 sticky top-0 z-30 shadow-sm transition-colors duration-300">
      {/* Logo Area */}
      <div className="flex items-center gap-2 mb-4 md:mb-0">
        <img 
          src="/calc.jpg" 
          alt="GradeCalc Pro Logo" 
          className="w-8 h-8 md:w-10 md:h-10 object-contain drop-shadow-sm" 
          onError={(e) => {
             // Fallback to icon if image fails to load
             e.currentTarget.style.display = 'none';
             e.currentTarget.nextElementSibling?.classList.remove('hidden');
          }}
        />
        {/* Fallback Icon (Hidden by default, shown if image fails) */}
        <span className="material-symbols-outlined text-black dark:text-white hidden" style={{ fontSize: '32px' }}>school</span>
        
        <div className="flex flex-col">
          <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-none">
            GradeCalc Pro
          </h1>
        </div>
      </div>

      {/* Actions Area */}
      <div className="flex items-center gap-3 flex-wrap justify-center">
        
        {/* Contact Dev Button - Updated Design */}
        <button 
          onClick={onContactClick}
          className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-black text-black dark:bg-transparent dark:border-white dark:text-white hover:bg-gray-50 dark:hover:bg-white/10 rounded-full shadow-md transition-all active:scale-95 font-bold text-sm shrink-0"
          title="Contact Developer"
        >
           <span className="material-symbols-outlined text-[20px]">support_agent</span>
           <span>Contact Dev</span>
        </button>

        <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1"></div>

        {/* Theme Toggle - Updated Animation */}
        <button 
          onClick={toggleTheme}
          className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 text-slate-600 dark:text-gray-400 focus:outline-none active:scale-90"
          title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          <span className={`material-symbols-outlined text-[24px] transition-transform duration-500 ${isDarkMode ? 'rotate-[360deg]' : 'rotate-0'}`}>
            {isDarkMode ? 'light_mode' : 'dark_mode'}
          </span>
        </button>

        {/* Reset Button */}
        <button 
          onClick={onReset}
          className="text-sm font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-2 rounded-lg transition-colors flex items-center gap-1"
          title="Reset All Data"
        >
            <span className="material-symbols-outlined text-[18px]">restart_alt</span>
            Reset
        </button>
      </div>
    </header>
  );
};

export default Header;