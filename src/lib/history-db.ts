import type { AnalysisResult } from "./demo-analysis";

const DB_NAME = "CropGuardianDB";
const STORE_NAME = "diagnoses";
const DB_VERSION = 1;
const LOCAL_STORAGE_KEY = "leafcheck.history.v1";

/**
 * Open or upgrade the IndexedDB database.
 */
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      reject(new Error("IndexedDB not available"));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
        store.createIndex("date", "date", { unique: false });
        store.createIndex("plant", "plant", { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Save a diagnosis result into IndexedDB.
 */
export async function saveDiagnosisToDB(item: AnalysisResult): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(item);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch {
    // Fallback gracefully to localStorage
    try {
      const raw = window.localStorage.getItem(LOCAL_STORAGE_KEY);
      const parsed: AnalysisResult[] = raw ? JSON.parse(raw) : [];
      const updated = [item, ...parsed.filter((p) => p.id !== item.id)].slice(0, 30);
      window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      /* ignore storage quota error */
    }
  }
}

/**
 * Load all stored diagnosis results from IndexedDB (newest first).
 */
export async function loadDiagnosesFromDB(): Promise<AnalysisResult[]> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();

      req.onsuccess = () => {
        const results = req.result as AnalysisResult[];
        results.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        resolve(results);
      };
      req.onerror = () => reject(req.error);
    });
  } catch {
    // Fallback to localStorage
    try {
      const raw = window.localStorage.getItem(LOCAL_STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
}

/**
 * Delete a specific diagnosis by id from IndexedDB.
 */
export async function deleteDiagnosisFromDB(id: string): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch {
    try {
      const raw = window.localStorage.getItem(LOCAL_STORAGE_KEY);
      if (raw) {
        const parsed: AnalysisResult[] = JSON.parse(raw);
        const filtered = parsed.filter((p) => p.id !== id);
        window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));
      }
    } catch {
      /* ignore */
    }
  }
}

/**
 * Clear all diagnoses from IndexedDB.
 */
export async function clearDiagnosesFromDB(): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const req = store.clear();
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch {
    try {
      window.localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }
}

/**
 * Migrate any existing items from localStorage into IndexedDB on initialization.
 */
export async function migrateLocalStorageToIndexedDB(): Promise<void> {
  if (typeof window === "undefined") return;
  try {
    const raw = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return;
    const items: AnalysisResult[] = JSON.parse(raw);
    if (Array.isArray(items) && items.length > 0) {
      for (const item of items) {
        await saveDiagnosisToDB(item);
      }
    }
  } catch {
    /* migration is best-effort */
  }
}
