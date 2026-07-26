import React, { useState } from 'react';
import { PlayCircle, Globe, HardDriveDownload, Sun, Moon, Wifi, WifiOff, Menu, X } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, isOnline, downloadedCount }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 glass-effect border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">

          {/* Logo */}
          <div
            className="flex items-center space-x-2.5 sm:space-x-3 cursor-pointer group"
            onClick={() => handleTabClick('home')}
          >
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 text-white group-hover:scale-105 transition-transform">
              <PlayCircle className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-base sm:text-xl tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 dark:from-indigo-400 dark:via-purple-400 dark:to-violet-400 bg-clip-text text-transparent">
                  Offline Hub
                </span>
                <span className="hidden md:inline-block text-[11px] px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 font-semibold border border-indigo-200 dark:border-indigo-800">
                  React 19
                </span>
              </div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium sm:hidden">
                Zero-Data Video Player
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2 bg-slate-100/70 dark:bg-slate-900/70 p-1.5 rounded-2xl border border-slate-200/60 dark:border-slate-800/60">
            <button
              onClick={() => handleTabClick('home')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-semibold text-xs sm:text-sm transition-all cursor-pointer ${activeTab === 'home'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
                }`}
            >
              <Globe className="w-4 h-4" />
              <span>Online Catalog</span>
            </button>

            <button
              onClick={() => handleTabClick('offline')}
              className={`relative flex items-center space-x-2 px-4 py-2 rounded-xl font-semibold text-xs sm:text-sm transition-all cursor-pointer ${activeTab === 'offline'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
                }`}
            >
              <HardDriveDownload className="w-4 h-4" />
              <span>Offline Library</span>
              {downloadedCount > 0 && (
                <span className={`ml-1 px-2 py-0.5 text-xs rounded-full font-extrabold ${activeTab === 'offline'
                  ? 'bg-white text-indigo-600'
                  : 'bg-indigo-600 text-white'
                  }`}>
                  {downloadedCount}
                </span>
              )}
            </button>
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Status indicator */}
            <div className={`flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-semibold ${isOnline
              ? 'bg-emerald-100/90 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/80'
              : 'bg-amber-100/90 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-200 dark:border-amber-800/80 animate-pulse'
              }`}>
              {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />}
              <span className="hidden sm:inline">{isOnline ? 'Online' : 'Offline Mode'}</span>
              <span className="sm:hidden text-[11px]">{isOnline ? 'Online' : 'Offline'}</span>
            </div>

            {/* Mobile Hamburger Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Toggle Mobile Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200/80 dark:border-slate-800/80 animate-fade-in">
            <div className="flex flex-col space-y-2">
              <button
                onClick={() => handleTabClick('home')}
                className={`flex items-center justify-between px-4 py-3 rounded-2xl font-semibold text-sm transition-all ${activeTab === 'home'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                  : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
              >
                <div className="flex items-center space-x-3">
                  <Globe className="w-5 h-5" />
                  <span>Online Catalog</span>
                </div>
                <span className="text-xs opacity-75 font-normal">Stream</span>
              </button>

              <button
                onClick={() => handleTabClick('offline')}
                className={`flex items-center justify-between px-4 py-3 rounded-2xl font-semibold text-sm transition-all ${activeTab === 'offline'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                  : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
              >
                <div className="flex items-center space-x-3">
                  <HardDriveDownload className="w-5 h-5" />
                  <span>Offline Library</span>
                </div>
                {downloadedCount > 0 ? (
                  <span className={`px-2.5 py-0.5 text-xs rounded-full font-bold ${activeTab === 'offline' ? 'bg-white text-indigo-600' : 'bg-indigo-600 text-white'
                    }`}>
                    {downloadedCount} saved
                  </span>
                ) : (
                  <span className="text-xs opacity-60 font-normal">0 saved</span>
                )}
              </button>
            </div>
          </div>
        )}

      </div>
    </header>
  );
}

