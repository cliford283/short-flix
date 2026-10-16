import React, { useState } from 'react';
import {
  ArrowLeft,
  X,
  Mail,
  Lock,
  User,
  Check,
  Eye,
  EyeOff,
  Sparkles,
} from 'lucide-react';

export type AuthScreenType = 'splash' | 'onboarding' | 'signin' | 'signup' | 'verify';

interface AuthModalProps {
  initialScreen?: AuthScreenType;
  onSuccess: (userData: { name: string; email: string }) => void;
  onClose: () => void;
  posterPreviews: string[];
}

export const AuthModal: React.FC<AuthModalProps> = ({
  initialScreen = 'onboarding',
  onSuccess,
  onClose,
  posterPreviews,
}) => {
  const [currentScreen, setCurrentScreen] = useState<AuthScreenType>(initialScreen);
  const [name, setName] = useState('Darlene Robertson');
  const [email, setEmail] = useState('darlene@example.com');
  const [password, setPassword] = useState('••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(true);
  const [otp, setOtp] = useState(['5', '8', '2', '4']);
  const [timer, setTimer] = useState(45);

  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) val = val[val.length - 1];
    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);

    // Auto-focus next input
    if (val && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    onSuccess({ name: 'Darlene Robertson', email });
    onClose();
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentScreen('verify');
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    onSuccess({ name: name || 'Darlene Robertson', email });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-sm rounded-3xl bg-[#11111A] border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 text-slate-400 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* 1. Splash Screen View */}
        {currentScreen === 'splash' && (
          <div
            onClick={() => setCurrentScreen('onboarding')}
            className="flex-1 min-h-[500px] flex flex-col items-center justify-center p-6 text-center bg-radial-gradient from-[#3d1800] via-[#11111A] to-[#0A0A0F] cursor-pointer"
          >
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#FF5500] to-[#FF8540] flex items-center justify-center shadow-2xl shadow-[#FF4500]/50 mb-4 animate-pulse">
              <span className="text-3xl font-black text-white font-['Bricolage_Grotesque']">SF</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white font-['Bricolage_Grotesque']">
              ShortFlix
            </h1>
            <p className="text-xs text-slate-400 mt-2">Bite-Sized Drama, Epic Stories</p>
            <span className="mt-8 text-[11px] text-[#FF6520] font-semibold animate-bounce">
              Tap anywhere to start →
            </span>
          </div>
        )}

        {/* 2. Onboarding Screen View (Matching screenshot row 1 screen 2) */}
        {currentScreen === 'onboarding' && (
          <div className="flex-1 flex flex-col p-6 text-center justify-between min-h-[520px]">
            {/* Fanned Card Stack */}
            <div className="relative h-60 w-full flex items-center justify-center my-auto">
              {/* Left Angled Poster */}
              <div className="absolute w-32 h-44 rounded-2xl overflow-hidden shadow-2xl border border-white/10 transform -rotate-12 -translate-x-12 opacity-75">
                <img
                  src={posterPreviews[1] || posterPreviews[0]}
                  alt="Drama preview"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Right Angled Poster */}
              <div className="absolute w-32 h-44 rounded-2xl overflow-hidden shadow-2xl border border-white/10 transform rotate-12 translate-x-12 opacity-75">
                <img
                  src={posterPreviews[2] || posterPreviews[0]}
                  alt="Drama preview"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Center Main Poster */}
              <div className="relative z-10 w-36 h-48 rounded-2xl overflow-hidden shadow-2xl border-2 border-[#FF4500] transform hover:scale-105 transition-transform">
                <img
                  src={posterPreviews[0]}
                  alt="Drama preview"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2.5">
                  <span className="text-[10px] font-bold text-white bg-[#FF4500] px-2 py-0.5 rounded-full">
                    Exclusive
                  </span>
                </div>
              </div>
            </div>

            {/* Typography & CTA matching screenshot */}
            <div className="mt-4">
              <h2 className="text-lg font-extrabold text-white tracking-tight leading-tight font-['Bricolage_Grotesque']">
                Swipe up to explore short drama episodes
              </h2>
              <p className="text-xs text-slate-400 mt-2 px-2 leading-relaxed">
                Watch stories made for vertical viewing and earn or buy coins to unlock full episodes.
              </p>

              <button
                onClick={() => onClose()}
                className="w-full mt-6 py-3 rounded-full bg-gradient-to-r from-[#FF5500] to-[#E63900] text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#FF5500]/30 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <span>Start Watching</span>
                <span>→</span>
              </button>

              <div className="mt-4 flex items-center justify-center gap-3 text-xs">
                <button
                  onClick={() => setCurrentScreen('signin')}
                  className="text-slate-400 hover:text-white"
                >
                  Sign In
                </button>
                <span className="text-slate-600">·</span>
                <button
                  onClick={() => setCurrentScreen('signup')}
                  className="text-[#FF6520] font-semibold hover:underline"
                >
                  Create Account
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 3. Sign In Screen View (Matching screenshot row 1 screen 3) */}
        {currentScreen === 'signin' && (
          <div className="p-6 overflow-y-auto">
            <div className="text-center mb-6">
              <span className="text-xl font-extrabold text-white font-['Bricolage_Grotesque']">
                ShortFlix
              </span>
              <h2 className="text-lg font-bold text-white mt-3">Sign In</h2>
              <p className="text-xs text-slate-400 mt-0.5">Welcome back, you&apos;ve been missed</p>
            </div>

            <form onSubmit={handleSignIn} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="name@example.com"
                    className="w-full bg-[#1A1A28] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#FF4500]"
                  />
                  <Mail className="absolute right-3.5 top-3 w-4 h-4 text-slate-500" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-semibold text-slate-400">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => alert('Password reset link sent to ' + email)}
                    className="text-[10px] text-[#FF6520] hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-[#1A1A28] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#FF4500]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3.5 top-3 text-slate-500 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-[#FF5500] to-[#E63900] text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#FF5500]/30 hover:brightness-110 active:scale-95 transition-all"
              >
                Sign In
              </button>
            </form>

            {/* Social Logins */}
            <div className="mt-6 text-center">
              <span className="text-[11px] text-slate-500">Or Sign in with</span>
              <div className="flex items-center justify-center gap-3 mt-3">
                <button
                  onClick={() => {
                    onSuccess({ name: 'Google User', email: 'user@gmail.com' });
                    onClose();
                  }}
                  className="w-10 h-10 rounded-xl bg-[#1A1A28] border border-white/10 hover:border-white/20 flex items-center justify-center text-xs font-bold text-white transition-colors"
                >
                  G
                </button>
                <button
                  onClick={() => {
                    onSuccess({ name: 'Apple User', email: 'user@icloud.com' });
                    onClose();
                  }}
                  className="w-10 h-10 rounded-xl bg-[#1A1A28] border border-white/10 hover:border-white/20 flex items-center justify-center text-xs font-bold text-white transition-colors"
                >
                  
                </button>
              </div>

              <p className="text-xs text-slate-400 mt-6">
                Don&apos;t have an account?{' '}
                <button
                  onClick={() => setCurrentScreen('signup')}
                  className="text-[#FF6520] font-bold hover:underline"
                >
                  Sign Up
                </button>
              </p>
            </div>
          </div>
        )}

        {/* 4. Sign Up Screen View (Matching screenshot row 1 screen 4) */}
        {currentScreen === 'signup' && (
          <div className="p-6 overflow-y-auto">
            <div className="text-center mb-6">
              <span className="text-xl font-extrabold text-white font-['Bricolage_Grotesque']">
                ShortFlix
              </span>
              <h2 className="text-lg font-bold text-white mt-3">Sign Up</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Fill your information below & register your account
              </p>
            </div>

            <form onSubmit={handleSignUp} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Your Name"
                    className="w-full bg-[#1A1A28] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#FF4500]"
                  />
                  <User className="absolute right-3.5 top-3 w-4 h-4 text-slate-500" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="name@example.com"
                    className="w-full bg-[#1A1A28] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#FF4500]"
                  />
                  <Mail className="absolute right-3.5 top-3 w-4 h-4 text-slate-500" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-[#1A1A28] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#FF4500]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3.5 top-3 text-slate-500 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={agreedTerms}
                  onChange={(e) => setAgreedTerms(e.target.checked)}
                  className="rounded border-white/20 text-[#FF4500] focus:ring-[#FF4500]"
                />
                <span className="text-[11px] text-slate-400">
                  Agree with <span className="text-[#FF6520] underline">Terms & Conditions</span>
                </span>
              </label>

              <button
                type="submit"
                disabled={!agreedTerms}
                className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-[#FF5500] to-[#E63900] disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#FF5500]/30 hover:brightness-110 active:scale-95 transition-all"
              >
                Sign Up
              </button>
            </form>

            <p className="text-xs text-slate-400 text-center mt-6">
              Already have an account?{' '}
              <button
                onClick={() => setCurrentScreen('signin')}
                className="text-[#FF6520] font-bold hover:underline"
              >
                Sign In
              </button>
            </p>
          </div>
        )}

        {/* 5. Verify Code (OTP) Screen View (Matching screenshot row 1 screen 5) */}
        {currentScreen === 'verify' && (
          <div className="p-6 overflow-y-auto">
            <button
              onClick={() => setCurrentScreen('signup')}
              className="p-1.5 rounded-full bg-white/5 text-slate-400 hover:text-white mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <div className="text-center mb-6">
              <h2 className="text-lg font-bold text-white">Verify Code</h2>
              <p className="text-xs text-slate-400 mt-1 max-w-[240px] mx-auto">
                Please enter the code we just sent to email <br />
                <span className="text-white font-semibold">{email}</span>
              </p>
            </div>

            <form onSubmit={handleVerify} className="space-y-6">
              {/* 4 Digit OTP Inputs */}
              <div className="flex items-center justify-center gap-3">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`otp-${idx}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    className="w-12 h-14 rounded-2xl bg-[#1A1A28] border-2 border-white/10 text-center text-xl font-black text-white focus:outline-none focus:border-[#FF4500] focus:ring-2 focus:ring-[#FF4500]/20"
                  />
                ))}
              </div>

              <div className="text-center">
                <p className="text-xs text-slate-400">
                  Didn&apos;t receive OTP?{' '}
                  <button
                    type="button"
                    onClick={() => setTimer(45)}
                    className="text-[#FF6520] font-bold hover:underline"
                  >
                    Resend code
                  </button>
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FF5500] to-[#E63900] text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#FF5500]/30 hover:brightness-110 active:scale-95 transition-all"
              >
                Verify
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
