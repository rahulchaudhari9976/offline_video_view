import React from 'react';
import { Play, Trash2, WifiOff, HardDrive } from 'lucide-react';

const DEFAULT_SVG_THUMB = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360"><rect width="640" height="360" fill="%231e1b4b"/><circle cx="320" cy="180" r="40" fill="%234f46e5"/><polygon points="312,165 335,180 312,195" fill="%23ffffff"/><text x="50%" y="78%" dominant-baseline="middle" text-anchor="middle" fill="%2394a3b8" font-family="sans-serif" font-size="18" font-weight="bold">Offline Video</text></svg>`;

export default function OfflineVideoCard({ video, onPlay, onDelete }) {
  const thumbSrc = video.thumbnailDataUrl || video.thumbnail || DEFAULT_SVG_THUMB;

  return (
    <div className="group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Video Thumbnail */}
        <div 
          className="relative aspect-video bg-slate-950 overflow-hidden cursor-pointer touch-manipulation" 
          onClick={() => onPlay(video)}
        >
          <img 
            src={thumbSrc} 
            alt={video.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.src = DEFAULT_SVG_THUMB;
            }}
          />
          <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-slate-950/80 text-white text-[11px] font-semibold backdrop-blur-md border border-white/10">
            {video.duration || '10:00'}
          </div>
          <div className="absolute inset-0 flex items-center justify-center opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950/30">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg transform scale-95 sm:scale-75 group-hover:scale-100 transition-transform">
              <Play className="w-6 h-6 sm:w-7 sm:h-7 fill-current ml-0.5" />
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="p-4 sm:p-5">
          <div className="flex items-center space-x-2 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 mb-1.5 uppercase tracking-wider">
            <WifiOff className="w-3.5 h-3.5" />
            <span>Available Offline</span>
          </div>
          <h3 className="font-bold text-base sm:text-lg line-clamp-1 text-slate-900 dark:text-slate-100">
            {video.title}
          </h3>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Saved: {new Date(video.downloadDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
            <span className="flex items-center space-x-1 text-[11px] font-medium text-indigo-600 dark:text-indigo-400">
              <HardDrive className="w-3 h-3" />
              <span>IndexedDB</span>
            </span>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="p-4 sm:p-5 pt-0 grid grid-cols-2 gap-2.5 sm:gap-3">
        <button
          onClick={() => onPlay(video)}
          className="flex items-center justify-center space-x-2 min-h-[42px] px-3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-emerald-600/20 transition-colors cursor-pointer active:scale-95"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>Play Offline</span>
        </button>

        <button
          onClick={() => onDelete(video.id)}
          className="flex items-center justify-center space-x-1.5 min-h-[42px] px-3 py-2.5 rounded-xl border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 font-semibold text-xs sm:text-sm hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer active:scale-95"
        >
          <Trash2 className="w-4 h-4" />
          <span>Delete</span>
        </button>
      </div>
    </div>
  );
}

