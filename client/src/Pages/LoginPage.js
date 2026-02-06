import axios from 'axios';
import { useState } from 'react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async(e) => {
    e.preventDefault();
    try{

      await axios.post("http:localhost:5000/api/user/login",{
        email,password
      });
      alert("login successfully..");
    }
    catch(err){
      alert("login failed");
      console.log("login error ",err);
    }



  };

  return (
    <div className="auth-container">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

        :root {
          --bg-deep: #0B0F19;
          --bg-surface: #151B2B;
          --bg-elevated: #1E2738;
          --accent-cyan: #00F0FF;
          --accent-magenta: #FF0080;
          --accent-violet: #8B5CF6;
          --text-primary: #F8FAFC;
          --text-secondary: #94A3B8;
          --text-tertiary: #64748B;
          --border-subtle: rgba(148, 163, 184, 0.1);
          --glow-cyan: rgba(0, 240, 255, 0.2);
          --glow-magenta: rgba(255, 0, 128, 0.15);
        }

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Outfit', sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        .auth-container {
          min-height: 100vh;
          background: var(--bg-deep);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          position: relative;
          overflow: hidden;
        }

        /* Animated Background Elements */
        .auth-container::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: 
            radial-gradient(circle at 20% 30%, var(--glow-cyan) 0%, transparent 40%),
            radial-gradient(circle at 80% 70%, var(--glow-magenta) 0%, transparent 40%),
            radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.1) 0%, transparent 50%);
          animation: backgroundShift 20s ease-in-out infinite;
          pointer-events: none;
        }

        @keyframes backgroundShift {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg);
          }
          33% {
            transform: translate(5%, -5%) rotate(5deg);
          }
          66% {
            transform: translate(-5%, 5%) rotate(-5deg);
          }
        }

        /* Grid Overlay */
        .auth-container::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: 
            linear-gradient(var(--border-subtle) 1px, transparent 1px),
            linear-gradient(90deg, var(--border-subtle) 1px, transparent 1px);
          background-size: 50px 50px;
          opacity: 0.3;
          pointer-events: none;
        }

        .auth-card {
          position: relative;
          width: 100%;
          max-width: 440px;
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          border-radius: 24px;
          padding: 48px 40px;
          box-shadow: 
            0 20px 60px rgba(0, 0, 0, 0.5),
            0 0 0 1px rgba(255, 255, 255, 0.02),
            inset 0 1px 0 rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(20px);
          animation: cardEntrance 0.6s cubic-bezier(0.16, 1, 0.3, 1);
          z-index: 1;
        }

        @keyframes cardEntrance {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        /* Glow Effect */
        .auth-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            var(--accent-cyan),
            var(--accent-magenta),
            transparent
          );
          opacity: 0.5;
        }

        .auth-header {
          text-align: center;
          margin-bottom: 40px;
          animation: fadeInDown 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both;
        }

        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .logo {
          width: 56px;
          height: 56px;
          margin: 0 auto 24px;
          background: linear-gradient(135deg, var(--accent-cyan), var(--accent-magenta));
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'JetBrains Mono', monospace;
          font-weight: 500;
          font-size: 24px;
          color: var(--bg-deep);
          box-shadow: 
            0 8px 24px var(--glow-cyan),
            0 0 0 1px rgba(255, 255, 255, 0.1);
          animation: logoFloat 3s ease-in-out infinite;
        }

        @keyframes logoFloat {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        .auth-title {
          font-size: 32px;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 8px;
          letter-spacing: -0.02em;
        }

        .auth-subtitle {
          font-size: 15px;
          color: var(--text-secondary);
          font-weight: 400;
        }

        .auth-form {
          animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .form-group {
          margin-bottom: 24px;
        }

        .form-label {
          display: block;
          font-size: 14px;
          font-weight: 500;
          color: var(--text-secondary);
          margin-bottom: 8px;
          letter-spacing: 0.01em;
        }

        .input-wrapper {
          position: relative;
        }

        .form-input {
          width: 100%;
          height: 52px;
          padding: 0 16px;
          background: var(--bg-elevated);
          border: 1px solid var(--border-subtle);
          border-radius: 12px;
          color: var(--text-primary);
          font-size: 15px;
          font-family: 'Outfit', sans-serif;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          outline: none;
        }

        .form-input:focus {
          border-color: var(--accent-cyan);
          background: var(--bg-surface);
          box-shadow: 
            0 0 0 3px rgba(0, 240, 255, 0.1),
            0 8px 16px rgba(0, 0, 0, 0.2);
          transform: translateY(-1px);
        }

        .form-input::placeholder {
          color: var(--text-tertiary);
        }

        .password-input {
          padding-right: 48px;
        }

        .password-toggle {
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: var(--text-tertiary);
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.2s;
        }

        .password-toggle:hover {
          color: var(--accent-cyan);
        }

        .forgot-password {
          text-align: right;
          margin-top: 8px;
        }

        .forgot-link {
          font-size: 14px;
          color: var(--accent-cyan);
          text-decoration: none;
          font-weight: 500;
          transition: all 0.2s;
          display: inline-block;
        }

        .forgot-link:hover {
          color: var(--accent-magenta);
          transform: translateX(2px);
        }

        .submit-btn {
          width: 100%;
          height: 52px;
          margin-top: 32px;
          background: linear-gradient(135deg, var(--accent-cyan), var(--accent-magenta));
          border: none;
          border-radius: 12px;
          color: var(--bg-deep);
          font-size: 16px;
          font-weight: 600;
          font-family: 'Outfit', sans-serif;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          box-shadow: 0 4px 16px var(--glow-cyan);
        }

        .submit-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.3),
            transparent
          );
          transition: left 0.5s;
        }

        .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px var(--glow-cyan);
        }

        .submit-btn:hover::before {
          left: 100%;
        }

        .submit-btn:active {
          transform: translateY(0);
        }

        .divider {
          margin: 32px 0;
          text-align: center;
          position: relative;
        }

        .divider::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 1px;
          background: var(--border-subtle);
        }

        .divider-text {
          position: relative;
          display: inline-block;
          padding: 0 16px;
          background: var(--bg-surface);
          color: var(--text-tertiary);
          font-size: 13px;
          font-weight: 500;
        }

        .auth-footer {
          text-align: center;
          animation: fadeIn 1s cubic-bezier(0.16, 1, 0.3, 1) 0.5s both;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .auth-footer-text {
          color: var(--text-secondary);
          font-size: 14px;
        }

        .auth-link {
          color: var(--accent-cyan);
          text-decoration: none;
          font-weight: 600;
          margin-left: 4px;
          transition: all 0.2s;
          display: inline-block;
        }

        .auth-link:hover {
          color: var(--accent-magenta);
          transform: translateX(2px);
        }

        /* Responsive */
        @media (max-width: 480px) {
          .auth-card {
            padding: 36px 24px;
          }

          .auth-title {
            font-size: 28px;
          }

          .logo {
            width: 48px;
            height: 48px;
            font-size: 20px;
          }
        }
      `}</style>

      <div className="auth-card">
        <div className="auth-header">
          <div className="logo">D</div>
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Sign in to access your dashboard</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              className="form-input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <div className="input-wrapper">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className="form-input password-input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
            <div className="forgot-password">
              <a href="#" className="forgot-link">
                Forgot password?
              </a>
            </div>
          </div>

          <button type="submit" className="submit-btn">
            Sign In
          </button>
        </form>

        <div className="divider">
          <span className="divider-text">OR</span>
        </div>

        <div className="auth-footer">
          <p className="auth-footer-text">
            Don't have an account?
            <a href="/signup" className="auth-link">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}