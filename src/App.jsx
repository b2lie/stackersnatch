import { useState } from 'react';
import IntroScreen from './IntroScreen';
import StackVisualizer from './StackVisualizer';
import PlayerSelect from './PlayerSelect';
import RulesPage from './RulesPage';
import Leaderboard from './Leaderboard';
import WinPage from './WinPage';

function App() {
  const [currentScreen, setCurrentScreen] = useState('intro');
  const [selectedSprite, setSelectedSprite] = useState(null);
  const [isFading, setIsFading] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showPlayerSelect, setShowPlayerSelect] = useState(false);

  const fadeToScreen = (screenName) => {
    setIsFading(true);
    setTimeout(() => {
      setCurrentScreen(screenName);
      setIsFading(false);
    }, 500);
  };

  const handleStart = () => {
    setShowPlayerSelect(true);
    fadeToScreen('playerSelect')
  };

  const handleSpriteSelect = (sprite) => {
    setSelectedSprite(sprite);
    setShowPlayerSelect(false);
    fadeToScreen('pdaSimulator');
  };

  return (
    <div className={`app-container ${isFading ? 'fade-out' : ''}`}>
      {showLeaderboard ? (
        <Leaderboard onGoHome={() => setShowLeaderboard(false)} />
      ) : (
        <>
          {currentScreen === 'intro' && (
            <IntroScreen
              onStart={handleStart}
              onShowRules={() => fadeToScreen('displayRules')}
              onShowLeaderboard={() => setShowLeaderboard(true)}
            />
          )}
          {currentScreen === 'pdaSimulator' && (
            <StackVisualizer selectedSprite={selectedSprite} />
          )}
          {currentScreen === 'displayRules' && (
            <RulesPage onShowRules={() => fadeToScreen('displayRules')} />
          )}

          {/* conditionally show player select when Start is clicked */}
          {showPlayerSelect && <PlayerSelect onSelect={handleSpriteSelect} />}

          {currentScreen === 'win' && (
            <WinPage onViewLeaderboard={() => setShowLeaderboard(true)} />
          )}
        </>
      )}
    </div>
  );
}

export default App;