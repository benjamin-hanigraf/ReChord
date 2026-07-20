const DB_NAME = "setlist-click";
const DB_VERSION = 1;
const STORE_NAME = "appState";

function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error("Could not open IndexedDB"));
  });
}

export async function readFromIndexedDb(key) {
  const db = await openDatabase();
  try {
    return await new Promise((resolve, reject) => {
      const request = db.transaction(STORE_NAME, "readonly").objectStore(STORE_NAME).get(key);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error(`Could not read ${key}`));
    });
  } finally {
    db.close();
  }
}

export async function writeToIndexedDb(key, value) {
  const db = await openDatabase();
  try {
    await new Promise((resolve, reject) => {
      const request = db.transaction(STORE_NAME, "readwrite").objectStore(STORE_NAME).put(value, key);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error || new Error(`Could not save ${key}`));
    });
  } finally {
    db.close();
  }
}
