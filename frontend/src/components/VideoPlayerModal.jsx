import React, { useState, useEffect, useRef } from 'react';
import { X, Loader2, Wifi, WifiOff, Volume2 } from 'lucide-react';
import { getVideoStreamUrl } from '../services/api';

export default function VideoPlayerModal({ video, isOffline, onClose }) {
  const videoRef = useRef(null);
  const [srcUrl, setSrcUrl] = useState('');

  useEffect(() => {
    if (isOffline && video.blob) {
      const blobUrl = URL.createObjectURL(video.blob);
      setSrcUrl(blobUrl);
      return () => URL.revokeObjectURL(blobUrl);
    } else {
      setSrcUrl(getVideoStreamUrl(video.id));
    }
  }, [video, isOffline]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/85 backdrop-blur-md animate-fade-in overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-4xl max-h-[92vh] flex flex-col bg-slate-900 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-slate-800 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-3.5 sm:p-5 border-b border-slate-800/80 bg-slate-900/90">
          <div className="flex items-center space-x-2 sm:space-x-3 overflow-hidden">
            <span className={`flex items-center space-x-1 px-2 sm:px-2.5 py-1 rounded-lg text-[10px] sm:text-xs font-bold shrink-0 ${
              isOffline ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
            }`}>
              {isOffline ? <WifiOff className="w-3 h-3" /> : <Wifi className="w-3 h-3" />}
              <span className="hidden sm:inline">{isOffline ? 'OFFLINE INDEXEDDB PLAYBACK' : 'ONLINE HTTP STREAM'}</span>
              <span className="sm:hidden">{isOffline ? 'OFFLINE' : 'ONLINE'}</span>
            </span>
            <h2 className="font-bold text-sm sm:text-lg text-white truncate">{video.title}</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer shrink-0 ml-2"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Video Player Box */}
        <div className="relative aspect-video bg-black flex items-center justify-center shrink-0">
          {srcUrl ? (
            <video 
              ref={videoRef}
              src={srcUrl} 
              controls 
              autoPlay 
              playsInline
              className="w-full h-full object-contain focus:outline-none"
            />
          ) : (
            <div className="text-slate-400 flex items-center space-x-2 p-4 text-xs sm:text-sm">
              <Loader2 className="w-5 h-5 animate-spin text-indigo-500" />
              <span>Preparing media stream...</span>
            </div>
          )}
        </div>

        {/* Video Info Footer */}
        <div className="p-4 sm:p-6 bg-slate-900 text-slate-300 overflow-y-auto max-h-40 sm:max-h-56">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-medium text-indigo-400 flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5" />
              {isOffline ? "Playing directly from local IndexedDB storage (Zero-Data)" : "Streaming online from FastApi backend"}
            </span>
            {video.duration && (
              <span className="bg-slate-800 px-2 py-0.5 rounded text-[11px] font-semibold text-slate-300">
                {video.duration}
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm leading-relaxed text-slate-300">
            {video.description || 'No description available for this video lesson.'}
          </p>
        </div>
      </div>
    </div>
  );
}

