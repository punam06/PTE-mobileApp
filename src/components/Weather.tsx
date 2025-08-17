import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useI18nContext } from '../hooks/useI18n';
import { countryCodeToName } from '../utils/countryList';
import './Weather.css';

interface WeatherProps {
  isActive: boolean;
}

interface WeatherData {
  location: string;
  country: string; // ISO country code
  countryName: string; // Full country name
  temperature: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  feelsLike: number;
  pressure: number;
}

interface WeatherError {
  message: string;
  code?: string;
}

export const Weather: React.FC<WeatherProps> = ({ isActive }) => {
  const { t, formatTime: formatTimeI18n, formatTemperature, formatWindSpeed, config } = useI18nContext();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<WeatherError | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Public API key for OpenWeatherMap - explicitly exposed for this demo application
  const API_KEY = '27b5e7bcaaea4262d9f45296b32ba71c';
  const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';
  
  // Force HTTPS for API requests to avoid mixed content issues
  const secureBaseUrl = BASE_URL.replace('http:', 'https:');

  const fetchWeatherByCoords = async (lat: number, lon: number) => {
    try {
      setLoading(true);
      setError(null);
      console.log(`Fetching weather for coordinates: ${lat}, ${lon}`);

      const response = await axios.get(secureBaseUrl, {
        params: {
          lat,
          lon,
          appid: API_KEY,
          units: config.temperatureUnit === 'imperial' ? 'imperial' : 'metric'
        },
        timeout: 10000
      });

      const data = response.data;
      const weatherData: WeatherData = {
        location: data.name,
        country: data.sys.country,
        countryName: countryCodeToName[data.sys.country] || data.sys.country, // Use full country name from our mapping
        temperature: Math.round(data.main.temp),
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        feelsLike: Math.round(data.main.feels_like),
        pressure: data.main.pressure
      };

      setWeather(weatherData);
      setLastUpdated(new Date());
    } catch (err: any) {
      console.error('Weather fetch error:', err);
      
      if (err.response?.status === 401) {
        setError({ 
          message: 'Invalid API key. Please check your OpenWeatherMap API configuration.',
          code: 'API_KEY_ERROR'
        });
      } else if (err.response?.status === 429) {
        setError({ 
          message: 'Rate limit exceeded. Please try again later.',
          code: 'RATE_LIMIT'
        });
      } else if (err.code === 'ECONNABORTED') {
        setError({ 
          message: 'Request timeout. Please check your internet connection.',
          code: 'TIMEOUT'
        });
      } else {
        setError({ 
          message: 'Unable to fetch weather data. Please try again later.',
          code: 'GENERAL_ERROR'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherByCity = async (city: string = 'London') => {
    try {
      setLoading(true);
      setError(null);
      console.log(`Fetching weather for city: ${city}`);

      const response = await axios.get(secureBaseUrl, {
        params: {
          q: city,
          appid: API_KEY,
          units: config.temperatureUnit === 'imperial' ? 'imperial' : 'metric'
        },
        timeout: 10000
      });

      const data = response.data;
      const weatherData: WeatherData = {
        location: data.name,
        country: data.sys.country,
        countryName: countryCodeToName[data.sys.country] || data.sys.country,
        temperature: Math.round(data.main.temp),
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        feelsLike: Math.round(data.main.feels_like),
        pressure: data.main.pressure
      };

      setWeather(weatherData);
      setLastUpdated(new Date());
    } catch (err: any) {
      console.error('Weather fetch error:', err);
      setError({ 
        message: 'Unable to fetch weather data. Please try again or check your internet connection.',
        code: 'API_ERROR'
      });
      // Do not show demo data, we want real weather only
    } finally {
      setLoading(false);
    }
  };

  const getUserLocation = () => {
    console.log('Requesting user location...');
    if (!navigator.geolocation) {
      console.error('Geolocation API not available');
      setError({ 
        message: 'Geolocation is not supported by this browser. Please enable location services.',
        code: 'NO_GEOLOCATION'
      });
      // Fall back to default city since geolocation is unavailable
      fetchWeatherByCity('New York');
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log(`Location obtained: ${latitude}, ${longitude}`);
        fetchWeatherByCoords(latitude, longitude);
      },
      (error) => {
        console.error('Geolocation error:', error);
        // More detailed error messages based on the error code
        if (error.code === 1) {
          console.error('Permission denied:', error);
          setError({ 
            message: 'Location permission denied. Showing weather for a default location.',
            code: 'PERMISSION_DENIED'
          });
          // Fall back to a default city if permission denied
          fetchWeatherByCity('New York');
        } else if (error.code === 2) {
          console.error('Position unavailable:', error);
          setError({ 
            message: 'Location unavailable. Showing weather for a default location.',
            code: 'POSITION_UNAVAILABLE'
          });
          fetchWeatherByCity('London');
        } else if (error.code === 3) {
          console.error('Timeout:', error);
          setError({ 
            message: 'Location request timed out. Showing weather for a default location.',
            code: 'TIMEOUT'
          });
          fetchWeatherByCity('Tokyo');
        } else {
          console.error('Unknown error:', error);
          setError({ 
            message: 'Unable to get your location. Showing weather for a default location.',
            code: 'LOCATION_ERROR'
          });
          fetchWeatherByCity('Sydney');
        }
      },
      { 
        timeout: 15000, 
        enableHighAccuracy: true,
        maximumAge: 0 // Force fresh position
      }
    );
  };

  const refreshWeather = () => {
    getUserLocation();
  };

  useEffect(() => {
    if (isActive) {
      // Always try to get user location when the weather component becomes active
      getUserLocation();
      
      // Set up periodic refresh when component is active
      const refreshInterval = setInterval(() => {
        if (isActive) {
          refreshWeather();
        }
      }, 300000); // Refresh every 5 minutes when active
      
      return () => clearInterval(refreshInterval);
    }
  }, [isActive]); // eslint-disable-line react-hooks/exhaustive-deps

  const getWeatherIcon = (iconCode: string) => {
    const iconMap: { [key: string]: string } = {
      '01d': '☀️', '01n': '🌙',
      '02d': '⛅', '02n': '☁️',
      '03d': '☁️', '03n': '☁️',
      '04d': '☁️', '04n': '☁️',
      '09d': '🌧️', '09n': '🌧️',
      '10d': '🌦️', '10n': '🌧️',
      '11d': '⛈️', '11n': '⛈️',
      '13d': '🌨️', '13n': '🌨️',
      '50d': '🌫️', '50n': '🌫️'
    };
    return iconMap[iconCode] || '🌤️';
  };

  const capitalize = (str: string) => {
    return str.replace(/\b\w/g, char => char.toUpperCase());
  };

  // Function to get country flag emoji from country code
  const getCountryFlag = (countryCode: string) => {
    // Comprehensive special flags mapping (all supported countries)
    const specialFlags: Record<string, string> = {
      'AF': '🇦🇫', 'AL': '🇦🇱', 'DZ': '🇩🇿', 'AS': '🇦🇸', 'AD': '🇦🇩', 'AO': '🇦🇴', 'AI': '🇦🇮', 'AQ': '🇦🇶',
      'AG': '🇦🇬', 'AR': '🇦🇷', 'AM': '🇦🇲', 'AW': '🇦🇼', 'AU': '🇦🇺', 'AT': '🇦🇹', 'AZ': '🇦🇿', 'BS': '🇧🇸',
      'BH': '🇧🇭', 'BD': '🇧🇩', 'BB': '🇧🇧', 'BY': '🇧🇾', 'BE': '🇧🇪', 'BZ': '🇧🇿', 'BJ': '��', 'BM': '🇧🇲',
      'BT': '��', 'BO': '🇧🇴', 'BA': '🇧🇦', 'BW': '🇧🇼', 'BR': '🇧🇷', 'IO': '��', 'VG': '🇻🇬', 'BN': '🇧🇳',
      'BG': '��🇬', 'BF': '🇧🇫', 'BI': '🇧🇮', 'KH': '🇰🇭', 'CM': '🇨🇲', 'CA': '🇨🇦', 'CV': '🇨🇻', 'KY': '🇰🇾',
      'CF': '🇨�', 'TD': '🇹🇩', 'CL': '🇨🇱', 'CN': '🇨🇳', 'CX': '🇨🇽', 'CC': '🇨🇨', 'CO': '🇨🇴', 'KM': '🇰🇲',
      'CG': '🇨🇬', 'CD': '🇨🇩', 'CK': '🇨🇰', 'CR': '🇨🇷', 'CI': '🇨🇮', 'HR': '🇭🇷', 'CU': '�🇺', 'CW': '🇨🇼',
      'CY': '��', 'CZ': '🇨🇿', 'DK': '🇩🇰', 'DJ': '🇩🇯', 'DM': '🇩🇲', 'DO': '🇩🇴', 'EC': '🇪🇨', 'EG': '🇪�',
      'SV': '🇸🇻', 'GQ': '🇬🇶', 'ER': '🇪🇷', 'EE': '🇪�', 'ET': '🇪🇹', 'FK': '🇫🇰', 'FO': '🇫🇴', 'FJ': '🇫🇯',
      'FI': '🇫🇮', 'FR': '🇫🇷', 'GF': '🇬🇫', 'PF': '🇵🇫', 'TF': '🇹🇫', 'GA': '🇬🇦', 'GM': '🇬🇲', 'GE': '🇬🇪',
      'DE': '🇩🇪', 'GH': '🇬🇭', 'GI': '🇬🇮', 'GR': '🇬🇷', 'GL': '🇬🇱', 'GD': '🇬🇩', 'GP': '🇬🇵', 'GU': '🇬🇺',
      'GT': '🇬🇹', 'GG': '🇬🇬', 'GN': '🇬🇳', 'GW': '🇬🇼', 'GY': '🇬🇾', 'HT': '🇭🇹', 'HM': '🇭🇲', 'VA': '🇻🇦',
      'HN': '🇭🇳', 'HK': '🇭🇰', 'HU': '🇭🇺', 'IS': '🇮🇸', 'IN': '🇮🇳', 'ID': '🇮�', 'IR': '🇮🇷', 'IQ': '🇮🇶',
      'IE': '🇮🇪', 'IM': '🇮🇲', 'IL': '🇮🇱', 'IT': '🇮🇹', 'JM': '🇯🇲', 'JP': '🇯🇵', 'JE': '🇯�', 'JO': '🇯🇴',
      'KZ': '🇰🇿', 'KE': '🇰🇪', 'KI': '🇰🇮', 'KP': '🇰🇵', 'KR': '🇰🇷', 'KW': '🇰🇼', 'KG': '🇰�', 'LA': '🇱🇦',
      'LV': '🇱🇻', 'LB': '🇱🇧', 'LS': '🇱🇸', 'LR': '�🇷', 'LY': '🇱🇾', 'LI': '🇱🇮', 'LT': '🇱🇹', 'LU': '🇱🇺',
      'MO': '🇲🇴', 'MK': '🇲🇰', 'MG': '🇲🇬', 'MW': '🇲🇼', 'MY': '🇲🇾', 'MV': '🇲🇻', 'ML': '🇲🇱', 'MT': '🇲🇹',
      'MH': '🇲🇭', 'MQ': '🇲🇶', 'MR': '🇲🇷', 'MU': '🇲🇺', 'YT': '🇾🇹', 'MX': '🇲🇽', 'FM': '🇫🇲', 'MD': '🇲🇩',
      'MC': '🇲🇨', 'MN': '🇲🇳', 'ME': '🇲🇪', 'MS': '��🇸', 'MA': '��🇦', 'MZ': '🇲🇿', 'MM': '🇲🇲', 'NA': '🇳🇦',
      'NR': '🇳🇷', 'NP': '🇳🇵', 'NL': '🇳🇱', 'NC': '🇳🇨', 'NZ': '🇳🇿', 'NI': '🇳🇮', 'NE': '🇳🇪', 'NG': '🇳🇬',
      'NU': '🇳🇺', 'NF': '🇳🇫', 'MP': '🇲🇵', 'NO': '🇳🇴', 'OM': '🇴🇲', 'PK': '🇵🇰', 'PW': '🇵🇼', 'PS': '🇵🇸',
      'PA': '🇵🇦', 'PG': '🇵🇬', 'PY': '🇵🇾', 'PE': '�🇪', 'PH': '🇵🇭', 'PN': '🇵🇳', 'PL': '🇵🇱', 'PT': '🇵🇹',
      'PR': '🇵🇷', 'QA': '🇶�🇦', 'RE': '��🇪', 'RO': '🇷🇴', 'RU': '🇷🇺', 'RW': '🇷🇼', 'BL': '🇧🇱', 'SH': '🇸🇭',
      'KN': '🇰🇳', 'LC': '🇱🇨', 'MF': '🇲🇫', 'PM': '🇵🇲', 'VC': '🇻🇨', 'WS': '🇼🇸', 'SM': '🇸🇲', 'ST': '🇸🇹',
      'SA': '🇸🇦', 'SN': '🇸🇳', 'RS': '🇷🇸', 'SC': '🇸🇨', 'SL': '🇸🇱', 'SG': '🇸🇬', 'SX': '🇸🇽', 'SK': '🇸🇰',
      'SI': '🇸🇮', 'SB': '🇸🇧', 'SO': '🇸🇴', 'ZA': '🇿🇦', 'GS': '🇬🇸', 'SS': '🇸🇸', 'ES': '🇪🇸', 'LK': '🇱🇰',
      'SD': '🇸🇩', 'SR': '🇸🇷', 'SJ': '🇸🇯', 'SZ': '🇸🇿', 'SE': '🇸🇪', 'CH': '🇨🇭', 'SY': '🇸🇾', 'TW': '🇹🇼',
      'TJ': '🇹🇯', 'TZ': '🇹🇿', 'TH': '🇹🇭', 'TL': '🇹🇱', 'TG': '🇹🇬', 'TK': '🇹🇰', 'TO': '🇹🇴', 'TT': '🇹🇹',
      'TN': '🇹🇳', 'TR': '🇹🇷', 'TM': '🇹🇲', 'TC': '🇹🇨', 'TV': '🇹🇻', 'UG': '🇺🇬', 'UA': '🇺🇦', 'AE': '🇦🇪',
      'GB': '🇬🇧', 'US': '🇺🇸', 'UM': '🇺🇲', 'UY': '🇺🇾', 'UZ': '🇺🇿', 'VU': '🇻🇺', 'VE': '🇻🇪', 'VN': '🇻🇳',
      'VI': '🇻🇮', 'WF': '🇼🇫', 'EH': '🇪🇭', 'YE': '🇾🇪', 'ZM': '🇿🇲', 'ZW': '🇿🇼'
    };

    // Return special flag if it exists
    if (countryCode in specialFlags) {
      return specialFlags[countryCode];
    }

    // Fallback to algorithmic generation for any missing codes
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map(char => 127397 + char.charCodeAt(0));
    
    return String.fromCodePoint(...codePoints);
  };

  if (!isActive) return null;

  return (
    <div className="weather" role="main" aria-label="Weather Information">
      <div className="weather-container">
        <div className="weather-header">
          <h1>{t('weather_today')}</h1>
          <button 
            className="refresh-btn"
            onClick={refreshWeather}
            disabled={loading}
            aria-label={t('refresh')}
          >
            {loading ? '⏳' : '🔄'}
          </button>
        </div>

        {loading && (
          <div className="weather-loading" aria-live="polite">
            <div className="loading-spinner"></div>
            <p>{t('loading_weather')}</p>
          </div>
        )}

        {error && !weather && (
          <div className="weather-error" role="alert">
            <div className="error-content">
              <h3>⚠️ {t('weather_unavailable')}</h3>
              <p>{error.message}</p>
              {(error.code === 'PERMISSION_DENIED' || error.code === 'LOCATION_ERROR' || error.code === 'NO_GEOLOCATION') && (
                <div className="error-help">
                  <p>💡 To see real-time weather for your location:</p>
                  <ol>
                    <li>Ensure location services are enabled in your device settings</li>
                    <li>Allow location access when prompted by your browser</li>
                    <li>For iOS: Settings → Privacy → Location Services → Safari → Allow</li>
                    <li>For Android: Settings → Location → App Permissions → Browser → Allow</li>
                  </ol>
                </div>
              )}
              {error.code === 'API_KEY_ERROR' && (
                <div className="error-help">
                  <p>💡 Weather API connection error. Please try again later.</p>
                </div>
              )}
            </div>
            <button 
              className="retry-btn"
              onClick={refreshWeather}
              aria-label={t('try_again')}
            >
              {t('try_again')}
            </button>
          </div>
        )}

        {weather && (
          <div className="weather-content">
            
            <div className="weather-main">
              <div className="weather-icon" aria-hidden="true">
                {getWeatherIcon(weather.icon)}
              </div>
              <div className="weather-temp">
                <span className="temperature" aria-label={`Temperature ${formatTemperature(weather.temperature)}`}>
                  {formatTemperature(weather.temperature)}
                </span>
                <span className="feels-like">
                  {t('feels_like')} {formatTemperature(weather.feelsLike)}
                </span>
              </div>
            </div>

            <div className="weather-info">
              <h2 className="location" aria-label={`Location: ${weather.location}, ${weather.countryName}`}>
                <span className="country-flag" aria-hidden="true">
                  {getCountryFlag(weather.country)}
                </span> {weather.location}, {weather.countryName}
              </h2>
              <p className="description" aria-label={`Weather condition: ${weather.description}`}>
                {capitalize(weather.description)}
              </p>
            </div>

            <div className="weather-details">
              <div className="detail-item">
                <span className="detail-label">{t('humidity')}</span>
                <span className="detail-value" aria-label={`${t('humidity')} ${weather.humidity} percent`}>
                  💧 {weather.humidity}%
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">{t('wind')}</span>
                <span className="detail-value" aria-label={`${t('wind')} speed ${formatWindSpeed(weather.windSpeed)}`}>
                  💨 {formatWindSpeed(weather.windSpeed)}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">{t('pressure')}</span>
                <span className="detail-value" aria-label={`${t('pressure')} ${weather.pressure} hectopascals`}>
                  📊 {weather.pressure} hPa
                </span>
              </div>
            </div>

            {lastUpdated && (
              <div className="last-updated" aria-live="polite">
                <p>{t('last_updated')}: {formatTimeI18n(lastUpdated)}</p>
              </div>
            )}
          </div>
        )}

        {error && error.code !== 'DEMO_MODE' && weather && (
          <div className="weather-warning">
            <p>⚠️ {error.message}</p>
          </div>
        )}
      </div>
    </div>
  );
};
