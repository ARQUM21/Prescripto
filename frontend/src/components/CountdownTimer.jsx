import { useState, useEffect } from "react";

const CountdownTimer = ({ duration = 120, onResend }) => {

  const [timer, setTimer] = useState(duration);
  const [canResend, setCanResend] = useState(false);

  // Countdown timer
  useEffect(() => {
    if (timer === 0) {
      setCanResend(true);
      return;
    }
    const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  // Format timer (MM:SS)
  const formatTime = () => {
    const mins = Math.floor(timer / 60);
    const secs = timer % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Resend handler
  const handleResend = () => {
    setTimer(duration);
    setCanResend(false);
    onResend();
  };

  return (
    <div className="text-left text-sm">
      {canResend ? (
        <button type="button" onClick={handleResend} className="text-primary underline cursor-pointer hover:text-primary/80">
          Resend OTP
        </button>
      ) : (
        <p className="text-gray-500 font-medium">{formatTime()}</p>
      )}
    </div>
  );
};

export default CountdownTimer;