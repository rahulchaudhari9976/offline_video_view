import { openDB } from 'idb';

const DB_NAME = 'OfflineLearningHubDB';
const DB_VERSION = 1;
const STORE_NAME = 'downloaded_videos';

/**
 * Initialize IndexedDB object store for offline videos
 */
export async function initDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    },
  });
}

/**
 * Retrieve all videos saved locally in IndexedDB
 */
export async function getAllOfflineVideos() {
  const db = await initDB();
  return db.getAll(STORE_NAME);
}

/**
 * Retrieve a specific video record by ID
 */
export async function getOfflineVideo(id) {
  const db = await initDB();
  return db.get(STORE_NAME, id);
}

/**
 * Save/update a video record and blob in IndexedDB
 */
export async function saveOfflineVideo(videoItem) {
  const db = await initDB();
  return db.put(STORE_NAME, videoItem);
}

/**
 * Delete a video from IndexedDB storage
 */
export async function deleteOfflineVideo(id) {
  const db = await initDB();
  return db.delete(STORE_NAME, id);
}
