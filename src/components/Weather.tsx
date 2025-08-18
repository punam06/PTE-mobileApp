import React, { useState } from 'react';
import axios from 'axios';
import { useI18nContext } from '../hooks/useI18n';
import { countryCodeToName } from '../utils/countryList';
import './Weather.css';

interface WeatherProps {
  isActive: boolean;
}

interface WeatherData {
  location: string;
  country: string;
  countryName: string;
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
  const { t, config, formatTemperature, formatWindSpeed } = useI18nContext();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<WeatherError | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [locationInput, setLocationInput] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  const API_KEY = '1bb77cb7d7934e15a4a175853251808';
  const BASE_URL = 'https://api.weatherapi.com/v1/current.json';

  const fetchWeatherByLocation = async (location: string) => {
    if (!location.trim()) {
      setError({ message: t('enter_location') });
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(BASE_URL, {
        params: {
          key: API_KEY,
          q: location,
          aqi: 'yes'
        },
        timeout: 10000
      });

      if (response.data) {
        const data = response.data;
        const countryName = countryCodeToName[data.location.country as keyof typeof countryCodeToName] || data.location.country;
        
        const weatherData: WeatherData = {
          location: data.location.name,
          country: data.location.country,
          countryName: countryName,
          temperature: Math.round(config.temperatureUnit === 'imperial' ? data.current.temp_f : data.current.temp_c),
          description: data.current.condition.text,
          icon: data.current.condition.icon,
          humidity: data.current.humidity,
          windSpeed: config.temperatureUnit === 'imperial' ? data.current.wind_mph : data.current.wind_kph,
          feelsLike: Math.round(config.temperatureUnit === 'imperial' ? data.current.feelslike_f : data.current.feelslike_c),
          pressure: data.current.pressure_mb
        };

        setWeather(weatherData);
        setLastUpdated(new Date());
        
        if (!searchHistory.includes(location)) {
          setSearchHistory(prev => [location, ...prev.slice(0, 4)]);
        }
      }
    } catch (err: any) {
      console.error('Weather API Error:', err);
      
      if (err.response?.status === 400) {
        setError({ 
          message: t('location_not_found'),
          code: 'NOT_FOUND'
        });
      } else if (err.response?.status === 401 || err.response?.status === 403) {
        setError({ 
          message: t('api_key_error'),
          code: 'API_KEY_ERROR'
        });
      } else if (err.response?.status === 429) {
        setError({ 
          message: t('api_limit_reached'),
          code: 'RATE_LIMITED'
        });
      } else {
        setError({ 
          message: t('weather_connection_error'),
          code: 'CONNECTION_ERROR'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (locationInput.trim()) {
      fetchWeatherByLocation(locationInput.trim());
    }
  };

  const handleHistoryClick = (location: string) => {
    setLocationInput(location);
    fetchWeatherByLocation(location);
  };

  const clearHistory = () => {
    setSearchHistory([]);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: config.timeFormat === '12h'
    });
  };

  if (!isActive) return null;

  return (
    <div className="weather-container">
      <div className="weather-content">
        <div className="weather-header">
          <h2 className="weather-title">
            Weather Today
          </h2>
        </div>

        <div className="weather-search-section">
          <form onSubmit={handleSearch} className="weather-search-form">
            <div className="search-input-container">
              <input
                type="text"
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                placeholder="Enter city or location..."
                className="location-input"
                disabled={loading}
              />
              <button 
                type="submit" 
                className="search-button"
                disabled={loading || !locationInput.trim()}
              >
                {loading ? '⏳' : '🔍'}
              </button>
            </div>
          </form>

          {searchHistory.length > 0 && (
            <div className="search-history">
              <div className="history-header">
                <span className="history-title">Recent Searches</span>
                <button onClick={clearHistory} className="clear-history">
                  Clear
                </button>
              </div>
              <div className="history-items">
                {searchHistory.map((location, index) => (
                  <button
                    key={index}
                    onClick={() => handleHistoryClick(location)}
                    className="history-item"
                  >
                    📍 {location}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {loading && (
          <div className="weather-loading">
            <div className="loading-spinner"></div>
            <p>Loading weather...</p>
          </div>
        )}

        {error && !loading && (
          <div className="weather-error">
            <div className="error-icon">❌</div>
            <h3>Weather Unavailable</h3>
            <p>{error.message}</p>
            {error.code === 'NOT_FOUND' && (
              <div className="error-suggestions">
                <p>Try a different location:</p>
                <ul>
                  <li>London, UK</li>
                  <li>New York, US</li>
                  <li>Tokyo, Japan</li>
                  <li>Sydney, Australia</li>
                </ul>
              </div>
            )}
            <button 
              onClick={() => setError(null)} 
              className="retry-button"
            >
              Try Again
            </button>
          </div>
        )}

        {weather && !loading && (
          <div className="weather-display">
            <div className="weather-main">
              <div className="weather-location">
                <h3>{weather.location}</h3>
                <p>{weather.countryName}</p>
              </div>
              
              <div className="weather-temperature">
                <div className="temperature-main">
                  {formatTemperature(weather.temperature)}
                </div>
                <div className="weather-icon">
                  <img 
                    src={`https:${weather.icon}`}
                    alt={weather.description}
                  />
                </div>
              </div>
              
              <div className="weather-description">
                {weather.description}
              </div>
              
              <div className="feels-like">
                Feels like {formatTemperature(weather.feelsLike)}
              </div>
            </div>

            <div className="weather-details">
              <div className="detail-item">
                <span className="detail-icon">💧</span>
                <span className="detail-label">Humidity</span>
                <span className="detail-value">{weather.humidity}%</span>
              </div>
              
              <div className="detail-item">
                <span className="detail-icon">💨</span>
                <span className="detail-label">Wind</span>
                <span className="detail-value">{formatWindSpeed(weather.windSpeed)}</span>
              </div>
              
              <div className="detail-item">
                <span className="detail-icon">🌡️</span>
                <span className="detail-label">Pressure</span>
                <span className="detail-value">{weather.pressure} hPa</span>
              </div>
            </div>

            {lastUpdated && (
              <div className="weather-footer">
                <p>Last updated: {formatTime(lastUpdated)}</p>
              </div>
            )}
          </div>
        )}

        {!weather && !loading && !error && (
          <div className="weather-welcome">
            <div className="welcome-icon">🌍</div>
            <h3>Welcome to Weather</h3>
            <p>Search for any city or location to get current weather information.</p>
            <div className="popular-locations">
              <p>Popular locations:</p>
              <div className="location-suggestions">
                {['London', 'New York', 'Tokyo', 'Paris', 'Sydney'].map((city) => (
                  <button
                    key={city}
                    onClick={() => {
                      setLocationInput(city);
                      fetchWeatherByLocation(city);
                    }}
                    className="suggestion-button"
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
