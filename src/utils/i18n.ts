// Internationalization utilities for the orientation-aware mobile app
export type Locale = 'en-US' | 'en-GB' | 'es-ES' | 'fr-FR' | 'de-DE' | 'ja-JP' | 'zh-CN';

export interface I18nConfig {
  locale: Locale;
  timeFormat: '12h' | '24h';
  temperatureUnit: 'metric' | 'imperial';
  dateFormat: 'short' | 'long';
}

// Default configuration
export const defaultI18nConfig: I18nConfig = {
  locale: 'en-US',
  timeFormat: '12h',
  temperatureUnit: 'metric',
  dateFormat: 'long'
};

// Locale-specific configurations
export const localeConfigs: Record<Locale, Partial<I18nConfig>> = {
  'en-US': { timeFormat: '12h', temperatureUnit: 'imperial' },
  'en-GB': { timeFormat: '24h', temperatureUnit: 'metric' },
  'es-ES': { timeFormat: '24h', temperatureUnit: 'metric' },
  'fr-FR': { timeFormat: '24h', temperatureUnit: 'metric' },
  'de-DE': { timeFormat: '24h', temperatureUnit: 'metric' },
  'ja-JP': { timeFormat: '24h', temperatureUnit: 'metric' },
  'zh-CN': { timeFormat: '24h', temperatureUnit: 'metric' }
};

// Translations for common terms
export const translations: Record<Locale, Record<string, string>> = {
  'en-US': {
    'weather_today': 'Weather Today',
    'loading_weather': 'Loading weather data...',
    'weather_unavailable': 'Weather Unavailable',
    'try_again': 'Try Again',
    'refresh': 'Refresh',
    'last_updated': 'Last updated',
    'feels_like': 'Feels like',
    'humidity': 'Humidity',
    'wind': 'Wind',
    'pressure': 'Pressure',
    'demo_data': 'Showing demo weather data',
    'set_alarm': 'Set Alarm',
    'alarm_time': 'Alarm Time',
    'cancel_alarm': 'Cancel Alarm',
    'stop_alarm': 'Stop Alarm',
    'alarm_set_for': 'Alarm set for',
    'times_up': "Time's Up!",
    'timer_finished': 'Your timer has finished',
    'dismiss': 'Dismiss',
    'start': 'Start',
    'stop': 'Stop',
    'reset': 'Reset',
    'resume': 'Resume',
    'lap': 'Lap',
    'best': 'Best',
    'worst': 'Worst'
  },
  'en-GB': {
    'weather_today': 'Weather Today',
    'loading_weather': 'Loading weather data...',
    'weather_unavailable': 'Weather Unavailable',
    'try_again': 'Try Again',
    'refresh': 'Refresh',
    'last_updated': 'Last updated',
    'feels_like': 'Feels like',
    'humidity': 'Humidity',
    'wind': 'Wind',
    'pressure': 'Pressure',
    'demo_data': 'Showing demo weather data',
    'set_alarm': 'Set Alarm',
    'alarm_time': 'Alarm Time',
    'cancel_alarm': 'Cancel Alarm',
    'stop_alarm': 'Stop Alarm',
    'alarm_set_for': 'Alarm set for',
    'times_up': "Time's Up!",
    'timer_finished': 'Your timer has finished',
    'dismiss': 'Dismiss',
    'start': 'Start',
    'stop': 'Stop',
    'reset': 'Reset',
    'resume': 'Resume',
    'lap': 'Lap',
    'best': 'Best',
    'worst': 'Worst'
  },
  'es-ES': {
    'weather_today': 'Tiempo Hoy',
    'loading_weather': 'Cargando datos del tiempo...',
    'weather_unavailable': 'Tiempo No Disponible',
    'try_again': 'Intentar de Nuevo',
    'refresh': 'Actualizar',
    'last_updated': 'Última actualización',
    'feels_like': 'Sensación térmica',
    'humidity': 'Humedad',
    'wind': 'Viento',
    'pressure': 'Presión',
    'demo_data': 'Mostrando datos de demostración',
    'set_alarm': 'Configurar Alarma',
    'alarm_time': 'Hora de Alarma',
    'cancel_alarm': 'Cancelar Alarma',
    'stop_alarm': 'Detener Alarma',
    'alarm_set_for': 'Alarma configurada para',
    'times_up': '¡Se Acabó el Tiempo!',
    'timer_finished': 'Tu temporizador ha terminado',
    'dismiss': 'Descartar',
    'start': 'Iniciar',
    'stop': 'Detener',
    'reset': 'Reiniciar',
    'resume': 'Reanudar',
    'lap': 'Vuelta',
    'best': 'Mejor',
    'worst': 'Peor'
  },
  'fr-FR': {
    'weather_today': "Météo Aujourd'hui",
    'loading_weather': 'Chargement des données météo...',
    'weather_unavailable': 'Météo Indisponible',
    'try_again': 'Réessayer',
    'refresh': 'Actualiser',
    'last_updated': 'Dernière mise à jour',
    'feels_like': 'Ressenti',
    'humidity': 'Humidité',
    'wind': 'Vent',
    'pressure': 'Pression',
    'demo_data': 'Affichage des données de démonstration',
    'set_alarm': 'Régler Alarme',
    'alarm_time': 'Heure Alarme',
    'cancel_alarm': 'Annuler Alarme',
    'stop_alarm': 'Arrêter Alarme',
    'alarm_set_for': 'Alarme réglée pour',
    'times_up': 'Temps Écoulé!',
    'timer_finished': 'Votre minuteur est terminé',
    'dismiss': 'Rejeter',
    'start': 'Démarrer',
    'stop': 'Arrêter',
    'reset': 'Remettre à zéro',
    'resume': 'Reprendre',
    'lap': 'Tour',
    'best': 'Meilleur',
    'worst': 'Pire'
  },
  'de-DE': {
    'weather_today': 'Wetter Heute',
    'loading_weather': 'Wetterdaten werden geladen...',
    'weather_unavailable': 'Wetter Nicht Verfügbar',
    'try_again': 'Erneut Versuchen',
    'refresh': 'Aktualisieren',
    'last_updated': 'Zuletzt aktualisiert',
    'feels_like': 'Gefühlt',
    'humidity': 'Feuchtigkeit',
    'wind': 'Wind',
    'pressure': 'Druck',
    'demo_data': 'Demo-Wetterdaten anzeigen',
    'set_alarm': 'Wecker Stellen',
    'alarm_time': 'Weckzeit',
    'cancel_alarm': 'Wecker Abbrechen',
    'stop_alarm': 'Wecker Stoppen',
    'alarm_set_for': 'Wecker gestellt für',
    'times_up': 'Zeit Ist Um!',
    'timer_finished': 'Ihr Timer ist beendet',
    'dismiss': 'Verwerfen',
    'start': 'Start',
    'stop': 'Stopp',
    'reset': 'Zurücksetzen',
    'resume': 'Fortsetzen',
    'lap': 'Runde',
    'best': 'Beste',
    'worst': 'Schlechteste'
  },
  'ja-JP': {
    'weather_today': '今日の天気',
    'loading_weather': '天気データを読み込んでいます...',
    'weather_unavailable': '天気データが利用できません',
    'try_again': '再試行',
    'refresh': '更新',
    'last_updated': '最終更新',
    'feels_like': '体感',
    'humidity': '湿度',
    'wind': '風',
    'pressure': '気圧',
    'demo_data': 'デモ天気データを表示',
    'set_alarm': 'アラーム設定',
    'alarm_time': 'アラーム時刻',
    'cancel_alarm': 'アラームキャンセル',
    'stop_alarm': 'アラーム停止',
    'alarm_set_for': 'アラーム設定時刻',
    'times_up': '時間終了！',
    'timer_finished': 'タイマーが終了しました',
    'dismiss': '閉じる',
    'start': '開始',
    'stop': '停止',
    'reset': 'リセット',
    'resume': '再開',
    'lap': 'ラップ',
    'best': '最高',
    'worst': '最低'
  },
  'zh-CN': {
    'weather_today': '今日天气',
    'loading_weather': '正在加载天气数据...',
    'weather_unavailable': '天气数据不可用',
    'try_again': '重试',
    'refresh': '刷新',
    'last_updated': '最后更新',
    'feels_like': '体感',
    'humidity': '湿度',
    'wind': '风',
    'pressure': '气压',
    'demo_data': '显示演示天气数据',
    'set_alarm': '设置闹钟',
    'alarm_time': '闹钟时间',
    'cancel_alarm': '取消闹钟',
    'stop_alarm': '停止闹钟',
    'alarm_set_for': '闹钟设置时间',
    'times_up': '时间到！',
    'timer_finished': '您的计时器已完成',
    'dismiss': '关闭',
    'start': '开始',
    'stop': '停止',
    'reset': '重置',
    'resume': '继续',
    'lap': '圈',
    'best': '最佳',
    'worst': '最差'
  }
};

// Formatting utilities
export const formatTime = (date: Date, config: I18nConfig): string => {
  const options: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: config.timeFormat === '12h'
  };
  
  return date.toLocaleTimeString(config.locale, options);
};

export const formatDate = (date: Date, config: I18nConfig): string => {
  const options: Intl.DateTimeFormatOptions = config.dateFormat === 'long' 
    ? {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }
    : {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      };
  
  return date.toLocaleDateString(config.locale, options);
};

export const formatTemperature = (temp: number, config: I18nConfig): string => {
  if (config.temperatureUnit === 'imperial') {
    const fahrenheit = Math.round((temp * 9/5) + 32);
    return `${fahrenheit}°F`;
  }
  return `${Math.round(temp)}°C`;
};

export const formatWindSpeed = (speed: number, config: I18nConfig): string => {
  if (config.temperatureUnit === 'imperial') {
    const mph = Math.round(speed * 2.237);
    return `${mph} mph`;
  }
  return `${speed} m/s`;
};

// Translation helper
export const t = (key: string, locale: Locale): string => {
  return translations[locale]?.[key] || translations['en-US'][key] || key;
};

// Detect user's preferred locale
export const detectLocale = (): Locale => {
  const browserLang = navigator.language as Locale;
  return Object.keys(localeConfigs).includes(browserLang) 
    ? browserLang 
    : 'en-US';
};

// Get complete i18n configuration
export const getI18nConfig = (locale?: Locale): I18nConfig => {
  const detectedLocale = locale || detectLocale();
  return {
    ...defaultI18nConfig,
    ...localeConfigs[detectedLocale],
    locale: detectedLocale
  };
};
