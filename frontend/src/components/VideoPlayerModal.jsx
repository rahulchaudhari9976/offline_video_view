import React, { useState, useEffect, useRef } from 'react';
import { X, Loader2 } from 'lucide-react';
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-4xl bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800">
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${
              isOffline ? 'bg-emerald-500/20 text-emerald-400' : 'bg-indigo-500/20 text-indigo-400'
            }`}>
              {isOffline ? 'OFFLINE INDEXEDDB PLAYBACK' : 'ONLINE HTTP STREAM'}
            </span>
            <h2 className="font-bold text-lg text-white truncate max-w-lg">{video.title}</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="relative aspect-video bg-black flex items-center justify-center">
          {srcUrl ? (
            <video 
              ref={videoRef}
              src={srcUrl} 
              controls 
              autoPlay 
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="text-slate-400 flex items-center space-x-2">
              <Loader2 className="w-5 h-5 animate-spin text-indigo-500" />
              <span>Preparing media stream...</span>
            </div>
          )}
        </div>

        <div className="p-6 bg-slate-900 text-slate-300">
          <p className="text-sm leading-relaxed">{video.description || 'No description available for this video.'}</p>
        </div>
      </div>
    </div>
  );
}
