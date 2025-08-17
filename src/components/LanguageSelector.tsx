import React from 'react';
import { useI18nContext } from '../hooks/useI18n';
import { Locale } from '../utils/i18n';
import './LanguageSelector.css';

interface LanguageSelectorProps {
  isVisible: boolean;
  onToggle: () => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ isVisible, onToggle }) => {
  const { config, setLocale } = useI18nContext();

  const languages: { code: Locale; name: string; flag: string }[] = [
    { code: 'en-US', name: 'English (US)', flag: '🇺🇸' },
    { code: 'en-GB', name: 'English (UK)', flag: '🇬🇧' },
    { code: 'es-ES', name: 'Español', flag: '🇪🇸' },
    { code: 'fr-FR', name: 'Français', flag: '🇫🇷' },
    { code: 'de-DE', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'ja-JP', name: '日本語', flag: '🇯🇵' },
    { code: 'zh-CN', name: '中文', flag: '🇨🇳' }
  ];

  const handleLanguageChange = (locale: Locale) => {
    setLocale(locale);
    onToggle();
  };

  const currentLanguage = languages.find(lang => lang.code === config.locale);

  return (
    <div className="language-selector">
      <button 
        className="language-toggle"
        onClick={onToggle}
        aria-label="Select language"
        aria-expanded={isVisible}
      >
        <span className="current-flag">{currentLanguage?.flag}</span>
        <span className="dropdown-arrow">{isVisible ? '▲' : '▼'}</span>
      </button>
      
      {isVisible && (
        <div className="language-dropdown" role="menu">
          <div className="language-list">
            {languages.map((language) => (
              <button
                key={language.code}
                className={`language-option ${config.locale === language.code ? 'active' : ''}`}
                onClick={() => handleLanguageChange(language.code)}
                role="menuitem"
                aria-label={`Select ${language.name}`}
              >
                <span className="language-flag">{language.flag}</span>
                <span className="language-name">{language.name}</span>
                {config.locale === language.code && (
                  <span className="checkmark">✓</span>
                )}
              </button>
            ))}
          </div>
          <div className="language-info">
            <p>
              {config.timeFormat === '12h' ? '12-hour' : '24-hour'} time format
            </p>
            <p>
              {config.temperatureUnit === 'metric' ? 'Celsius' : 'Fahrenheit'} temperature
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
