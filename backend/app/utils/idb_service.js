import { openDB } from 'idb';

const DB_NAME = 'OfflineLearningHubDB';
const DB_VERSION = 1;
const STORE_NAME = 'downloaded_videos';

export async function initDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    },
  });
}

export async function getAllOfflineVideos() {
  const db = await initDB();
  return db.getAll(STORE_NAME);
}

export async function getOfflineVideo(id) {
  const db = await initDB();
  return db.get(STORE_NAME, id);
}

export async function saveOfflineVideo(videoItem) {
  const db = await initDB();
  return db.put(STORE_NAME, videoItem);
}

export async function deleteOfflineVideo(id) {
  const db = await initDB();
  return db.delete(STORE_NAME, id);
}
