import { useState, useEffect } from "react";

export type Vars = "USERNAME" | "COLOR" | "USER";

export function getStorageValue(key: Vars, defaultValue: any) {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem(key);
    const initial = saved ? JSON.parse(saved) : null;
    return initial || defaultValue;
  }
}

export function setStorageValue(key: Vars, value: any) {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(value));
  }
}

export const useLocalStorage = (key: Vars, defaultValue: any) => {
  const [value, setValue] = useState(() => {
    return getStorageValue(key, defaultValue);
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
};
