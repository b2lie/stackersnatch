import React, { useState, useEffect } from 'react';
import { useRef } from 'react';
import { level1Images, level2Images } from './ImageMap';
import L1Img from './sprites/levels/level1.png'
import L2Img from './sprites/levels/level2.png'

import './StackVisualizer.css';

function StackVisualizer({ selectedSprite }) {
  const [level, setLevel] = useState(1); // starting at level 1
  const [stack, setStack] = useState([]);
  const [hasStarted, setHasStarted] = useState(false);
  const [currentState, setCurrentState] = useState('q0');
  const [isStackValid, setIsStackValid] = useState(false);

  // for level-state functionality
  const [showLevelInfo, setShowLevelInfo] = useState(false);
  const [currentLevelImage, setCurrentLevelImage] = useState(L1Img); // FSD for 1st level
  const [canProceedToNextLevel, setCanProceedToNextLevel] = useState(false);
  const [hasCompletedLevel, setHasCompletedLevel] = useState(false);

  // time tracking for each level
  const [time, setTime] = useState(0);
  const timerRef = useRef(null);

  // for level 2
  const [userInput, setUserInput] = useState('');
  const [inputConfirmed, setInputConfirmed] = useState(false);
  const [inputSoFar, setInputSoFar] = useState('');

  const popSound = new Audio('./sounds/pop.mp3');
  const pushSound = new Audio('./sounds/push.mp3');
  const jumpSound = new Audio('./sounds/jump.mp3');

  useEffect(() => {
    timerRef.current = null;

    if (hasStarted && !(currentState === 'q3' && isStackValid)) { // stop timer when presented w/ expected final stack and allow moving to next lvl
      timerRef.current = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [hasStarted, currentState, isStackValid]); // dependency array -> code block rerun if any of these change

  useEffect(() => {
    if (hasStarted && currentState === 'q3' && isStackValid) {
      clearInterval(timerRef.current);
      setHasStarted(false);
      setHasCompletedLevel(true);
      alert("⏲ timer paused. click 'next level' to resume it.");
    }
  }, [hasStarted, currentState, isStackValid]);

  // dynamic image updates for each lvl based on current state
  useEffect(() => {
    // level-dependent; use current state to get lvl image
    if (level === 1) {
      setCurrentLevelImage(level1Images[currentState]);
    } else if (level === 2) {
      setCurrentLevelImage(level2Images[currentState]);
    }
  }, [level, currentState]);

  const lvl1Stacks = { // L = { 0^n 1^n | n >= 0 }
    q0: (stack) => stack.length === 1 && stack[0] === 'z0', // initial state, z0 *must* be present always
    q1: (stack) => stack.every((item) => item === '0' || item === 'z0') && stack.includes('0'), // all 0's pushed
    q2: (stack) => stack.includes('z0') && !stack.includes('0'), // after pushing, check for if stack is just z0 & NO 0's!
    q3: (stack) => stack.length === 1 && stack[0] === 'z0' // stack empty -> only z0 present
  };

  // const lvl2Stacks = { // L = { ww^R | w = (a + b)^+ }, all even-length palindromes - no empty strings
  //   q0: (stack) => stack.length === 1 && stack[0] === 'z0', // initial state, z0 *must* be present always
  //   q1: (stack) => stack.length > 1 && stack[0] === 'z0' && stack.slice(1).every( ch => ch === 'a' || ch === 'b'), // put any number of a's or b's
  //   q2: (stack, inputSymbol) => {
  //     const top = stack[stack.length - 1];
  //     return top === inputSymbol; // curr symbol matches top of stack?
  //   },
  //   q3: (stack) => stack.length === 1 && stack[0] === 'z0' // stack empty -> only z0 present
  // };

  const lvl2Stacks = {
    q0: (stack) => stack.length === 1 && stack[0] === 'z0', // start state
    q1: (stack, userInput) => {
      if (!stack.includes("z0")) return false;

      const firstHalf = userInput.slice(0, Math.floor(userInput.length / 2));
      const pushedPart = stack.slice(1); // ignore z0

      if (pushedPart.length !== firstHalf.length) return false;

      for (let i = 0; i < firstHalf.length; i++) {
        if (pushedPart[i] !== firstHalf[i]) return false;
      }

      return true;
    },
    q2: (stack) => {
      // popping and comparing stack top w/ remaining unpushed input string chars
      const midLength = Math.floor(userInput.length / 2); // mid point of string
      const remainingInput = userInput.slice(midLength); // get second half of string

      // q2 -> popping from the stack and comparing
      if (stack.length > 1 && stack[stack.length - 1] === remainingInput[remainingInput.length - 1]) {
        stack.pop(); // pop the top character from the stack
        return true;
      }

      return false; // invalid transition (either chars don't match or stack too small)
  },
    q3: (stack) => stack.length === 1 && stack[0] === 'z0' // success if only z0 remains
  };

  /* const lvl3Stacks = {

  }; */

  const handlePush = (symbol) => {
    pushSound.play();
    pushSound.volume = 0.5;
    setStack((prevStack) => [...prevStack, symbol]);

    if (level === 2 && inputConfirmed) {
      setInputSoFar((prev) => prev + symbol);
    }
  };

  const handlePop = () => {
    popSound.play();
    popSound.volume = 0.5;
    if (stack.length > 1) { // prevent popping 'z0'
      setStack((prevStack) => prevStack.slice(0, -1));
    }
  };

  const handleTransition = () => {
    jumpSound.play();
    jumpSound.volume = 0.5;
    let isValid = false; // assuming current stack is invalid

    if (level === 1 && lvl1Stacks[currentState]) {
      isValid = lvl1Stacks[currentState](stack);
    } else if (level === 2 && lvl2Stacks[currentState]) {
      let arg = null;

      if (currentState == 'q1') {
        arg = inputSoFar;
      } else if (currentState === 'q2') {
        // q2 -> pass only the current character being checked against the stack
        const firstHalfLength = Math.floor(inputSoFar.length / 2);
        const indexInSecondHalf = stack.length - 2; // because z0 is at bottom, and top of stack is last pushed
        arg = inputSoFar[firstHalfLength + indexInSecondHalf];
      }

      isValid = lvl2Stacks[currentState](stack, arg, userInput);
    }

    setIsStackValid(isValid);
    if (isValid) { // player is moved to the next state + lvl img updated
      if (currentState === 'q3') {
        setCanProceedToNextLevel(true);
      } else {
        const nextState = `q${parseInt(currentState[1]) + 1}`; // generate the next state to go to - extracts the digit 'n' in string "qn"
        setCurrentState(nextState);
        // image updation handled by userEffect() function
      }
    } else {
      alert('⛔ invalid stack for this state :T pls retry');
    }
  };

  const startRound = () => {
    setShowLevelInfo(true);
    setHasStarted(true);
    setStack(['z0']);
    setCurrentLevelImage(level1Images[currentState]);
  }

  const handleNextLevel = () => {
    setLevel(prev => prev + 1);
    setShowLevelInfo(true);
    setStack(['z0']);
    setCurrentState('q0');

    // reset for upcoming level
    setHasStarted(true);
    setCanProceedToNextLevel(false);
    setHasCompletedLevel(false);

    setCurrentLevelImage(L2Img);

    // setTimeout(() => {
    //   if (level === 2) {
    //     setCurrentLevelImage(level2Images['q0']); // set first image of level 2 (state q0)
    //   }
    // }, 0); // slight delay to ensure that state change is complete b4 setting img

    // ensure timer doesn't reset
    if (!hasCompletedLevel) {
      setHasStarted(true); // keep timer running from its current position
    }
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

        {showLevelInfo && !hasCompletedLevel && (
          <>
            <h2>
              Level {level} - {level === 1 ? '0^n 1^n' : '(a+b)^+'}
            </h2>
            {level === 1 && <img src={currentLevelImage} alt="current level" />}

            {/* Insert input prompt for Level 2 */}
            {level === 2 && !inputConfirmed && (
              <div className="input-prompt">
                <h3>enter a string (a + b)^+ to validate wwʳ:</h3>
                <div className="input-area">
                  <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="e.g. abba"
                  />
                  <button
                    onClick={() => {
                      if (userInput.length % 2 === 0 && /^[ab]+$/.test(userInput)) {
                        setInputConfirmed(true);
                        alert("✅ valid input confirmed! simulate wwʳ");
                      } else {
                        alert("❌ input must be even-length and contain only a/b");
                      }
                    }}
                  >
                    confirm
                  </button>
                </div>
              </div>
            )}
            {level === 2 && inputConfirmed && <img src={currentLevelImage} alt="current level" />}
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
        {showLevelInfo && (
          currentState === 'q3' && isStackValid ? (
            <button onClick={handleNextLevel}>
              next level
            </button>
          ) : (
            <div className="button-row">
              {level === 1 && (
                <button onClick={() => handlePush('0')}>push '0'</button>
              )}
              {level === 2 && (
                <>
                  <button onClick={() => handlePush('a')}>push 'a'</button>
                  <button onClick={() => handlePush('b')}>push 'b'</button>
                </>
              )}
              <button onClick={handlePop}>pop</button>
              <button onClick={handleTransition}>transition</button>
            </div>
          )
        )}

      </div>
    </div>
  );
}

export default StackVisualizer;