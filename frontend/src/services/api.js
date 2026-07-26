import axios from 'axios';

// API Base URL from environment variable, falling back to local backend port
export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000').replace(/\/$/, '');

export const api = axios.create({
  baseURL: API_BASE_URL,
});

/**
 * Fetch video list from backend with optional search filter
 */
export const getVideos = (search = '') => 
  api.get(`/videos?search=${encodeURIComponent(search)}`);

/**
 * Get details for a single video
 */
export const getVideoDetails = (id) => 
  api.get(`/videos/${id}`);

/**
 * Return streaming URL for HTML5 video element
 */
export const getVideoStreamUrl = (id) => 
  `${API_BASE_URL}/videos/${id}/stream`;

/**
 * Return download URL for binary blob fetching
 */
export const getVideoDownloadUrl = (id) => 
  `${API_BASE_URL}/videos/${id}/download`;

/**
 * Format relative asset URLs (thumbnails/videos) with API base URL
 */
export const formatAssetUrl = (urlPath) => {
  if (!urlPath) return '';
  if (urlPath.startsWith('http://') || urlPath.startsWith('https://')) return urlPath;
  const cleanPath = urlPath.startsWith('/') ? urlPath : `/${urlPath}`;
  return `${API_BASE_URL}${cleanPath}`;
};
