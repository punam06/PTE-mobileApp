import { useState, useEffect, createContext, useContext } from 'react';
import { I18nConfig, getI18nConfig, Locale, t, formatTime, formatDate, formatTemperature, formatWindSpeed } from '../utils/i18n';

// Context for i18n configuration
const I18nContext = createContext<{
  config: I18nConfig;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
  formatTime: (date: Date) => string;
  formatDate: (date: Date) => string;
  formatTemperature: (temp: number) => string;
  formatWindSpeed: (speed: number) => string;
} | null>(null);

// Custom hook for internationalization
export const useI18n = () => {
  const [config, setConfig] = useState<I18nConfig>(getI18nConfig());

  const setLocale = (locale: Locale) => {
    const newConfig = getI18nConfig(locale);
    setConfig(newConfig);
    // Store user preference in localStorage
    localStorage.setItem('preferred-locale', locale);
  };

  // Load saved locale preference on mount
  useEffect(() => {
    const savedLocale = localStorage.getItem('preferred-locale') as Locale;
    if (savedLocale) {
      setConfig(getI18nConfig(savedLocale));
    }
  }, []);

  return {
    config,
    setLocale,
    t: (key: string) => t(key, config.locale),
    formatTime: (date: Date) => formatTime(date, config),
    formatDate: (date: Date) => formatDate(date, config),
    formatTemperature: (temp: number) => formatTemperature(temp, config),
    formatWindSpeed: (speed: number) => formatWindSpeed(speed, config)
  };
};

// Provider component
export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const i18nValues = useI18n();

  return (
    <I18nContext.Provider value={i18nValues}>
      {children}
    </I18nContext.Provider>
  );
};

// Hook to use i18n context
export const useI18nContext = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18nContext must be used within an I18nProvider');
  }
  return context;
};
