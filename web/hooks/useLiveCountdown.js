import { useState, useEffect, useCallback } from "react";

export function useLiveCountdown(timer) {
  const [timeLeft, setTimeLeft] = useState(null);
  const [timerState, setTimerState] = useState("loading");
  const [loopCount, setLoopCount] = useState(0);

  const calculateTimeLeft = useCallback(() => {
    if (!timer) return;

    const now = new Date();
    const startTime = timer.startTime ? new Date(timer.startTime) : null;
    const endTime = timer.endTime ? new Date(timer.endTime) : null;

    if (startTime && now < startTime) {
      setTimerState("before");
      setTimeLeft(startTime - now);
    } else if (endTime && now > endTime) {
      if (timer.loop && timer.duration) {
        const loopDuration = timer.duration * 60 * 1000;
        const timeSinceExpiry = now - endTime;
        const loopsCompleted = Math.floor(timeSinceExpiry / loopDuration);
        const nextLoopStart = new Date(endTime.getTime() + (loopsCompleted + 1) * loopDuration);
        
        setTimerState("active");
        setTimeLeft(nextLoopStart - now);
        setLoopCount(loopsCompleted + 1);
      } else {
        setTimerState("expired");
        setTimeLeft(0);
      }
    } else {
      setTimerState("active");
      if (endTime) {
        setTimeLeft(endTime - now);
      } else if (timer.duration) {
        const endTimeFromDuration = new Date(now.getTime() + (timer.duration * 60 * 1000));
        setTimeLeft(endTimeFromDuration - now);
      } else {
        setTimeLeft(null);
      }
    }
  }, [timer]);

  useEffect(() => {
    calculateTimeLeft();
    
    const interval = setInterval(() => {
      calculateTimeLeft();
    }, 1000);

    return () => clearInterval(interval);
  }, [calculateTimeLeft]);

  const formatTimeLeft = (milliseconds) => {
    if (milliseconds <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

    const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24));
    const hours = Math.floor((milliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
  };

  const getTimerMessage = () => {
    switch (timerState) {
      case "before":
        return timer.beforeMessage || "Coming soon!";
      case "active":
        return timer.beforeMessage || "Limited time offer!";
      case "expired":
        return timer.afterMessage || "Offer has ended";
      default:
        return "Timer loading...";
    }
  };

  const shouldHide = () => {
    if (timerState === "expired" && timer.hideAfterCompletion) {
      return true;
    }
    return false;
  };

  const isUrgencyMode = () => {
    if (!timer.urgencySettings?.enabled || timerState !== "active") {
      return false;
    }
    
    const minutesLeft = timeLeft ? Math.floor(timeLeft / (1000 * 60)) : 0;
    return minutesLeft <= timer.urgencySettings.triggerMinutes;
  };

  return {
    timeLeft,
    timerState,
    formatTimeLeft,
    getTimerMessage,
    formattedTime: formatTimeLeft(timeLeft || 0),
    shouldHide,
    loopCount,
    isUrgencyMode,
  };
} 