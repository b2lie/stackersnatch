import React, { useState, useEffect } from 'react';
import { level1Images, level2Images } from './ImageMap';
import L1Img from './sprites/levels/level1.png'
import L2Img from './sprites/levels/level2.png'

import './StackVisualizer.css';

function StackVisualizer({ selectedSprite }) {
  const [showLevelInfo, setShowLevelInfo] = useState(false);
  const [level, setLevel] = useState(1); // starting at level 1
  const [stack, setStack] = useState([]);
  const [hasStarted, setHasStarted] = useState(false);
  const [time, setTime] = useState(0); // time tracking for each level
  const [currentState, setCurrentState] = useState('q0');
  const [currentLevelImage, setCurrentLevelImage] = useState(L1Img); // FSD for 1st level
  const [canProceedToNextLevel, setCanProceedToNextLevel] = useState(false);
  const [isStackValid, setIsStackValid] = useState(false); // stack validation

  useEffect(() => {
    let interval = null;

    if (hasStarted) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [hasStarted]);

  useEffect(() => {
    if (level === 1) {
      setCurrentLevelImage(L1Img);
    } else if (level === 2) {
      setCurrentLevelImage(L2Img);
    }
  }, [level]);

  const lvl1Stacks = { // L = { 0^n 1^n | n >= 0 }
    q0: (stack) => stack.length === 1 && stack[0] === 'z0', // initial state, z0 *must* be present anyways
    q1: (stack) => stack.every((item) => item === '0' || item === 'z0') && stack.includes('0'), // all 0's pushed
    q2: (stack) => stack.includes('z0') && !stack.includes('0'), // after pushing, check for if stack is just z0 & NO 0's!
    q3: (stack) => stack.length === 1 && stack[0] === 'z0' // stack empty -> only z0 present
  };

  const lvl2Stacks = { // L = { ww^R | w = (a + b)^+ }, all even-length palindromes - no empty strings

  };

  /* const lvl3Stacks = {

  }; */

  const handlePush = (symbol) => {
    setStack((prevStack) => [...prevStack, symbol]);
  };

  const handlePop = () => {
    if (stack.length > 1) { // prevent popping 'z0'
      setStack((prevStack) => prevStack.slice(0, -1));
    }
  };

  const handleTransition = () => {
    let isValid = false; // assuming current stack is invalid

    if (level === 1 && lvl1Stacks[currentState]) {
      isValid = lvl1Stacks[currentState](stack);
    } else if (level === 2 && lvl2Stacks[currentState]) {
      isValid = lvl2Stacks[currentState](stack);
    }

    setIsStackValid(isValid);
    if (isValid) { // player is moved to the next state + lvl img updated
      if (currentState === 'q3') {
        setCanProceedToNextLevel(true);
      } else {
        const nextState = `q${parseInt(currentState[1]) + 1}`; // generate the next state to go to - extracts the digit 'n' in string "qn"
        setCurrentState(nextState);

        if (level === 1) {
          setCurrentLevelImage(level1Images[nextState]);
        }

        if (level === 2) {
          setCurrentLevelImage(level2Images[nextState]);
        }
      }
    } else {
      alert('⛔ invalid stack for this state :T pls retry');
    }
  };

  const startRound = () => {
    setShowLevelInfo(true);
    setHasStarted(true);
    setStack(['z0']);
    setCurrentLevelImage(level1Images['q0']);
  }

  const handleNextLevel = () => {
    setHasStarted(true);  // level already started
    setStack(['z0']);     // only 'z0' on stack initially
    setCurrentState('q0');
    setCanProceedToNextLevel(true);
    setLevel(level + 1);
  };

  return (
    <div className="stack-visualizer">
      {/* timer + points panel */}
      <div className="left-panel">
        <h2>timer: {time}s</h2>
        <img
          src={selectedSprite?.img || '/chars/char1.png'}
          alt="player"
          style={{ width: '100px', height: '100px', marginTop: '10px' }}
        />
        <p>&gt;  {selectedSprite?.name || 'charlie'}  &lt;</p> <br />
        <a className="exit" href="/">exit</a>
      </div>

      {/* levels panel */}
      <div className="middle-panel">
        {!showLevelInfo && (
          <div className="center-button">
            <button onClick={() => startRound()}>
              {'[ round start ]'}
            </button>
          </div>
        )}

        {showLevelInfo && (
          <>
            <h2>
              Level {level} - {level === 1 ? '0^n 1^n' : '(a+b)^n'}
            </h2>
            <img src={currentLevelImage} alt="current level" />
          </>
        )}

        {/* display state we're at currently */}
        {hasStarted && (
          <div>
            <br />
            <h3>current state: {currentState}</h3>
          </div>
        )}
      </div>

      {/* stack panel */}
      <div className="right-panel">
        <h2>the stack</h2>
        <div className="stack-box">
          {stack.length === 0 ? (
            <p>[ empty ]</p>
          ) : (
            [...stack].reverse().map((item, index) => ( // pushes items on top of z0
              <div key={index} className="stack-item">
                {item}
              </div>
            ))
          )}
        </div>
        {/* stack interaction buttons */}
        {currentState === 'q3' ? (
          canProceedToNextLevel ? (
            <button onClick={handleNextLevel}>
              next level
            </button>
          ) : null
        ) : (
          <div className="button-row">
            <button onClick={() => handlePush('0')}>push '0'</button>
            <button onClick={handlePop}>pop</button>
            <button onClick={handleTransition}>transition</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default StackVisualizer;