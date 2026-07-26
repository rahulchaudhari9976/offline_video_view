import React from 'react';
import { Play, Trash2, WifiOff, HardDrive } from 'lucide-react';

const DEFAULT_SVG_THUMB = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360"><rect width="640" height="360" fill="%231e1b4b"/><circle cx="320" cy="180" r="40" fill="%234f46e5"/><polygon points="312,165 335,180 312,195" fill="%23ffffff"/><text x="50%" y="78%" dominant-baseline="middle" text-anchor="middle" fill="%2394a3b8" font-family="sans-serif" font-size="18" font-weight="bold">Offline Video</text></svg>`;

export default function OfflineVideoCard({ video, onPlay, onDelete }) {
  const thumbSrc = video.thumbnailDataUrl || video.thumbnail || DEFAULT_SVG_THUMB;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between transition-shadow hover:shadow-md">
      <div>
        {/* Video Thumbnail */}
        <div 
          className="relative aspect-video bg-slate-950 overflow-hidden cursor-pointer group" 
          onClick={() => onPlay(video)}
        >
          <img 
            src={thumbSrc} 
            alt={video.title} 
            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
            onError={(e) => {
              e.target.src = DEFAULT_SVG_THUMB;
            }}
          />
          <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/75 text-white text-xs font-medium">
            {video.duration || '00:10'}
          </div>
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md">
              <Play className="w-6 h-6 fill-current ml-0.5" />
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <div className="flex items-center space-x-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 mb-1">
            <WifiOff className="w-3.5 h-3.5" />
            <span>Saved Offline</span>
          </div>
          <h3 className="font-semibold text-base text-slate-900 dark:text-white line-clamp-1">
            {video.title}
          </h3>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Saved: {new Date(video.downloadDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
            <span className="flex items-center space-x-1 text-slate-400">
              <HardDrive className="w-3.5 h-3.5" />
              <span>IndexedDB</span>
            </span>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="p-4 pt-0 grid grid-cols-2 gap-2">
        <button
          onClick={() => onPlay(video)}
          className="flex items-center justify-center space-x-1.5 py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs transition-colors cursor-pointer"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Play Offline</span>
        </button>

        <button
          onClick={() => onDelete(video.id)}
          className="flex items-center justify-center space-x-1.5 py-2 px-3 rounded-lg border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 font-medium text-xs hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Delete</span>
        </button>
      </div>
    </div>
  );
}
