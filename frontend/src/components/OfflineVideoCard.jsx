import React from 'react';
import { Play, Trash2, WifiOff } from 'lucide-react';

const DEFAULT_SVG_THUMB = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360"><rect width="640" height="360" fill="%231e1b4b"/><circle cx="320" cy="180" r="40" fill="%234f46e5"/><polygon points="312,165 335,180 312,195" fill="%23ffffff"/><text x="50%" y="78%" dominant-baseline="middle" text-anchor="middle" fill="%2394a3b8" font-family="sans-serif" font-size="18" font-weight="bold">Offline Video</text></svg>`;

export default function OfflineVideoCard({ video, onPlay, onDelete }) {
  const thumbSrc = video.thumbnailDataUrl || video.thumbnail || DEFAULT_SVG_THUMB;

  return (
    <div className="group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
      <div>
        <div className="relative aspect-video bg-slate-950 overflow-hidden cursor-pointer" onClick={() => onPlay(video)}>
          <img 
            src={thumbSrc} 
            alt={video.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.src = DEFAULT_SVG_THUMB;
            }}
          />
          <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-md bg-slate-900/90 text-white text-xs font-semibold backdrop-blur-md">
            {video.duration || '10:00'}
          </div>
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950/30">
            <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg transform scale-75 group-hover:scale-100 transition-transform">
              <Play className="w-6 h-6 fill-current ml-0.5" />
            </div>
          </div>
        </div>

        <div className="p-5">
          <div className="flex items-center space-x-2 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mb-1">
            <WifiOff className="w-3.5 h-3.5" />
            <span>Available Offline</span>
          </div>
          <h3 className="font-bold text-base line-clamp-1 text-slate-900 dark:text-slate-100">
            {video.title}
          </h3>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
            Downloaded on: {new Date(video.downloadDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
          </p>
        </div>
      </div>

      <div className="p-5 pt-0 grid grid-cols-2 gap-3">
        <button
          onClick={() => onPlay(video)}
          className="flex items-center justify-center space-x-2 px-3 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-500/20 transition-colors"
        >
          <Play className="w-4 h-4" />
          <span>Play Offline</span>
        </button>

        <button
          onClick={() => onDelete(video.id)}
          className="flex items-center justify-center space-x-2 px-3 py-2.5 rounded-xl border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 font-semibold text-xs hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          <span>Delete</span>
        </button>
      </div>
    </div>
  );
}
