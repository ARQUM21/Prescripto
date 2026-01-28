import { useRef, useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Mail } from "lucide-react";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import CountdownTimer from "../components/CountdownTimer";

const OtpVerify = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyPasswordResetOtp, sendPasswordResetOtp } = useContext(AppContext);

  const email = location.state?.email || "";
  const inputRefs = useRef([]);
  const [loading, setLoading] = useState(false);

  // Redirect if no email
  useEffect(() => {
    if (!email) navigate("/email-verify");
  }, [email, navigate]);

  // Auto-focus next input
  const handleInput = (e, index) => {
    if (e.target.value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Backspace handler
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // Paste handler
  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text").split("");
    paste.forEach((char, i) => {
      if (inputRefs.current[i]) inputRefs.current[i].value = char;
    });
    inputRefs.current[Math.min(5, paste.length - 1)]?.focus();
  };

  // Submit OTP
  const handleSubmit = async (e) => {
    e.preventDefault();
    const otp = inputRefs.current.map((input) => input.value).join("");
    
    if (otp.length !== 6) {
      toast.error("Please enter 6-digit OTP");
      return;
    }

    setLoading(true);
    await verifyPasswordResetOtp(email, otp, navigate);
    setLoading(false);
  };

  // Resend OTP
  const handleResend = async () => {
    await sendPasswordResetOtp(email, navigate);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8">
      <form onSubmit={handleSubmit} className="w-full max-w-md p-6 sm:p-8 border rounded-xl shadow-lg bg-white">
        
        {/* Back Button */}
        <button type="button" onClick={() => navigate("/email-verify")} className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 transition-colors">
          <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
          <span className="text-sm sm:text-base">Back</span>
        </button>

        {/* Title */}
        <h1 className="text-xl sm:text-2xl font-semibold text-center mb-2 text-gray-800">
          Verify OTP
        </h1>
        <p className="text-center text-gray-600 text-xs sm:text-sm mb-2">
          Enter 6-digit code sent to
        </p>
        
        {/* Email Display */}
        <div className="flex items-center justify-center gap-2 text-primary mb-6">
          <Mail size={14} className="sm:w-4 sm:h-4" />
          <span className="font-medium text-xs sm:text-sm break-all">{email}</span>
        </div>

        {/* OTP Inputs - Responsive */}
        <div className="flex justify-between gap-1.5 sm:gap-2 mb-6" onPaste={handlePaste}>
          {[...Array(6)].map((_, i) => (
            <input
              key={i}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength="1"
              ref={(el) => (inputRefs.current[i] = el)}
              onInput={(e) => handleInput(e, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-center text-lg sm:text-xl md:text-2xl border-2 border-gray-300 rounded-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
          ))}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2.5 sm:py-3 rounded-md text-white text-sm sm:text-base font-medium mb-4 transition-all ${
            loading 
              ? "bg-gray-400 cursor-not-allowed" 
              : "bg-primary hover:bg-primary/90 active:scale-[0.98]"
          }`}
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        {/* Countdown Timer */}
        <div className="text-center">
          <CountdownTimer duration={120} onResend={handleResend} />
        </div>

      </form>
    </div>
  );
};

export default OtpVerify;