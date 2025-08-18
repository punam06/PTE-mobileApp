import React, { useState } from 'react';
import { useI18nContext } from '../hooks/useI18n';
import './Instructions.css';

interface InstructionsProps {
  isVisible: boolean;
  onToggle: () => void;
}

export const Instructions: React.FC<InstructionsProps> = ({ isVisible, onToggle }) => {
  const { t, config } = useI18nContext();
  const [showDetails, setShowDetails] = useState(false);

  return (
    <>
      {/* Instructions Toggle Button */}
      <button 
        className="instructions-toggle"
        onClick={onToggle}
        aria-label={t('show_instructions')}
        title={t('show_instructions')}
      >
        <span className="icon">❓</span>
        <span className="text">{t('help')}</span>
      </button>

      {/* Instructions Modal */}
      {isVisible && (
        <div className="instructions-modal" role="dialog" aria-modal="true">
          <div className="instructions-content">
            <div className="instructions-header">
              <h2>{t('user_instructions')}</h2>
              <button 
                className="close-button"
                onClick={onToggle}
                aria-label={t('close')}
              >
                ✕
              </button>
            </div>

            <div className="instructions-body">
              {/* Basic Usage */}
              <section className="instruction-section">
                <h3>{t('basic_usage')}</h3>
                <p>{t('rotation_instruction')}</p>
                
                <div className="feature-grid">
                  <div className="feature-card">
                    <div className="feature-icon">📱↑</div>
                    <div className="feature-info">
                      <h4>{t('alarm_clock')}</h4>
                      <p>{t('portrait_up_desc')}</p>
                    </div>
                  </div>
                  
                  <div className="feature-card">
                    <div className="feature-icon">📱→</div>
                    <div className="feature-info">
                      <h4>{t('stopwatch')}</h4>
                      <p>{t('landscape_right_desc')}</p>
                    </div>
                  </div>
                  
                  <div className="feature-card">
                    <div className="feature-icon">📱↓</div>
                    <div className="feature-info">
                      <h4>{t('timer')}</h4>
                      <p>{t('portrait_down_desc')}</p>
                    </div>
                  </div>
                  
                  <div className="feature-card">
                    <div className="feature-icon">📱←</div>
                    <div className="feature-info">
                      <h4>{t('weather')}</h4>
                      <p>{t('landscape_left_desc')}</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Detailed Instructions */}
              <section className="instruction-section">
                <button 
                  className="details-toggle"
                  onClick={() => setShowDetails(!showDetails)}
                  aria-expanded={showDetails}
                >
                  <span>{t('detailed_instructions')}</span>
                  <span className={`arrow ${showDetails ? 'expanded' : ''}`}>▼</span>
                </button>
                
                {showDetails && (
                  <div className="details-content">
                    <div className="instruction-subsection">
                      <h4>⏰ {t('alarm_clock_usage')}</h4>
                      <ul>
                        <li>{t('alarm_instruction_1')}</li>
                        <li>{t('alarm_instruction_2')}</li>
                        <li>{t('alarm_instruction_3')}</li>
                        <li>{t('alarm_instruction_4')}</li>
                      </ul>
                    </div>

                    <div className="instruction-subsection">
                      <h4>⏱️ {t('stopwatch_usage')}</h4>
                      <ul>
                        <li>{t('stopwatch_instruction_1')}</li>
                        <li>{t('stopwatch_instruction_2')}</li>
                        <li>{t('stopwatch_instruction_3')}</li>
                      </ul>
                    </div>

                    <div className="instruction-subsection">
                      <h4>⏲️ {t('timer_usage')}</h4>
                      <ul>
                        <li>{t('timer_instruction_1')}</li>
                        <li>{t('timer_instruction_2')}</li>
                      </ul>
                    </div>

                    <div className="instruction-subsection">
                      <h4>🌤️ {t('weather_usage')}</h4>
                      <ul>
                        <li>{t('weather_instruction_1')}</li>
                        <li>{t('weather_instruction_2')}</li>
                      </ul>
                    </div>

                    <div className="instruction-subsection">
                      <h4>🌐 {t('language_support')}</h4>
                      <p>{t('language_instruction')}</p>
                    </div>
                  </div>
                )}
              </section>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
