import React, { useState } from 'react';
import { PlayCircle, Globe, HardDriveDownload, Wifi, WifiOff, Menu, X } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, isOnline, downloadedCount }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Brand Logo */}
          <div
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => handleTabClick('home')}
          >
            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <PlayCircle className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg text-slate-900 dark:text-white tracking-tight">
                Offline Learning Hub
              </span>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl">
            <button
              onClick={() => handleTabClick('home')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg font-medium text-xs sm:text-sm transition-colors cursor-pointer ${activeTab === 'home'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
            >
              <Globe className="w-4 h-4" />
              <span>Online Mode</span>
            </button>

            <button
              onClick={() => handleTabClick('offline')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg font-medium text-xs sm:text-sm transition-colors cursor-pointer ${activeTab === 'offline'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
            >
              <HardDriveDownload className="w-4 h-4" />
              <span>Offline Mode</span>
              {downloadedCount > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-indigo-600 text-white font-semibold">
                  {downloadedCount}
                </span>
              )}
            </button>
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center space-x-3">
            {/* Network Status Badge */}
            <div className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium border ${isOnline
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
              : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800'
              }`}>
              <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-amber-500 animate-ping'}`} />
              {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
              <span>{isOnline ? 'Online' : 'Offline'}</span>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
              aria-label="Toggle Mobile Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-slate-200 dark:border-slate-800">
            <div className="flex flex-col space-y-1">
              <button
                onClick={() => handleTabClick('home')}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium ${activeTab === 'home'
                  ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400'
                  : 'text-slate-700 dark:text-slate-300'
                  }`}
              >
                <Globe className="w-4 h-4" />
                <span>Online Mode</span>
              </button>
              <button
                onClick={() => handleTabClick('offline')}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium ${activeTab === 'offline'
                  ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400'
                  : 'text-slate-700 dark:text-slate-300'
                  }`}
              >
                <div className="flex items-center space-x-3">
                  <HardDriveDownload className="w-4 h-4" />
                  <span>Offline Mode</span>
                </div>
                {downloadedCount > 0 && (
                  <span className="px-2 py-0.5 text-xs rounded-full bg-indigo-600 text-white font-semibold">
                    {downloadedCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        )}

      </div>
    </header>
  );
}
