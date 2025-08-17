import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useI18nContext } from '../hooks/useI18n';
import './Weather.css';

interface WeatherProps {
  isActive: boolean;
}

interface WeatherData {
  location: string;
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

  // Real API key for OpenWeatherMap
  const API_KEY = '27b5e7bcaaea4262d9f45296b32ba71c';
  const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

  const fetchWeatherByCoords = async (lat: number, lon: number) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(BASE_URL, {
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
        location: `${data.name}, ${data.sys.country}`,
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

      const response = await axios.get(BASE_URL, {
        params: {
          q: city,
          appid: API_KEY,
          units: config.temperatureUnit === 'imperial' ? 'imperial' : 'metric'
        },
        timeout: 10000
      });

      const data = response.data;
      const weatherData: WeatherData = {
        location: `${data.name}, ${data.sys.country}`,
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
    if (!navigator.geolocation) {
      setError({ 
        message: 'Geolocation is not supported by this browser. Please enable location services.',
        code: 'NO_GEOLOCATION'
      });
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
          setError({ 
            message: 'Location permission denied. Please enable location services for real-time weather.',
            code: 'PERMISSION_DENIED'
          });
        } else if (error.code === 2) {
          setError({ 
            message: 'Location unavailable. Please try again or check device settings.',
            code: 'POSITION_UNAVAILABLE'
          });
        } else if (error.code === 3) {
          setError({ 
            message: 'Location request timed out. Please try again.',
            code: 'TIMEOUT'
          });
        } else {
          setError({ 
            message: 'Unable to get your location. Please enable location services.',
            code: 'LOCATION_ERROR'
          });
        }
        setLoading(false);
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
              <h2 className="location" aria-label={`Location: ${weather.location}`}>
                📍 {weather.location}
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
