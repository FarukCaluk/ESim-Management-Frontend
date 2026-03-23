export enum StorageKey {
  Token = 'token',
  Role = 'role',
  User = 'user',
}

export const localStorageHelper = {
  get<T = string>(key: StorageKey): T | null {
    const value = localStorage.getItem(key);
    try {
      return value ? (JSON.parse(value) as T) : null;
    } catch {
      return value as T;
    }
  },
  set<T = string>(key: StorageKey, value: T) {
    localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
  },
  remove(key: StorageKey) {
    localStorage.removeItem(key);
  },
  clear() {
    localStorage.clear();
  },
};
