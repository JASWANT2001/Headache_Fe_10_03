import React, { useState, useEffect } from 'react';
import { authAPI } from '../api';
import { Eye, EyeOff, User, Lock, PhoneCall } from 'lucide-react';
import ForgotPassword from './Forgetpassword';


// Medical SVG illustration - headache/neurology themed, fills full panel
function MedicalIllustration() {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        background: "#0f172a"
      }}
    >

      {/* Background Image */}
      <img
        src="https://res.cloudinary.com/dfibmva2e/image/upload/v1773455193/hero-bg_qqgoge.jpg"
        // src="https://images.stockcake.com/public/1/9/d/19d13828-c999-4e2d-a191-9da4dd8bd824_large/confident-medical-professional-stockcake.jpg"
        alt="doctor consultation"
        style={{
          width: "100%",
          height: "95%",
          objectFit: "cover",
          filter: "brightness(0.45)"
        }}
      />

      {/* Gradient overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(2,6,23,0.2) 0%, rgba(2,6,23,0.7) 65%, rgba(2,6,23,0.95) 100%)"
        }}
      />

      {/* Floating particles */}
      {/* {[...Array(20)].map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: "4px",
            height: "4px",
            background: "#60a5fa",
            borderRadius: "50%",
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            opacity: 0.5,
            animation: `float ${5 + Math.random() * 5}s infinite ease-in-out`
          }}
        />
      ))} */}

      {/* Bottom Text */}
      <div
        style={{
          position: "absolute",
          bottom: "40px",
          left: "40px",
          right: "40px",
          color: "white"
        }}
      >
        <h2
          style={{
            fontSize: "32px",
            fontWeight: "800",
            marginBottom: "10px"
          }}
        >
          {/* Intelligent */}
          <br />
          <span style={{ color: "#60a5fa" }}>
            Headache Diagnostics
          </span>
        </h2>

        <p
          style={{
            fontSize: "14px",
            color: "rgba(220,230,255,0.75)",
            lineHeight: 1.6
          }}
        >
          Secure clinical platform designed to help
          neurologists analyze headache patterns
          and deliver personalized treatments.
        </p>
      </div>

      {/* Animation keyframes */}
      <style>
        {`
        @keyframes float {
          0% { transform: translateY(0px); opacity:0.4; }
          50% { transform: translateY(-12px); opacity:0.9; }
          100% { transform: translateY(0px); opacity:0.4; }
        }
        `}
      </style>
    </div>
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
            {/* <h2 style={{
              margin: '0 0 10px',
              fontSize: '32px',
              fontWeight: '800',
              color: '#ffffff',
              lineHeight: 1.2,
              letterSpacing: '-0.4px',
            }}>
              Refining Your<br />
              <span style={{ color: '#60a5fa' }}>Neural Health</span>
            </h2> */}
            {/* <p style={{
              margin: 0,
              fontSize: '14px',
              color: 'rgba(200,220,255,0.65)',
              lineHeight: 1.7,
            }}>
              Access your personalized headache treatment plan<br />
              and diagnostics in a secure, clinical environment.
            </p> */}
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

          {/* <p style={{ margin: 0, textAlign: 'center', fontSize: '12.5px', color: '#94a3b8', lineHeight: 1.8 }}>
            By signing in, you agree to our{' '}
            <span style={{ color: '#3b82f6', cursor: 'pointer' }}>Terms of Service</span>{' '}
            and{' '}
            <span style={{ color: '#3b82f6', cursor: 'pointer' }}>Privacy Policy</span>.
          </p> */}

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