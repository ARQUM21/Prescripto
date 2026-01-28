import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mail } from "lucide-react";
import { AppContext } from "../context/AppContext";

const EmailVerify = () => {
  const navigate = useNavigate();
  const { sendPasswordResetOtp } = useContext(AppContext);

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await sendPasswordResetOtp(email, navigate);
    setLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8">
      <form onSubmit={handleSubmit} className="w-full max-w-md p-6 sm:p-8 border rounded-xl shadow-lg bg-white">
        
        {/* Back Button */}
        <button type="button" onClick={() => navigate("/login")} className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 transition-colors">
          <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
          <span className="text-sm sm:text-base">Back to Login</span>
        </button>

        {/* Title */}
        <h1 className="text-xl sm:text-2xl font-semibold text-center mb-2 text-gray-800">
          Reset Password
        </h1>
        <p className="text-center text-gray-600 text-xs sm:text-sm mb-6">
          Enter your email to receive OTP
        </p>

        {/* Email Input */}
        <div className="mb-6">
          <div className="relative">
            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 sm:w-[18px] sm:h-[18px]" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full pl-10 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-300 rounded-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2.5 sm:py-3 rounded-md text-white text-sm sm:text-base font-medium transition-all ${
            loading 
              ? "bg-gray-400 cursor-not-allowed" 
              : "bg-primary hover:bg-primary/90 active:scale-[0.98]"
          }`}
        >
          {loading ? "Sending..." : "Send OTP"}
        </button>

      </form>
    </div>
  );
};

export default EmailVerify;