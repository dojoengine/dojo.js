import Cookies from "js-cookie";

const hasLocalStorageSupport = (): boolean => {
  try {
    const testKey = "__test__";
    if (typeof window !== "undefined") {
      window.localStorage.setItem(testKey, testKey);
      window.localStorage.removeItem(testKey);
      return true;
    }
  } catch (e) {
    return false;
  }
  return false;
};

const isLocalStorage = hasLocalStorageSupport();

const safeParse = (data: string): any => {
  try {
    if (data === "") return null;
    return JSON.parse(data);
  } catch (e) {
    console.error("Error parsing JSON data:", e, "Data:", data);
    return null;
  }
};

const Storage = {
  keys: (): string[] => {
    if (isLocalStorage) {
      return Object.keys(window.localStorage);
    }
    return Object.keys(Cookies.get());
  },

  get: (key: string): any => {
    if (isLocalStorage) {
      return safeParse(window.localStorage.getItem(key) || "");
    }
    return safeParse(Cookies.get(key) || "");
  },

  set: (key: string, value: any): void => {
    const data = JSON.stringify(value);
    if (isLocalStorage) {
      window.localStorage.setItem(key, data);
    } else {
      Cookies.set(key, data, {
        secure: true,
        sameSite: "strict",
      });
    }
  },

  remove: (key: string): void => {
    if (isLocalStorage) {
      window.localStorage.removeItem(key);
    } else {
      Cookies.remove(key);
    }
  },

  clear: (): void => {
    if (isLocalStorage) {
      window.localStorage.clear();
    } else {
      const cookies = Cookies.get();
      Object.keys(cookies).forEach((key) => Cookies.remove(key));
    }
  },
};

export default Storage;