import React from 'react';
import { Play, Download, CheckCircle2, Loader2 } from 'lucide-react';
import { formatAssetUrl } from '../services/api';

const DEFAULT_SVG_THUMB = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360"><rect width="640" height="360" fill="%231e1b4b"/><circle cx="320" cy="180" r="40" fill="%234f46e5"/><polygon points="312,165 335,180 312,195" fill="%23ffffff"/><text x="50%" y="78%" dominant-baseline="middle" text-anchor="middle" fill="%2394a3b8" font-family="sans-serif" font-size="18" font-weight="bold">Offline Video</text></svg>`;

export default function VideoCard({ video, onWatch, onDownload, isDownloaded, isDownloading, progress }) {
  const thumbUrl = formatAssetUrl(video.thumbnail);

  return (
    <div className="group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Video Thumbnail area */}
        <div 
          className="relative aspect-video bg-slate-950 overflow-hidden cursor-pointer touch-manipulation" 
          onClick={() => onWatch(video)}
        >
          <img 
            src={thumbUrl || DEFAULT_SVG_THUMB} 
            alt={video.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
            onError={(e) => {
              e.target.src = DEFAULT_SVG_THUMB;
            }}
          />
          {/* Duration Badge */}
          <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-slate-950/80 text-white text-[11px] font-semibold backdrop-blur-md border border-white/10">
            {video.duration || '00:10'}
          </div>

          {/* Hover / Active Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-slate-950/30 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-indigo-600/90 text-white flex items-center justify-center shadow-lg shadow-indigo-600/40 backdrop-blur-sm transform scale-95 sm:scale-75 group-hover:scale-100 transition-transform">
              <Play className="w-6 h-6 sm:w-7 sm:h-7 fill-current ml-0.5" />
            </div>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-4 sm:p-5">
          <h3 className="font-bold text-base sm:text-lg line-clamp-1 text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {video.title}
          </h3>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {video.description || 'Educational video lesson available for online streaming and offline playback.'}
          </p>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 font-medium">
            <span>Size: {video.size || '1.1 MB'}</span>
            <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              HD Lesson
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons (Touch Friendly min-h-[44px]) */}
      <div className="p-4 sm:p-5 pt-0 grid grid-cols-2 gap-2.5 sm:gap-3">
        <button
          onClick={() => onWatch(video)}
          className="flex items-center justify-center space-x-2 min-h-[42px] px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-xs sm:text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer active:scale-95"
        >
          <Play className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span>Watch</span>
        </button>

        {isDownloaded ? (
          <button
            disabled
            className="flex items-center justify-center space-x-1.5 min-h-[42px] px-3 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-bold text-xs sm:text-sm border border-emerald-200 dark:border-emerald-800/80 cursor-default"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Saved ✓</span>
          </button>
        ) : isDownloading ? (
          <button
            disabled
            className="relative overflow-hidden flex items-center justify-center space-x-1.5 min-h-[42px] px-3 py-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-300 font-semibold text-xs sm:text-sm border border-indigo-200 dark:border-indigo-800/80 cursor-wait"
          >
            {/* Progress bar background fill */}
            <div 
              className="absolute left-0 top-0 bottom-0 bg-indigo-200/50 dark:bg-indigo-800/40 transition-all duration-300"
              style={{ width: `${progress || 10}%` }}
            />
            <Loader2 className="w-4 h-4 animate-spin text-indigo-600 dark:text-indigo-400 z-10" />
            <span className="z-10">{progress ? `${progress}%` : 'Saving...'}</span>
          </button>
        ) : (
          <button
            onClick={() => onDownload(video)}
            className="flex items-center justify-center space-x-2 min-h-[42px] px-3 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-indigo-500/20 transition-colors cursor-pointer active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
          </button>
        )}
      </div>
    </div>
  );
}

