import React, { useState, useEffect } from 'react';
import { useRef } from 'react';
import { level1Images, level2Images } from './ImageMap';
import WinPage from './WinPage';
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
  const [points, setPoints] = useState(100);
  const timerRef = useRef(null);

  // for level 2
  const [userInput, setUserInput] = useState('');
  const [inputConfirmed, setInputConfirmed] = useState(false);
  const [inputSoFar, setInputSoFar] = useState('');
  const [poppedChar, setPoppedChar] = useState(null);
  const [popIndex, setPopIndex] = useState(0); // popping and comparing values

  const [hasWon, setHasWon] = useState(false);

  const popSound = new Audio('./sounds/pop.mp3');
  const pushSound = new Audio('./sounds/push.mp3');
  const jumpSound = new Audio('./sounds/jump.mp3');

  const handleWin = () => {
    setHasWon(true);
    setPoints(points);
    // calculatePoints();
  };

  useEffect(() => {
    console.log('updated points:', points); // log updated points
  }, [points]);

  useEffect(() => {
    if (hasWon) {
      console.log('final points:', points);
    }
  }, [hasWon]);

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
      // calculatePoints();
      setCurrentLevelImage(level1Images[currentState]);
    } else if (level === 2) {
      // calculatePoints();
      setCurrentLevelImage(level2Images[currentState]);
    }
  }, [level, currentState]);

  const lvl1Stacks = { // L = { 0^n 1^n | n >= 0 }
    q0: (stack) => stack.length === 1 && stack[0] === 'z0', // initial state, z0 *must* be present always
    q1: (stack) => stack.every((item) => item === '0' || item === 'z0') && stack.includes('0'), // all 0's pushed
    q2: (stack) => stack.includes('z0') && !stack.includes('0'), // after pushing, check for if stack is just z0 & NO 0's!
    q3: (stack) => stack.length === 1 && stack[0] === 'z0' // stack empty -> only z0 present
  };

  const lvl2Stacks = {
    q0: (stack) => stack.length === 1 && stack[0] === 'z0', // start state
    q1: (stack, userInput) => {
      if (!stack.includes("z0")) return false;

      const firstHalf = userInput.slice(0, (userInput.length / 2) + 1); // string sliced upto & including the mid char
      const stackString = stack.slice(1).join(""); // join stack elements to form a string, excluding z0

      console.log("first half:", firstHalf);
      console.log("stack string:", stackString);

      // compare the string from the stack with the first half of the input string
      if (stackString !== firstHalf) return false;

      setPopIndex(0); // for q1 -> q2 transitioning

      return true;
    },
    q2: (stack, poppedChar, userInput, popIndex) => {
      const midLength = Math.floor(userInput.length / 2);
      const secondHalf = userInput.slice(midLength).split(''); // second half of input

      console.log("second half:", secondHalf); // supposed reversed part
      console.log("current pop index:", popIndex);

      // stop if we've popped everything we need
      if (popIndex >= secondHalf.length || stack.length <= 1) {
        console.log("all chars popped or not enough in stack.");
        if (stack.length === 1 && stack[0] === 'z0') return true; // only z0 remains on transition
        return false;
      }

      const expectedChar = secondHalf[popIndex];

      console.log("popped:", poppedChar);
      console.log("expected:", expectedChar);

      if (poppedChar !== expectedChar) {
        console.log("mismatch found.");
        return false; // wrong char = transition fails
      }

      // update popIndex *only if* match
      setPopIndex(popIndex + 1);

      // if this was the last expected character:
      if (popIndex + 1 === secondHalf.length) {
        console.log("successfully matched entire second half.");
        return true; // only now we return true
      }

      return null; // in-between step, don't change state yet
    },

    q3: (stack) => {
      if (stack.length === 1 && stack[0] === 'z0') { // success if only z0 remains
        console.log("stack check complete — you win!");
        handleWin();
      }
    }

  };

  // const calculatePoints = () => {
  //   const maxTime = 60; // max time for a level
  //   const timePenalty = Math.min(maxTime, time); // prevent negative time score
  //   const timeScore = Math.max(0, maxTime - timePenalty); // more time = reduced points
  //   const basePoints = 100; // base points for completing a level

  //   // deduct points based on no. of invalid moves or alerts
  //   const finalPoints = basePoints + timeScore;

  //   setPoints(finalPoints);
  // };


  const deductPoints = () => {
    if (points > 20) {
      setPoints(prevPoints => prevPoints - 20);
    }
  }

  const handlePush = (symbol) => {
    pushSound.play();
    pushSound.volume = 0.2;
    setStack((prevStack) => [...prevStack, symbol]);
    if (level === 2 && inputConfirmed) {
      setInputSoFar((prev) => prev + symbol);
    }
  };

  const handlePop = () => {
    popSound.play();
    popSound.volume = 0.2;
    if (stack.length > 1) { // prevent popping 'z0'
      const newStack = [...stack];
      const popped = newStack.pop();
      setPoppedChar(popped);
      setStack(newStack); // updated original stack after we popped the value!
      // setStack((prevStack) => prevStack.slice(0, -1));

    } else {
      alert("⚠ can't pop z0 !");
      deductPoints();
    }
  };

  const handleTransition = () => {
    jumpSound.play();
    jumpSound.volume = 0.2;

    let isValid = false; // assuming current stack is invalid

    if (level === 1 && lvl1Stacks[currentState]) {
      isValid = lvl1Stacks[currentState](stack);
    } else if (level === 2 && lvl2Stacks[currentState]) {
      let arg = null;

      if (currentState == 'q1') {
        arg = inputSoFar;
        isValid = lvl2Stacks.q1(stack, arg);
      } else if (currentState === 'q2') {
        if (!poppedChar) {
          alert("🤚🏻 please pop something first !");
          deductPoints();
          return;
        }

        arg = poppedChar;
        isValid = lvl2Stacks.q2(stack, arg, userInput, popIndex);

        // // q2 -> pass only the current character being checked against the stack
        // const firstHalfLength = Math.floor(inputSoFar.length / 2);
        // const indexInSecondHalf = stack.length - 2; // because z0 is at bottom, and top of stack is last pushed
        // arg = inputSoFar[firstHalfLength + indexInSecondHalf];
      }
      isValid = lvl2Stacks[currentState](stack, arg, userInput, popIndex);
    }

    setIsStackValid(isValid);
    if (isValid) { // player is moved to the next state + lvl img updated
      setPoints(prevPoints => prevPoints + 30);
      if (currentState === 'q3') {
        setCanProceedToNextLevel(true);
      } else {
        const nextState = `q${parseInt(currentState[1]) + 1}`; // generate the next state to go to - extracts the digit 'n' in string "qn"
        setCurrentState(nextState);
        // image updation handled by userEffect() function
      }
    } else if (isValid && currentState === 'q2') {
      setPopIndex(prev => prev + 1);
    } else {
      alert('⛔ invalid stack for this state :T pls retry');
      deductPoints();
    }
  };

  const startRound = () => {
    setShowLevelInfo(true);
    setHasStarted(true);
    setStack(['z0']);
    setCurrentLevelImage(level1Images[currentState]);
  }

  const handleNextLevel = () => {
    if (level >= 2) {
      handleWin();
      return;
    }

    const nextLevel = level + 1;
    setLevel(nextLevel);

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

  return (<div className="stack-visualizer">
    {hasWon ? (
      <WinPage score={points}/>
    ) : (
      <>
        {/* timer + points panel */}
        < div className="left-panel"> <h2>timer: {time}s</h2>
          <img
            src={selectedSprite?.img || '/chars/char1.png'}
            alt="player"
            style={{ width: '100px', height: '100px', marginTop: '10px' }}
          /> <p>&gt;  {selectedSprite?.name || 'charlie'}  &lt;</p> <br /> <a className="exit" href="/">exit</a>
          <p className="points">points: {points}</p>
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
                        if (
                          userInput.length % 2 === 0 &&
                          /^[ab]+$/.test(userInput) &&
                          userInput === userInput.split('').reverse().join('')
                        ) {
                          setInputConfirmed(true);
                          alert("✅ valid palindrome confirmed! simulate wwʳ");
                          setPoints(prevPoints => prevPoints + 10);
                        } else {
                          alert("❌ input must be an even-length palindrome made of a/b only");
                          deductPoints();
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
      </>
    )}
  </div >
  );
}

export default StackVisualizer;