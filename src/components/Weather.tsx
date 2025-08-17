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

  // Using a demo API key - in production, this should be in environment variables
  const API_KEY = process.env.REACT_APP_WEATHER_API_KEY || 'demo_key';
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
        message: 'Unable to fetch weather data. Showing demo data.',
        code: 'DEMO_MODE'
      });
      
      // Show demo data when API fails
      setWeather({
        location: 'Demo City, XX',
        temperature: 22,
        description: 'partly cloudy',
        icon: '02d',
        humidity: 65,
        windSpeed: 3.5,
        feelsLike: 24,
        pressure: 1013
      });
      setLastUpdated(new Date());
    } finally {
      setLoading(false);
    }
  };

  const getUserLocation = () => {
    if (!navigator.geolocation) {
      setError({ 
        message: 'Geolocation is not supported by this browser.',
        code: 'NO_GEOLOCATION'
      });
      fetchWeatherByCity();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeatherByCoords(latitude, longitude);
      },
      (error) => {
        console.error('Geolocation error:', error);
        setError({ 
          message: 'Unable to get your location. Showing weather for London.',
          code: 'LOCATION_ERROR'
        });
        fetchWeatherByCity();
      },
      { timeout: 10000, enableHighAccuracy: false }
    );
  };

  const refreshWeather = () => {
    getUserLocation();
  };

  useEffect(() => {
    if (isActive && !weather && !loading) {
      getUserLocation();
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
              {error.code === 'API_KEY_ERROR' && (
                <div className="error-help">
                  <p>💡 To use real weather data:</p>
                  <ol>
                    <li>Get a free API key from <a href="https://openweathermap.org/api" target="_blank" rel="noopener noreferrer">OpenWeatherMap</a></li>
                    <li>Add it to your .env file as REACT_APP_WEATHER_API_KEY</li>
                    <li>Restart the development server</li>
                  </ol>
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
            {error && error.code === 'DEMO_MODE' && (
              <div className="demo-notice">
                <p>📍 {t('demo_data')}</p>
              </div>
            )}
            
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
