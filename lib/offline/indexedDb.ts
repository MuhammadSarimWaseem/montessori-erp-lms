import { ObservationNote, AttendanceRecord, OfflineQueueItem } from '../types';

const DB_NAME = 'MontessoriErpOfflineDb';
const DB_VERSION = 1;
const STORE_QUEUE = 'syncQueue';

export function openOfflineDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !('indexedDB' in window)) {
      reject(new Error('IndexedDB not supported in this environment'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_QUEUE)) {
        db.createObjectStore(STORE_QUEUE, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveOfflineItem(type: 'OBSERVATION' | 'ATTENDANCE', payload: any): Promise<OfflineQueueItem> {
  const item: OfflineQueueItem = {
    id: `queue-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    type,
    payload,
    createdAt: new Date().toISOString()
  };

  try {
    const db = await openOfflineDb();
    const tx = db.transaction(STORE_QUEUE, 'readwrite');
    const store = tx.objectStore(STORE_QUEUE);
    store.add(item);
    await new Promise((resolve) => {
      tx.oncomplete = resolve;
    });
  } catch (err) {
    console.warn('Fallback to LocalStorage for offline queueing:', err);
    const existing = JSON.parse(localStorage.getItem('montessori_offline_queue') || '[]');
    existing.push(item);
    localStorage.setItem('montessori_offline_queue', JSON.stringify(existing));
  }

  return item;
}

export async function getOfflineQueue(): Promise<OfflineQueueItem[]> {
  try {
    const db = await openOfflineDb();
    const tx = db.transaction(STORE_QUEUE, 'readonly');
    const store = tx.objectStore(STORE_QUEUE);
    const request = store.getAll();
    return new Promise((resolve) => {
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => resolve([]);
    });
  } catch (err) {
    const existing = JSON.parse(localStorage.getItem('montessori_offline_queue') || '[]');
    return existing;
  }
}

export async function clearOfflineQueue(): Promise<void> {
  try {
    const db = await openOfflineDb();
    const tx = db.transaction(STORE_QUEUE, 'readwrite');
    const store = tx.objectStore(STORE_QUEUE);
    store.clear();
  } catch (err) {
    localStorage.removeItem('montessori_offline_queue');
  }
}
