import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar';
import VideoCard from './components/VideoCard';
import OfflineVideoCard from './components/OfflineVideoCard';
import VideoPlayerModal from './components/VideoPlayerModal';
import { getAllOfflineVideos, saveOfflineVideo, deleteOfflineVideo } from './services/db';
import { getVideos, getVideoDownloadUrl, formatAssetUrl } from './services/api';
import { Search, VideoOff, DownloadCloud, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';

export default function App() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [activeTab, setActiveTab] = useState(() => (!navigator.onLine ? 'offline' : 'home'));
  const [isDark, setIsDark] = useState(true);
  const [videos, setVideos] = useState([]);
  const [offlineVideos, setOfflineVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
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
      setActiveTab('offline');
      showToast('You are offline.', 'error');
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
    setFetchError(false);
    try {
      const res = await getVideos(searchQuery);
      if (res && res.data) {
        setVideos(res.data);
      }
    } catch (err) {
      console.error("Error fetching online videos:", err);
      setFetchError(true);
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
    if (!navigator.onLine) {
      showToast("Internet connection required to download videos.", "error");
      return;
    }

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
      let thumbnailDataUrl = null;
      try {
        if (thumbUrl) {
          const thumbRes = await axios.get(thumbUrl, { responseType: 'blob' });
          thumbnailDataUrl = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(thumbRes.data);
          });
        }
      } catch (e) {
        console.warn("Could not cache thumbnail data URL for offline use:", e);
      }

      const offlineRecord = {
        id: video.id,
        title: video.title,
        description: video.description,
        duration: video.duration,
        thumbnail: thumbUrl,
        thumbnailDataUrl: thumbnailDataUrl,
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

      <main className="flex-1 max-w-7xl w-full mx-auto px-3.5 sm:px-6 lg:px-8 py-4 sm:py-8">

        {/* Responsive Hero Header Banner */}
        <div className="mb-6 sm:mb-8 p-3 sm:p-4 lg:p-5 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 text-white shadow-xl relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-48 h-48 sm:w-64 sm:h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
          <div className="relative z-10 max-w-2xl">
            <span className="px-3 py-1 rounded-full bg-white/20 text-[10px] sm:text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
              Continuous Learning Anywhere
            </span>
            <h1 className="mt-2.5 sm:mt-3 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight">
              Watch Online or Save for Zero-Data Offline Study
            </h1>
            <p className="mt-2 sm:mt-3 text-indigo-100 text-xs sm:text-base leading-relaxed opacity-95">
              This is a basic webapp which can help student to download and view the video in offline mode without internet...
            </p>
          </div>
        </div>

        {/* TAB: ONLINE CATALOG */}
        {activeTab === 'home' && (
          <div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
              {/* Search Bar */}
              <div className="relative w-full sm:w-96">
                <Search className="w-4 h-4 sm:w-5 sm:h-5 absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search courses and topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 sm:pl-11 pr-8 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs"
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 text-right sm:text-left self-end sm:self-auto">
                Showing {videos.length} available lessons
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800 animate-pulse">
                    <div className="aspect-video bg-slate-200 dark:bg-slate-800"></div>
                    <div className="p-4 sm:p-5 space-y-3">
                      <div className="h-4 sm:h-5 bg-slate-200 dark:bg-slate-800 rounded-md w-3/4"></div>
                      <div className="h-3 sm:h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-full"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : videos.length === 0 ? (
              <div className="text-center py-12 sm:py-16 px-4 bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-slate-800">
                <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-full bg-indigo-50 dark:bg-indigo-950/80 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4">
                  <VideoOff className="w-7 h-7 sm:w-8 sm:h-8" />
                </div>
                <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-slate-100">
                  {!isOnline ? "You are currently offline" : fetchError ? "Failed to connect to backend" : "No videos found"}
                </h3>
                <p className="text-slate-500 text-xs sm:text-sm mt-1.5 max-w-md mx-auto leading-relaxed">
                  {!isOnline
                    ? "Connect to the internet to browse and download new lessons, or switch to your Offline Library tab to watch saved videos."
                    : fetchError
                      ? "Could not fetch videos from backend server. If your backend is hosted on a free platform like Render, it may take 30-50 seconds to wake up."
                      : "Try adjusting your search query to find lessons."}
                </p>
                {(!isOnline || fetchError) && (
                  <button
                    onClick={fetchVideos}
                    className="mt-5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs sm:text-sm inline-flex items-center gap-2 shadow-md transition-all cursor-pointer"
                  >
                    <RefreshCw className="w-4 h-4" />
                    {!isOnline ? "Retry Network Connection" : "Retry Connection"}
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-6 sm:mb-8">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold">Offline Downloads</h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                  Saved directly in browser IndexedDB storage. Works 100% without internet.
                </p>
              </div>
              <span className="text-xs px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-200 dark:border-emerald-800">
                {offlineVideos.length} Video{offlineVideos.length === 1 ? '' : 's'} Stored
              </span>
            </div>

            {offlineVideos.length === 0 ? (
              <div className="text-center py-14 sm:py-20 px-4 bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-slate-800">
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-slate-100 dark:bg-slate-800/80 flex items-center justify-center text-slate-400 mb-4">
                  <DownloadCloud className="w-8 h-8 sm:w-10 sm:h-10 text-indigo-500" />
                </div>
                <h3 className="font-bold text-lg sm:text-xl text-slate-800 dark:text-slate-200">No Offline Videos Saved</h3>
                <p className="text-slate-500 text-xs sm:text-sm mt-2 max-w-md mx-auto leading-relaxed">
                  Go to the Online Catalog and click "Download" on any video lesson to save it for zero-data offline playback.
                </p>
                <button
                  onClick={() => setActiveTab('home')}
                  className="mt-6 px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold text-xs sm:text-sm hover:bg-indigo-700 transition-colors shadow-md cursor-pointer"
                >
                  Explore Online Catalog
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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

      {/* Toast Snackbar (Mobile friendly bottom positioning) */}
      {toast && (
        <div className={`fixed bottom-4 left-4 right-4 sm:left-auto sm:right-5 sm:max-w-md z-50 flex items-center space-x-3 px-4 py-3 rounded-2xl shadow-2xl transition-all duration-300 backdrop-blur-md ${toast.type === 'error' ? 'bg-rose-600/95 text-white' : 'bg-emerald-600/95 text-white'
          }`}>
          {toast.type === 'error' ? <AlertCircle className="w-5 h-5 shrink-0" /> : <CheckCircle className="w-5 h-5 shrink-0" />}
          <span className="font-semibold text-xs sm:text-sm">{toast.message}</span>
        </div>
      )}

      <footer className="border-t border-slate-200/80 dark:border-slate-800/80 py-5 text-center text-[11px] sm:text-xs text-slate-500">
        Offline Learning Hub &copy; 2026
      </footer>
    </div>
  );
}

