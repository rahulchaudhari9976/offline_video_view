import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar';
import VideoCard from './components/VideoCard';
import OfflineVideoCard from './components/OfflineVideoCard';
import VideoPlayerModal from './components/VideoPlayerModal';
import { getAllOfflineVideos, saveOfflineVideo, deleteOfflineVideo } from './services/db';
import { getVideos, getVideoDownloadUrl, formatAssetUrl } from './services/api';
import { Search, VideoOff, DownloadCloud, AlertCircle, CheckCircle } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isDark, setIsDark] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [videos, setVideos] = useState([]);
  const [offlineVideos, setOfflineVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeVideo, setActiveVideo] = useState(null);
  const [isPlayingOffline, setIsPlayingOffline] = useState(false);
  const [downloadingIds, setDownloadingIds] = useState({});
  const [downloadProgress, setDownloadProgress] = useState({});
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      showToast('Internet connection restored!');
    };
    const handleOffline = () => {
      setIsOnline(false);
      showToast('You are offline. Offline Library is ready!', 'error');
    };
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const loadOfflineVideos = async () => {
    try {
      const items = await getAllOfflineVideos();
      setOfflineVideos(items);
    } catch (err) {
      console.error("IndexedDB read error:", err);
    }
  };

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const res = await getVideos(searchQuery);
      setVideos(res.data);
    } catch (err) {
      console.error("Error fetching online videos:", err);
      if (navigator.onLine) {
        showToast("Failed to fetch videos from backend server.", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOfflineVideos();
    fetchVideos();
  }, [searchQuery]);

  const handleDownload = async (video) => {
    if (downloadingIds[video.id]) return;

    const existing = offlineVideos.find(v => v.id === video.id);
    if (existing) {
      showToast('Video is already saved in Offline Library!');
      return;
    }

    setDownloadingIds(prev => ({ ...prev, [video.id]: true }));
    setDownloadProgress(prev => ({ ...prev, [video.id]: 10 }));

    try {
      const downloadUrl = getVideoDownloadUrl(video.id);
      const response = await axios({
        url: downloadUrl,
        method: 'GET',
        responseType: 'blob',
        onDownloadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setDownloadProgress(prev => ({ ...prev, [video.id]: percent }));
          }
        }
      });

      const blob = response.data;
      const thumbUrl = formatAssetUrl(video.thumbnail);
      
      const offlineRecord = {
        id: video.id,
        title: video.title,
        description: video.description,
        duration: video.duration,
        thumbnail: thumbUrl,
        blob: blob,
        downloadDate: new Date().toISOString(),
        size: video.size
      };

      await saveOfflineVideo(offlineRecord);
      await loadOfflineVideos();
      showToast(`"${video.title}" downloaded successfully for offline viewing! ✓`);
    } catch (err) {
      console.error("Download failed:", err);
      showToast("Failed to download video. Check server connection.", "error");
    } finally {
      setDownloadingIds(prev => ({ ...prev, [video.id]: false }));
    }
  };

  const handleDeleteOffline = async (id) => {
    try {
      await deleteOfflineVideo(id);
      await loadOfflineVideos();
      showToast("Video removed from Offline Library.");
    } catch (err) {
      showToast("Failed to remove offline video.", "error");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isDark={isDark} 
        setIsDark={setIsDark}
        isOnline={isOnline}
        downloadedCount={offlineVideos.length}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header Banner */}
        <div className="mb-8 p-8 rounded-3xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 text-white shadow-xl relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
          <div className="relative z-10 max-w-2xl">
            <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-semibold uppercase tracking-wider">
              Continuous Learning Anywhere
            </span>
            <h1 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight">
              Watch Online or Save for Zero-Data Offline Study
            </h1>
            <p className="mt-3 text-indigo-100 text-sm sm:text-base leading-relaxed opacity-90">
              Stream course modules online or download them directly into browser IndexedDB storage for 100% offline playback anywhere.
            </p>
          </div>
        </div>

        {/* TAB: ONLINE CATALOG */}
        {activeTab === 'home' && (
          <div>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
              <div className="relative w-full sm:w-96">
                <Search className="w-5 h-5 absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search courses and topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm transition-all"
                />
              </div>
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Showing {videos.length} available lessons
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 animate-pulse">
                    <div className="aspect-video bg-slate-200 dark:bg-slate-800"></div>
                    <div className="p-5 space-y-3">
                      <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded-md w-3/4"></div>
                      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-full"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : videos.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
                <div className="w-16 h-16 mx-auto rounded-full bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 mb-4">
                  <VideoOff className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-lg">No videos found</h3>
                <p className="text-slate-500 text-sm mt-1">Try adjusting your search query or check backend connection.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.map(video => (
                  <VideoCard 
                    key={video.id} 
                    video={video} 
                    onWatch={(v) => {
                      setActiveVideo(v);
                      setIsPlayingOffline(false);
                    }}
                    onDownload={handleDownload}
                    isDownloaded={offlineVideos.some(ov => ov.id === video.id)}
                    isDownloading={downloadingIds[video.id]}
                    progress={downloadProgress[video.id]}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB: OFFLINE LIBRARY */}
        {activeTab === 'offline' && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold">Offline Downloads</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Saved directly in browser IndexedDB storage. Works 100% without internet.
                </p>
              </div>
            </div>

            {offlineVideos.length === 0 ? (
              <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
                <div className="w-20 h-20 mx-auto rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-4">
                  <DownloadCloud className="w-10 h-10" />
                </div>
                <h3 className="font-bold text-xl text-slate-800 dark:text-slate-200">No Offline Videos Saved</h3>
                <p className="text-slate-500 text-sm mt-2 max-w-md mx-auto">
                  Go to the Online Catalog and click "Download" on any video lesson to save it for offline playback.
                </p>
                <button 
                  onClick={() => setActiveTab('home')}
                  className="mt-6 px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition-colors shadow-md cursor-pointer"
                >
                  Explore Online Catalog
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {offlineVideos.map(video => (
                  <OfflineVideoCard 
                    key={video.id} 
                    video={video} 
                    onPlay={(v) => {
                      setActiveVideo(v);
                      setIsPlayingOffline(true);
                    }}
                    onDelete={handleDeleteOffline}
                  />
                ))}
              </div>
            )}
          </div>
        )}

      </main>

      {/* Video Modal Player */}
      {activeVideo && (
        <VideoPlayerModal 
          video={activeVideo} 
          isOffline={isPlayingOffline} 
          onClose={() => setActiveVideo(null)} 
        />
      )}

      {/* Toast Snackbar */}
      {toast && (
        <div className={`fixed bottom-5 right-5 z-50 flex items-center space-x-3 px-4 py-3 rounded-xl shadow-2xl transition-all duration-300 ${
          toast.type === 'error' ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'
        }`}>
          {toast.type === 'error' ? <AlertCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
          <span className="font-medium text-sm">{toast.message}</span>
        </div>
      )}

      <footer className="border-t border-slate-200 dark:border-slate-800 py-6 text-center text-xs text-slate-500">
        Offline Learning Hub &copy; 2026 &bull; React 19 + Tailwind CSS Production Application
      </footer>
    </div>
  );
}
