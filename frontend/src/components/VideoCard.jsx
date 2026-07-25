import React from 'react';
import { Play, Download, CheckCircle2, Loader2 } from 'lucide-react';
import { formatAssetUrl } from '../services/api';

export default function VideoCard({ video, onWatch, onDownload, isDownloaded, isDownloading, progress }) {
  const thumbUrl = formatAssetUrl(video.thumbnail);

  return (
    <div className="group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
      <div>
        <div className="relative aspect-video bg-slate-950 overflow-hidden cursor-pointer" onClick={() => onWatch(video)}>
          <img 
            src={thumbUrl} 
            alt={video.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=640&q=80';
            }}
          />
          <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-md bg-slate-900/90 text-white text-xs font-semibold backdrop-blur-md">
            {video.duration || '00:10'}
          </div>
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950/30">
            <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg transform scale-75 group-hover:scale-100 transition-transform">
              <Play className="w-6 h-6 fill-current ml-0.5" />
            </div>
          </div>
        </div>

        <div className="p-5">
          <h3 className="font-bold text-base line-clamp-1 text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {video.title}
          </h3>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {video.description || 'Educational video lesson for offline study.'}
          </p>
          <div className="mt-3 flex items-center space-x-2 text-xs text-slate-400">
            <span>Size: {video.size || '1.1 MB'}</span>
          </div>
        </div>
      </div>

      <div className="p-5 pt-0 grid grid-cols-2 gap-3">
        <button
          onClick={() => onWatch(video)}
          className="flex items-center justify-center space-x-2 px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <Play className="w-4 h-4" />
          <span>Watch</span>
        </button>

        {isDownloaded ? (
          <button
            disabled
            className="flex items-center justify-center space-x-1.5 px-3 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 font-bold text-xs border border-emerald-200 dark:border-emerald-800 cursor-default"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Saved ✓</span>
          </button>
        ) : isDownloading ? (
          <button
            disabled
            className="flex items-center justify-center space-x-1.5 px-3 py-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-semibold text-xs border border-indigo-200 dark:border-indigo-800 cursor-wait"
          >
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>{progress ? `${progress}%` : 'Saving...'}</span>
          </button>
        ) : (
          <button
            onClick={() => onDownload(video)}
            className="flex items-center justify-center space-x-2 px-3 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-500/20 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
          </button>
        )}
      </div>
    </div>
  );
}
