import React, { useState } from 'react';
import IntroScreen from './IntroScreen';
import StackVisualizer from './StackVisualizer';
import PlayerSelect from './PlayerSelect';
import RulesPage from './RulesPage';

function App() {
  const [currentScreen, setCurrentScreen] = useState('intro');
  const [selectedSprite, setSelectedSprite] = useState(null);
  const [isFading, setIsFading] = useState(false);

  // nav funcs
  const fadeToScreen = (screenName) => {
    setIsFading(true);
    setTimeout(() => {
      setCurrentScreen(screenName);
      setIsFading(false);
    }, 500); // fade for half a second
  };

  const handleStart = () => {
    fadeToScreen('pdaSimulator');
  };

  const handlePlayerSelect = () => {
    fadeToScreen('playerSelect');
  };

  const handleRulesDisplay = () => {
    fadeToScreen('displayRules');
  };

  const handleSpriteSelect = (sprite) => {
    setSelectedSprite(sprite);
    fadeToScreen('pdaSimulator');
  };

  return (
    <div className={`app-container ${isFading ? 'fade-out' : ''}`}>
      {currentScreen === 'intro' && (
        <IntroScreen onStart={handleStart} onChoosePlayer={handlePlayerSelect} onShowRules={handleRulesDisplay} />
      )}
      {currentScreen === 'playerSelect' && (
        <PlayerSelect onSelect={handleSpriteSelect} />
      )}
      {currentScreen === 'pdaSimulator' && (
        <StackVisualizer selectedSprite={selectedSprite} />
      )}
      {currentScreen === 'displayRules' && (
        <RulesPage onShowRules={handleRulesDisplay} />
      )}
    </div>

  );
}

export default App;