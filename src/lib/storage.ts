class MemoryStorage implements Storage {
  private store: Map<string, string> = new Map();

  get length(): number {
    return this.store.size;
  }

  clear(): void {
    this.store.clear();
  }

  getItem(key: string): string | null {
    return this.store.has(key) ? this.store.get(key)! : null;
  }

  key(index: number): string | null {
    const keys = Array.from(this.store.keys());
    return keys[index] || null;
  }

  removeItem(key: string): void {
    this.store.delete(key);
  }

  setItem(key: string, value: string): void {
    this.store.set(key, value);
  }
}

function getSafeStorage(type: 'localStorage' | 'sessionStorage'): Storage {
  try {
    if (typeof window === 'undefined') {
      return new MemoryStorage();
    }
    const storage = window[type];
    if (!storage) {
      return new MemoryStorage();
    }
    const testKey = '__storage_test__';
    storage.setItem(testKey, testKey);
    storage.removeItem(testKey);
    return storage;
  } catch (e) {
    console.warn(`[SafeStorage] ${type} is blocked or not available in this environment. Falling back to in-memory store.`, e);
    return new MemoryStorage();
  }
}

export const safeLocalStorage: Storage = getSafeStorage('localStorage');
export const safeSessionStorage: Storage = getSafeStorage('sessionStorage');
