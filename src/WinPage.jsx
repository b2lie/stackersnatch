import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import Leaderboard from './Leaderboard'
import './WinPage.css';

const closeSound = new Audio('./sounds/close.mp3');
const winSound = new Audio('./sounds/win.mp3');
const yaySound = new Audio('./sounds/yay.mp3');

const playCloseSound = () => {
  closeSound.currentTime = 0;
  closeSound.volume = 0.2;
  closeSound.play();
};

const playWinSound = () => {
  winSound.currentTime = 0;
  winSound.volume = 0.2;
  winSound.play();
  yaySound.volume = 0.1;
  yaySound.play();
};

const goHome = () => {
  playCloseSound();
  setTimeout(() => {
    window.location.href = '/'; // reload the page + go back to home
  }, 700); // wait 0.7s
}

function WinPage({ score }) {
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [playerScore, setPlayerScore] = useState(score || 0);
  const [nameInputVisible, setNameInputVisible] = useState(true);
  const [scoreSubmitted, setScoreSubmitted] = useState(false);
  const [imageSrc, setImageSrc] = useState(require('./sprites/win.gif'));
  const [isTransitioning, setIsTransitioning] = useState(false);

  const launchConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const viewLeaderboard = () => {
    setShowLeaderboard(true);
  };

  const handleNameChange = (event) => {
    setPlayerName(event.target.value);
  };

  // saving score and name to leaderboard
  const saveScore = () => {
    if (!playerName.trim() || playerScore <= 0) {
      return; // not saving empty or zero scores
    }

    if (!playerName.trim()) {
      alert('please enter your name :D');
      return;
    }

    const newEntry = { name: playerName, score: playerScore };
    console.log("saving new entry:", newEntry);

    // get current leaderboard
    const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    console.log("current leaderboard:", leaderboard);

    // add new entry
    leaderboard.push(newEntry);

    // sort by score (descending order)
    leaderboard.sort((a, b) => b.score - a.score);

    // save updated leaderboard to localStorage
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
  };

  const handleGameEnd = () => {
    launchConfetti();
    playWinSound();
    setIsTransitioning(true);
    setTimeout(() => {
      setImageSrc(require('./sprites/congratulations.gif'));
      setIsTransitioning(false);
      setNameInputVisible(false);
      saveScore();
      setScoreSubmitted(true);
      setShowLeaderboard(true); // <- add this line!
    }, 100); // fade-out animation
  };

  useEffect(() => {
    setPlayerName('player 1'); // example player name
    setPlayerScore(score); // setting score
    // saveScore(); // save to leaderboard
  }, [score]);

  return (
    <div className="winpage-container">
      <div className="winpane-left">
        <img
          src={imageSrc}
          alt="win screen"
          className={`win-image ${imageSrc.includes('congratulations') ? 'congrats-gif' : 'win-gif'}`}
        />
      </div>

      <div className="winpane-right">
        {nameInputVisible ? (
          <>
            <h1>congratulations!</h1>
            <h2>⭐ you win :D ⭐</h2>
            <input
              type="text"
              maxLength="20"
              placeholder="enter your name"
              value={playerName}
              onChange={handleNameChange}
            />
            <button onClick={handleGameEnd}>submit score</button>
          </>
        ) : (
          <div className="leaderboard-container">
            <Leaderboard />
          </div>
        )}
      </div>
    </div>
  );
}

export default WinPage;