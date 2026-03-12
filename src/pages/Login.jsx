import React, { useState, useEffect } from 'react';
import { authAPI } from '../api';
import { Eye, EyeOff, User, Lock, PhoneCall } from 'lucide-react';
import ForgotPassword from './Forgetpassword';


// Medical SVG illustration - headache/neurology themed, fills full panel
function MedicalIllustration() {
  return (
    <svg
      viewBox="0 0 500 700"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: '100%', display: 'block' }}
    >
      <defs>
        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1a2a4a" />
          <stop offset="100%" stopColor="#0d1b35" />
        </linearGradient>
        <radialGradient id="glowBlue" cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.32" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="glowPurple" cx="60%" cy="65%" r="50%">
          <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
        </radialGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="softglow">
          <feGaussianBlur stdDeviation="8" result="coloredBlur" />
          <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <linearGradient id="bottomFade" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0d1b35" stopOpacity="0" />
          <stop offset="100%" stopColor="#050f23" stopOpacity="0.92" />
        </linearGradient>
      </defs>

      {/* Full background */}
      <rect width="500" height="700" fill="url(#bgGrad)" />

      {/* Ambient glows */}
      <ellipse cx="200" cy="300" rx="260" ry="240" fill="url(#glowBlue)" />
      <ellipse cx="370" cy="480" rx="200" ry="180" fill="url(#glowPurple)" />

      {/* Grid lines */}
      {[...Array(16)].map((_, i) => (
        <line key={`h${i}`} x1="0" y1={i * 47} x2="500" y2={i * 47} stroke="#ffffff" strokeOpacity="0.04" strokeWidth="1" />
      ))}
      {[...Array(12)].map((_, i) => (
        <line key={`v${i}`} x1={i * 45} y1="0" x2={i * 45} y2="700" stroke="#ffffff" strokeOpacity="0.04" strokeWidth="1" />
      ))}

      {/* TOP DATA CHIPS */}
      <rect x="28" y="40" width="130" height="42" rx="10" fill="#0f2040" stroke="#3b82f6" strokeWidth="1.2" opacity="0.92" />
      <text x="44" y="58" fill="#60a5fa" fontSize="9.5" fontFamily="monospace" letterSpacing="1">NEURAL SCAN</text>
      <text x="44" y="73" fill="#34d399" fontSize="11" fontFamily="monospace" fontWeight="bold">● ACTIVE</text>

      <rect x="342" y="40" width="130" height="42" rx="10" fill="#0f2040" stroke="#8b5cf6" strokeWidth="1.2" opacity="0.92" />
      <text x="358" y="58" fill="#a78bfa" fontSize="9.5" fontFamily="monospace" letterSpacing="1">PAIN INDEX</text>
      <text x="358" y="73" fill="#f59e0b" fontSize="11" fontFamily="monospace" fontWeight="bold">7.4 / 10</text>

      {/* BRAIN */}
      <g filter="url(#softglow)" opacity="0.9">
        <path
          d="M170 360 Q145 335 142 302 Q139 268 162 252 Q178 240 196 246 Q204 220 224 212 Q248 204 264 221 Q280 204 302 208 Q324 212 332 233 Q354 228 370 246 Q388 266 382 298 Q396 318 390 344 Q384 372 360 384 Q357 412 334 423 Q312 434 290 420 Q274 434 254 432 Q234 434 216 419 Q194 428 174 415 Q154 402 153 380 Q144 373 144 362 Q144 356 170 360Z"
          fill="#1e3a6e"
          opacity="0.45"
        />
        <path
          d="M170 360 Q145 335 142 302 Q139 268 162 252 Q178 240 196 246 Q204 220 224 212 Q248 204 264 221 Q280 204 302 208 Q324 212 332 233 Q354 228 370 246 Q388 266 382 298 Q396 318 390 344 Q384 372 360 384 Q357 412 334 423 Q312 434 290 420 Q274 434 254 432 Q234 434 216 419 Q194 428 174 415 Q154 402 153 380 Q144 373 144 362 Q144 356 170 360Z"
          fill="none"
          stroke="#60a5fa"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path d="M196 246 Q206 272 202 300 Q198 324 210 342" stroke="#60a5fa" strokeWidth="1.5" fill="none" opacity="0.55" strokeLinecap="round" />
        <path d="M264 221 Q268 252 262 280 Q258 305 270 326" stroke="#60a5fa" strokeWidth="1.5" fill="none" opacity="0.55" strokeLinecap="round" />
        <path d="M332 233 Q330 262 324 290 Q318 316 330 338" stroke="#60a5fa" strokeWidth="1.5" fill="none" opacity="0.55" strokeLinecap="round" />
        <path d="M153 318 Q180 314 208 320 Q234 325 262 318 Q288 312 316 318 Q342 324 374 318" stroke="#60a5fa" strokeWidth="1.5" fill="none" opacity="0.45" strokeLinecap="round" />
        <path d="M158 358 Q185 354 213 360 Q239 365 267 358 Q293 352 321 358 Q347 364 379 358" stroke="#60a5fa" strokeWidth="1.5" fill="none" opacity="0.45" strokeLinecap="round" />
      </g>

      {/* PAIN LIGHTNING BOLTS */}
      <g filter="url(#glow)">
        <polyline points="112,250 100,275 115,279 96,308" stroke="#f59e0b" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.95" />
        <circle cx="103" cy="279" r="6" fill="#f59e0b" opacity="0.85" />
        <circle cx="103" cy="279" r="13" fill="#f59e0b" opacity="0.13" />

        <polyline points="248,175 238,198 252,201 234,228" stroke="#f59e0b" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.95" />
        <circle cx="244" cy="201" r="6" fill="#f59e0b" opacity="0.85" />
        <circle cx="244" cy="201" r="13" fill="#f59e0b" opacity="0.13" />

        <polyline points="398,255 410,280 395,284 414,313" stroke="#f59e0b" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.95" />
        <circle cx="402" cy="284" r="6" fill="#f59e0b" opacity="0.85" />
        <circle cx="402" cy="284" r="13" fill="#f59e0b" opacity="0.13" />
      </g>

      {/* EEG BRAINWAVE */}
      <g filter="url(#glow)">
        <path
          d="M20 520 L75 520 L92 498 L107 544 L120 484 L134 556 L148 512 L158 520 L215 520 L232 500 L248 542 L263 478 L278 548 L293 508 L303 520 L360 520 L377 498 L393 542 L408 482 L423 550 L438 510 L448 520 L490 520"
          stroke="#34d399" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round"
        />
        <path
          d="M20 520 L75 520 L92 498 L107 544 L120 484 L134 556 L148 512 L158 520 L215 520 L232 500 L248 542 L263 478 L278 548 L293 508 L303 520 L360 520 L377 498 L393 542 L408 482 L423 550 L438 510 L448 520 L490 520"
          stroke="#34d399" strokeWidth="8" fill="none" opacity="0.1" strokeLinecap="round" strokeLinejoin="round"
        />
        <text x="24" y="510" fill="#34d399" fontSize="10" fontFamily="monospace" opacity="0.65" letterSpacing="1">EEG</text>
      </g>

      {/* NEURAL NODES */}
      <g opacity="0.6">
        <circle cx="100" cy="455" r="5" fill="#8b5cf6" filter="url(#glow)" />
        <circle cx="148" cy="488" r="3.5" fill="#8b5cf6" />
        <circle cx="68" cy="476" r="3.5" fill="#8b5cf6" />
        <line x1="100" y1="455" x2="148" y2="488" stroke="#8b5cf6" strokeWidth="1.2" opacity="0.5" />
        <line x1="100" y1="455" x2="68" y2="476" stroke="#8b5cf6" strokeWidth="1.2" opacity="0.5" />
        <circle cx="415" cy="165" r="5" fill="#8b5cf6" filter="url(#glow)" />
        <circle cx="455" cy="192" r="3.5" fill="#8b5cf6" />
        <circle cx="438" cy="148" r="3.5" fill="#8b5cf6" />
        <line x1="415" y1="165" x2="455" y2="192" stroke="#8b5cf6" strokeWidth="1.2" opacity="0.5" />
        <line x1="415" y1="165" x2="438" y2="148" stroke="#8b5cf6" strokeWidth="1.2" opacity="0.5" />
      </g>

      {/* BOTTOM DATA CHIP */}
      <rect x="170" y="600" width="160" height="42" rx="10" fill="#0f2040" stroke="#34d399" strokeWidth="1.2" opacity="0.9" />
      <text x="198" y="618" fill="#6ee7b7" fontSize="9.5" fontFamily="monospace" letterSpacing="1">HR / BPM</text>
      <text x="188" y="633" fill="#34d399" fontSize="11" fontFamily="monospace" fontWeight="bold">72 ♥  NORMAL</text>

      <text x="250" y="682" fill="#60a5fa" fontSize="10" fontFamily="monospace" textAnchor="middle" opacity="0.4" letterSpacing="5">NEUROLOGY · DIAGNOSTICS</text>

      {/* Bottom fade overlay */}
      <rect x="0" y="540" width="500" height="160" fill="url(#bottomFade)" />
    </svg>
  );
}


export default function Login({ onLoginSuccess, onBack }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  // Track screen width for responsive layout
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await authAPI.userLogin(email, password);
      const { token, user } = response.data;
      localStorage.setItem("role", user.role);
      onLoginSuccess(token, user);
    } catch (err) {
      try {
        const response = await authAPI.adminLogin(email, password);
        const { token, user } = response.data;
        localStorage.setItem("role", user.role);
        onLoginSuccess(token, user);
      } catch (adminErr) {
        setError('The username or password is incorrect');
      }
    } finally {
      setLoading(false);
    }
  };

  const inputBase = {
    width: '100%',
    boxSizing: 'border-box',
    padding: '13px 16px 13px 44px',
    border: '1.5px solid #e2e8f0',
    borderRadius: '10px',
    fontSize: '14.5px',
    color: '#1e293b',
    background: '#f8fafc',
    outline: 'none',
    fontFamily: 'inherit',
    transition: 'border-color 0.2s, box-shadow 0.2s, background 0.2s',
  };

  if (showForgotPassword) {
    return <ForgotPassword onBack={() => setShowForgotPassword(false)} />;
  }

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      overflow: isMobile ? 'auto' : 'hidden',
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      margin: 0,
      padding: 0,
      position: isMobile ? 'relative' : 'fixed',
      top: 0,
      left: 0,
    }}>

      {/* LEFT PANEL — desktop only, fully hidden on mobile */}
      {!isMobile && (
        <div style={{
          flex: '0 0 52%',
          position: 'relative',
          overflow: 'hidden',
          height: '100vh',
        }}>
          <MedicalIllustration />
          <div style={{
            position: 'absolute',
            bottom: 0, left: 0, right: 0,
            padding: '44px 48px',
            background: 'linear-gradient(to top, rgba(5,15,35,0.97) 0%, rgba(5,15,35,0.55) 65%, transparent 100%)',
            zIndex: 2,
          }}>
            <h2 style={{
              margin: '0 0 10px',
              fontSize: '32px',
              fontWeight: '800',
              color: '#ffffff',
              lineHeight: 1.2,
              letterSpacing: '-0.4px',
            }}>
              Refining Your<br />
              <span style={{ color: '#60a5fa' }}>Neural Health</span>
            </h2>
            <p style={{
              margin: 0,
              fontSize: '14px',
              color: 'rgba(200,220,255,0.65)',
              lineHeight: 1.7,
            }}>
              Access your personalized headache treatment plan<br />
              and diagnostics in a secure, clinical environment.
            </p>
          </div>
        </div>
      )}

      {/* RIGHT PANEL */}
      <div style={{
        flex: 1,
        background: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: isMobile ? '40px 24px' : '48px',
        position: 'relative',
        minHeight: isMobile ? '100vh' : '100vh',
        overflowY: 'auto',
        boxSizing: 'border-box',
      }}>

        {/* Deco glows */}
        <div style={{
          position: 'absolute', top: 0, right: 0,
          width: '240px', height: '240px',
          background: 'radial-gradient(circle at 100% 0%, #dbeafe 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: 0, left: 0,
          width: '200px', height: '200px',
          background: 'radial-gradient(circle at 0% 100%, #ede9fe 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '400px' }}>

          {/* Heading */}
          <div style={{ marginBottom: isMobile ? '24px' : '36px' }}>
            <h1 style={{
              margin: '0 0 6px',
              fontSize: isMobile ? '26px' : '32px',
              fontWeight: '800',
              color: '#0f172a',
              letterSpacing: '-0.6px',
            }}>
              Welcome Back
            </h1>
            <p style={{ margin: 0, fontSize: '14.5px', color: '#64748b' }}>
              Please sign in to access your secure portal.
            </p>
          </div>

          {/* Email */}
          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
              Email
            </label>
            <div style={{ position: 'relative' }}>
              <User size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' }} />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(e); }}
                placeholder="Enter your ID or email"
                style={inputBase}
                onFocus={e => { e.target.style.borderColor = '#3b82f6'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.12)'; e.target.style.background = '#fff'; }}
                onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; e.target.style.background = '#f8fafc'; }}
              />
            </div>
          </div>

          {/* Password */}
          <div style={{ marginBottom: '10px' }}>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Password
            </label>

            <div style={{ position: 'relative' }}>
              <Lock
                size={16}
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#94a3b8',
                  pointerEvents: 'none'
                }}
              />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(e); }}
                placeholder="Enter your password"
                style={{
                  ...inputBase,
                  paddingRight: '44px',
                  borderColor: error ? '#ef4444' : '#e2e8f0'
                }}
                onFocus={e => {
                  e.target.style.borderColor = error ? '#ef4444' : '#3b82f6';
                  e.target.style.boxShadow = error
                    ? '0 0 0 3px rgba(239,68,68,0.1)'
                    : '0 0 0 3px rgba(59,130,246,0.12)';
                  e.target.style.background = '#fff';
                }}
                onBlur={e => {
                  e.target.style.borderColor = error ? '#ef4444' : '#e2e8f0';
                  e.target.style.boxShadow = 'none';
                  e.target.style.background = '#f8fafc';
                }}
              />
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setShowPassword(prev => !prev);
                }}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: showPassword ? '#2563eb' : '#94a3b8',
                  transition: 'color 0.2s ease'
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Forgot Password */}
          <div style={{ textAlign: 'right', marginBottom: error ? '6px' : '28px' }}>
            <span
              onClick={() => setShowForgotPassword(true)}
              style={{
                fontSize: '13px',
                color: '#3b82f6',
                cursor: 'pointer',
                fontWeight: '500'
              }}
              onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
              onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
            >
              Forgot password?
            </span>
          </div>

          {error && <p style={{ color: '#ef4444', fontSize: '13px', margin: '0 0 18px' }}>{error}</p>}

          {/* Sign In */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width: '100%',
              padding: isMobile ? '14px' : '15px',
              background: loading ? '#93c5fd' : '#2563eb',
              color: 'white', border: 'none', borderRadius: '10px',
              fontSize: isMobile ? '15px' : '15.5px', fontWeight: '700',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 18px rgba(37,99,235,0.35)',
              transition: 'transform 0.15s, box-shadow 0.15s, background 0.15s',
              marginBottom: '14px', fontFamily: 'inherit',
            }}
            onMouseEnter={e => { if (!loading) { e.currentTarget.style.background = '#1d4ed8'; e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 26px rgba(37,99,235,0.42)'; } }}
            onMouseLeave={e => { e.currentTarget.style.background = loading ? '#93c5fd' : '#2563eb'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 18px rgba(37,99,235,0.35)'; }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <p style={{ margin: 0, textAlign: 'center', fontSize: '12.5px', color: '#94a3b8', lineHeight: 1.8 }}>
            By signing in, you agree to our{' '}
            <span style={{ color: '#3b82f6', cursor: 'pointer' }}>Terms of Service</span>{' '}
            and{' '}
            <span style={{ color: '#3b82f6', cursor: 'pointer' }}>Privacy Policy</span>.
          </p>

          {onBack && (
            <button
              onClick={onBack}
              style={{
                width: '100%', marginTop: '14px', padding: '12px', background: 'transparent', color: '#94a3b8',
                border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', fontWeight: '600',
                cursor: 'pointer', transition: 'all 0.18s', fontFamily: 'inherit',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = '#475569'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#94a3b8'; }}
            >
              ← Back
            </button>
          )}
        </div>
      </div>
    </div>
  );
}