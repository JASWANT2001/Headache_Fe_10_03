import React, { useState } from "react";
import { Mail, ArrowLeft, Lock, CheckCircle2 } from "lucide-react";

export default function ForgotPassword({ onBack }) {

  const [step, setStep] = useState(1);
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetToken, setResetToken] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [maskedContact, setMaskedContact] = useState("");

  const API_URL = "/api/auth";

  /* REQUEST OTP */

  const handleRequestOTP = async (e) => {

    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {

      const res = await fetch(`${API_URL}/forgot-password/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, method: "email" })
      });

      const data = await res.json();

      if (data.success) {

        setSuccess(data.message);
        setMaskedContact(data.maskedContact);
        setStep(2);

      } else {

        setError(data.message);

      }

    } catch {

      setError("Failed to send OTP");

    }

    setLoading(false);

  };


  /* RESEND OTP */

  const handleResendOTP = async () => {

    setLoading(true);
    setError("");
    setSuccess("");

    try {

      const res = await fetch(`${API_URL}/forgot-password/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, method: "email" })
      });

      const data = await res.json();

      if (data.success) {

        setSuccess("OTP resent successfully");

      } else {

        setError(data.message);

      }

    } catch {

      setError("Failed to resend OTP");

    }

    setLoading(false);

  };


  /* VERIFY OTP */

  const handleVerifyOTP = async (e) => {

    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {

      const res = await fetch(`${API_URL}/forgot-password/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, otp })
      });

      const data = await res.json();

      if (data.success) {

        setResetToken(data.resetToken);
        setSuccess("OTP verified successfully");
        setStep(3);

      } else {

        setError(data.message);

      }

    } catch {

      setError("OTP verification failed");

    }

    setLoading(false);

  };


  /* RESET PASSWORD */

  const handleResetPassword = async (e) => {

    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {

      setError("Passwords do not match");
      setLoading(false);
      return;

    }

    try {

      const res = await fetch(`${API_URL}/forgot-password/reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resetToken, newPassword, confirmPassword })
      });

      const data = await res.json();

      if (data.success) {

        setSuccess("Password reset successful");
        setTimeout(() => onBack(), 2000);

      } else {

        setError(data.message);

      }

    } catch {

      setError("Failed to reset password");

    }

    setLoading(false);

  };


  return (

    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-700 p-6">

      <div className="w-full max-w-md">

        {/* CARD */}

        <div className="bg-white/90 backdrop-blur-lg shadow-2xl rounded-3xl p-10 border border-white/20">

          {/* HEADER */}

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Reset Password
          </h1>

          <p className="text-sm text-gray-500 mb-8">

            {step === 1 && "Enter your email to receive an OTP"}
            {step === 2 && `Enter OTP sent to ${maskedContact}`}
            {step === 3 && "Create your new password"}

          </p>


          {/* PROGRESS */}

          <div className="flex gap-2 mb-8">

            {[1, 2, 3].map((i) => (

              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full transition ${
                  i <= step ? "bg-indigo-600" : "bg-gray-200"
                }`}
              />

            ))}

          </div>


          {/* ERROR */}

          {error && (

            <div className="mb-4 p-3 rounded-lg text-sm bg-red-100 text-red-600">
              {error}
            </div>

          )}


          {/* SUCCESS */}

          {success && (

            <div className="mb-4 p-3 rounded-lg text-sm bg-green-100 text-green-700 flex items-center gap-2">
              <CheckCircle2 size={16} />
              {success}
            </div>

          )}


          {/* STEP 1 */}

          {step === 1 && (

            <form onSubmit={handleRequestOTP} className="space-y-5">

              <div>

                <label className="text-sm font-semibold text-gray-700">
                  Email Address
                </label>

                <div className="relative mt-2">

                  <Mail className="absolute left-3 top-3.5 text-gray-400" size={18} />

                  <input
                    type="email"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
                  />

                </div>

              </div>

              <button
                disabled={loading}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition"
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>

            </form>

          )}


          {/* STEP 2 */}

          {step === 2 && (

            <form onSubmit={handleVerifyOTP} className="space-y-5">

              <input
                value={otp}
                onChange={(e) => setOtp(e.target.value.slice(0, 6))}
                placeholder="000000"
                className="w-full text-center text-2xl tracking-[10px] py-3 border rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
              />

              <button
                disabled={loading || otp.length !== 6}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
              >
                Verify OTP
              </button>

              <button
                type="button"
                onClick={handleResendOTP}
                className="w-full py-3 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-600"
              >
                Resend OTP
              </button>

            </form>

          )}


          {/* STEP 3 */}

          {step === 3 && (

            <form onSubmit={handleResetPassword} className="space-y-5">

              <div className="relative">

                <Lock className="absolute left-3 top-3.5 text-gray-400" size={18} />

                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 border rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
                />

              </div>

              <div className="relative">

                <Lock className="absolute left-3 top-3.5 text-gray-400" size={18} />

                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 border rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
                />

              </div>

              <button
                disabled={loading}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
              >
                Reset Password
              </button>

            </form>

          )}


          {/* BACK */}

          <button
            onClick={onBack}
            className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-indigo-600 w-full"
          >
            <ArrowLeft size={16} />
            Back to Login
          </button>

        </div>

      </div>

    </div>

  );

}