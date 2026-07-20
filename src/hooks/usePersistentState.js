import { useEffect, useState } from "react";
import { readFromIndexedDb, writeToIndexedDb } from "../lib/indexedDb";

// Collections live in IndexedDB; lightweight display preferences stay in localStorage.
export function useIndexedDbState(key, initialValue) {
  const [value, setValue] = useState(initialValue);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let active = true;
    readFromIndexedDb(key)
      .then((saved) => {
        if (active && saved !== undefined) setValue(saved);
      })
      .catch((error) => console.error(`Unable to load ${key}`, error))
      .finally(() => {
        if (active) setHydrated(true);
      });
    return () => { active = false; };
  }, [key]);

  useEffect(() => {
    if (!hydrated) return;
    writeToIndexedDb(key, value).catch((error) => console.error(`Unable to save ${key}`, error));
  }, [hydrated, key, value]);

  return [value, setValue];
}

export function useLocalStorageState(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved === null ? initialValue : JSON.parse(saved);
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Unable to save ${key}`, error);
    }
  }, [key, value]);

  return [value, setValue];
}
