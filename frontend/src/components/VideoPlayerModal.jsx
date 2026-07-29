import React, { useState, useEffect, useRef } from 'react';
import { X, Loader2, Wifi, WifiOff } from 'lucide-react';
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

  // Close modal on Escape key
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
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-xs overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-3xl flex flex-col bg-slate-900 rounded-2xl overflow-hidden shadow-xl border border-slate-800 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900">
          <div className="flex items-center space-x-3 overflow-hidden">
            <span className={`flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs font-semibold shrink-0 ${
              isOffline ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
            }`}>
              {isOffline ? <WifiOff className="w-3.5 h-3.5" /> : <Wifi className="w-3.5 h-3.5" />}
              <span>{isOffline ? 'Offline Playback (IndexedDB)' : 'Online Streaming'}</span>
            </span>
            <h2 className="font-semibold text-base text-white truncate">{video.title}</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer shrink-0 ml-2"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player Box */}
        <div className="relative aspect-video bg-black flex items-center justify-center">
          {srcUrl ? (
            <video 
              ref={videoRef}
              src={srcUrl} 
              controls 
              autoPlay 
              playsInline
              preload="metadata"
              crossOrigin="anonymous"
              className="w-full h-full object-contain focus:outline-none"
            />
          ) : (
            <div className="text-slate-400 flex items-center space-x-2 p-4 text-sm">
              <Loader2 className="w-5 h-5 animate-spin text-indigo-500" />
              <span>Loading video stream...</span>
            </div>
          )}
        </div>

        {/* Video Description Footer */}
        <div className="p-4 bg-slate-900 border-t border-slate-800/60 text-slate-300">
          <p className="text-xs sm:text-sm leading-relaxed text-slate-300">
            {video.description || 'No description provided.'}
          </p>
        </div>
      </div>
    </div>
  );
}
