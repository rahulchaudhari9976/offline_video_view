import React from 'react';
import { Play, Download, CheckCircle2, Loader2 } from 'lucide-react';
import { formatAssetUrl } from '../services/api';

const DEFAULT_SVG_THUMB = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360"><rect width="640" height="360" fill="%231e1b4b"/><circle cx="320" cy="180" r="40" fill="%234f46e5"/><polygon points="312,165 335,180 312,195" fill="%23ffffff"/><text x="50%" y="78%" dominant-baseline="middle" text-anchor="middle" fill="%2394a3b8" font-family="sans-serif" font-size="18" font-weight="bold">Offline Video</text></svg>`;

export default function VideoCard({ video, onWatch, onDownload, isDownloaded, isDownloading, progress }) {
  const thumbUrl = formatAssetUrl(video.thumbnail);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between transition-shadow hover:shadow-md">
      <div>
        {/* Video Thumbnail area */}
        <div 
          className="relative aspect-video bg-slate-950 overflow-hidden cursor-pointer group" 
          onClick={() => onWatch(video)}
        >
          <img 
            src={thumbUrl || DEFAULT_SVG_THUMB} 
            alt={video.title} 
            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
            onError={(e) => {
              e.target.src = DEFAULT_SVG_THUMB;
            }}
          />
          
          {/* Duration Overlay */}
          <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/75 text-white text-xs font-medium">
            {video.duration || '00:10'}
          </div>

          {/* Hover Play Icon Overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-md">
              <Play className="w-6 h-6 fill-current ml-0.5" />
            </div>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-4">
          <h3 className="font-semibold text-base text-slate-900 dark:text-white line-clamp-1">
            {video.title}
          </h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {video.description || 'Educational video lesson available for online streaming and offline playback.'}
          </p>
          <div className="mt-3 text-xs text-slate-400 font-medium">
            <span>Size: {video.size || '1.1 MB'}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-4 pt-0 grid grid-cols-2 gap-2">
        <button
          onClick={() => onWatch(video)}
          className="flex items-center justify-center space-x-1.5 py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 font-medium text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <Play className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          <span>Watch</span>
        </button>

        {isDownloaded ? (
          <button
            disabled
            className="flex items-center justify-center space-x-1.5 py-2 px-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-medium text-xs border border-emerald-200 dark:border-emerald-800/80 cursor-default"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Saved</span>
          </button>
        ) : isDownloading ? (
          <button
            disabled
            className="relative overflow-hidden flex items-center justify-center space-x-1.5 py-2 px-3 rounded-lg bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-300 font-medium text-xs border border-indigo-200 dark:border-indigo-800 cursor-wait"
          >
            <div 
              className="absolute left-0 top-0 bottom-0 bg-indigo-200/50 dark:bg-indigo-800/40 transition-all duration-300"
              style={{ width: `${progress || 10}%` }}
            />
            <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600 dark:text-indigo-400 z-10" />
            <span className="z-10">{progress ? `${progress}%` : 'Downloading...'}</span>
          </button>
        ) : (
          <button
            onClick={() => onDownload(video)}
            className="flex items-center justify-center space-x-1.5 py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </button>
        )}
      </div>
    </div>
  );
}
