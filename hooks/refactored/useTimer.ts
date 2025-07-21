import { useState, useEffect, useCallback } from 'react';

export const useTimer = (initialTime: number, onTimeUp: () => void) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    if (isTimerRunning && timeLeft > 0) {
      const interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (isTimerRunning && timeLeft === 0) {
      onTimeUp();
    }
  }, [isTimerRunning, timeLeft, onTimeUp]);

  const startTimer = useCallback(() => {
    setIsTimerRunning(true);
  }, []);

  const stopTimer = useCallback(() => {
    setIsTimerRunning(false);
  }, []);

  const resetTimer = useCallback((newTime: number) => {
    setTimeLeft(newTime);
    setIsTimerRunning(false);
  }, []);

  return {
    timeLeft,
    isTimerRunning,
    startTimer,
    stopTimer,
    resetTimer,
    setTimeLeft,
    setIsTimerRunning,
  };
};
