import React, { useState } from 'react';
import { useOrientation, getFeatureFromOrientation } from './hooks/useOrientation';
import { I18nProvider } from './hooks/useI18n';
import { AlarmClock } from './components/AlarmClock';
import { Stopwatch } from './components/Stopwatch';
import { Timer } from './components/Timer';
import { Weather } from './components/Weather';
import { LanguageSelector } from './components/LanguageSelector';
import { Instructions } from './components/Instructions';
import './App.css';

function App() {
  const orientation = useOrientation();
  const currentFeature = getFeatureFromOrientation(orientation);
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  return (
    <I18nProvider>
      <div className="App" data-orientation={orientation} data-feature={currentFeature}>
        {/* Language Selector */}
        <div className="language-selector-container">
          <LanguageSelector 
            isVisible={showLanguageSelector}
            onToggle={() => setShowLanguageSelector(!showLanguageSelector)}
          />
        </div>

        {/* Instructions */}
        <Instructions 
          isVisible={showInstructions}
          onToggle={() => setShowInstructions(!showInstructions)}
        />

        {/* Orientation indicator for debugging/development */}
        <div className="orientation-debug" aria-live="polite">
          <span>🧭 {orientation} → {currentFeature}</span>
        </div>

        {/* Feature Components */}
        <AlarmClock isActive={currentFeature === 'alarm'} />
        <Stopwatch isActive={currentFeature === 'stopwatch'} />
        <Timer isActive={currentFeature === 'timer'} />
        <Weather isActive={currentFeature === 'weather'} />
      </div>
    </I18nProvider>
  );
}

export default App;
