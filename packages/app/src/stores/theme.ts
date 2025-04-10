import { defineStore } from 'pinia'

type ThemeMode = 'auto' | 'dark' | 'light'

const get = (key: string): string | null => {
  return localStorage.getItem(key);
};

const set = (key: string, value: string): string => {
  localStorage.setItem(key, value);
  return value;
};

const getOrSet = (key: string, if_no: string) => {
  return get(key) ?? set(key, if_no);
};

const has = (key: string) => get(key) !== null;

export const useTheme = defineStore('theme', {
  state: () => ({
    theme: getOrSet('theme', 'auto') as ThemeMode,
    sysMedia: window.matchMedia('(prefers-color-scheme: dark)'),
  }),
  actions: {
    init() {
      this.sysMedia.addEventListener('change', this.apply)
      this.apply()
    },
    apply() {
      const systemIsDark = this.sysMedia.matches
      if ((systemIsDark && this.theme === 'auto') || this.theme === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    },
    applyAndSava() {
      localStorage.setItem('theme', this.theme)
      this.apply()
    },
    switchTo(name: ThemeMode) {
      this.theme = name
      this.applyAndSava()
    },
  },
})
