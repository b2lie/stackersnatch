import React, { useState, useEffect } from 'react';
import Leaderboard from './Leaderboard'
import StackVisualizer from './StackVisualizer';
import './WinPage.css';

const closeSound = new Audio('./sounds/close.mp3');

const playCloseSound = () => {
  closeSound.currentTime = 0;
  closeSound.volume = 0.2;
  closeSound.play();
};

const goHome = () => {
  playCloseSound();
  setTimeout(() => {
    window.location.href = '/'; // reload the page + go back to home
  }, 700); // wait 0.7s
}

function WinPage() {
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [playerScore, setPlayerScore] = useState(0);
  const [nameInputVisible, setNameInputVisible] = useState(true);
  const [scoreSubmitted, setScoreSubmitted] = useState(false);

  const viewLeaderboard = () => {
    setShowLeaderboard(true);
  };

  const handleNameChange = (event) => {
    setPlayerName(event.target.value);
  };

  // saving score and name to leaderboard
  const saveScore = () => {
    if (!playerName) {
      alert('please enter your name :D');
      return;
    }

    const newEntry = { name: playerName, score: playerScore };

    // get current leaderboard
    const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];

    // add new entry
    leaderboard.push(newEntry);

    // sort by score (descending order)
    leaderboard.sort((a, b) => b.score - a.score);

    // save updated leaderboard to localStorage
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
  };

  const handleGameEnd = () => {
    setNameInputVisible(false);
    setPlayerScore(100); // filler score
    saveScore(); // save score to leaderboard
    setScoreSubmitted(true);
  };

  useEffect(() => {
    setPlayerName('Player 1'); // example player name
    setPlayerScore(100); // example score
    saveScore(); // save to leaderboard
  }, []);

  return (
    <div className="middle-pane">
      {nameInputVisible ? (
        <>
          <h1>You Win!</h1>
          <input
            type="text"
            placeholder="Enter your name"
            value={playerName}
            onChange={handleNameChange}
          />
          <button onClick={handleGameEnd}>submit score</button>
        </>
      ) : (
        <>
          <h1>congratulations, {playerName}!</h1>

          <div className="button-row">
            {!scoreSubmitted && (
              <button onClick={viewLeaderboard}>view leaderboard</button>
            )}
            <button onClick={goHome}>return home</button>
          </div>
        </>
      )}

      {showLeaderboard && <Leaderboard />}
    </div>
  );
}

export default WinPage;