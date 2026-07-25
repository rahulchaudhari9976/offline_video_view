import React from 'react';
import { PlayCircle, Globe, HardDriveDownload, Sun, Moon, Wifi, WifiOff } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, isOnline, downloadedCount }) {
  return (
    <header className="sticky top-0 z-40 glass-effect border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('home')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-md shadow-indigo-500/20 text-white">
              <PlayCircle className="w-6 h-6" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400 bg-clip-text text-transparent">
                Offline Learning Hub
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300 font-semibold">
                React + Tailwind + FastApi
              </span>
            </div>
          </div>

          {/* Nav items */}
          <nav className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab('home')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium text-sm transition-all ${activeTab === 'home'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
            >
              <Globe className="w-4 h-4" />
              <span>Online Catalog</span>
            </button>

            <button
              onClick={() => setActiveTab('offline')}
              className={`relative flex items-center space-x-2 px-4 py-2 rounded-xl font-medium text-sm transition-all ${activeTab === 'offline'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
            >
              <HardDriveDownload className="w-4 h-4" />
              <span>Offline Library</span>
              {downloadedCount > 0 && (
                <span className={`ml-1 px-2 py-0.5 text-xs rounded-full font-bold ${activeTab === 'offline' ? 'bg-white text-indigo-600' : 'bg-indigo-600 text-white'
                  }`}>
                  {downloadedCount}
                </span>
              )}
            </button>
          </nav>

          {/* Right actions */}
          <div className="flex items-center space-x-3">
            <div className={`hidden md:flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold ${isOnline
              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
              : 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
              }`}>
              {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
              <span>{isOnline ? 'Online Mode' : 'Offline Mode'}</span>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}
