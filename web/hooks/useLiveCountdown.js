import { useState, useEffect, useCallback } from "react";

export function useLiveCountdown(timer) {
  const [timeLeft, setTimeLeft] = useState(null);
  const [timerState, setTimerState] = useState("loading"); // loading, before, active, expired
  const [loopCount, setLoopCount] = useState(0);

  // Calculate time remaining and timer state
  const calculateTimeLeft = useCallback(() => {
    if (!timer) return;

    const now = new Date();
    const startTime = timer.startTime ? new Date(timer.startTime) : null;
    const endTime = timer.endTime ? new Date(timer.endTime) : null;

    // Determine timer state
    if (startTime && now < startTime) {
      setTimerState("before");
      setTimeLeft(startTime - now);
    } else if (endTime && now > endTime) {
      if (timer.loop && timer.duration) {
        // Handle looping - restart timer
        const loopDuration = timer.duration * 60 * 1000; // Convert to milliseconds
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
        // Calculate end time based on duration
        const endTimeFromDuration = new Date(now.getTime() + (timer.duration * 60 * 1000));
        setTimeLeft(endTimeFromDuration - now);
      } else {
        setTimeLeft(null);
      }
    }
  }, [timer]);

  // Update countdown every second
  useEffect(() => {
    calculateTimeLeft();
    
    const interval = setInterval(() => {
      calculateTimeLeft();
    }, 1000);

    return () => clearInterval(interval);
  }, [calculateTimeLeft]);

  // Format time remaining
  const formatTimeLeft = (milliseconds) => {
    if (milliseconds <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

    const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24));
    const hours = Math.floor((milliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
  };

  // Get timer message based on state
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

  // Check if timer should be hidden
  const shouldHide = () => {
    if (timerState === "expired" && timer.hideAfterCompletion) {
      return true;
    }
    return false;
  };

  return {
    timeLeft,
    timerState,
    formatTimeLeft,
    getTimerMessage,
    formattedTime: formatTimeLeft(timeLeft || 0),
    shouldHide,
    loopCount,
  };
} 