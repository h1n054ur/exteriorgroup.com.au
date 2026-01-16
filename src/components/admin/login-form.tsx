/**
 * Admin Login Form Component
 * 
 * Standalone login page for admin authentication.
 * Features rate limiting feedback and HTMX form submission.
 */

import type { FC } from 'hono/jsx';

interface LoginFormProps {
  error?: string;
  locked?: boolean;
  lockoutMinutes?: number;
}

/** Login Page Layout */
export const LoginPage: FC<LoginFormProps> = ({ error, locked, lockoutMinutes }) => (
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="robots" content="noindex, nofollow" />
      <title>Admin Login | Exterior Group</title>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <style>{`
        *, *::before, *::after {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          background: linear-gradient(135deg, #111827 0%, #1f2937 100%);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
        }
        .login-container {
          width: 100%;
          max-width: 400px;
        }
        .login-card {
          background: #1f2937;
          border: 1px solid #374151;
          border-radius: 1rem;
          padding: 2rem;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }
        .login-logo {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          margin-bottom: 2rem;
        }
        .login-logo-icon {
          width: 3rem;
          height: 3rem;
          background: #f59e0b;
          border-radius: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1.25rem;
          color: #1f2937;
        }
        .login-logo-text {
          color: #f9fafb;
        }
        .login-logo-text h1 {
          font-size: 1.25rem;
          font-weight: 600;
        }
        .login-logo-text span {
          font-size: 0.75rem;
          color: #9ca3af;
        }
        .form-group {
          margin-bottom: 1.25rem;
        }
        .form-label {
          display: block;
          font-size: 0.875rem;
          font-weight: 500;
          color: #d1d5db;
          margin-bottom: 0.5rem;
        }
        .form-input {
          width: 100%;
          padding: 0.875rem 1rem;
          background: #374151;
          border: 1px solid #4b5563;
          border-radius: 0.5rem;
          color: #f9fafb;
          font-size: 1rem;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .form-input:focus {
          outline: none;
          border-color: #f59e0b;
          box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
        }
        .form-input::placeholder {
          color: #6b7280;
        }
        .btn-login {
          width: 100%;
          padding: 0.875rem 1rem;
          background: #f59e0b;
          color: #1f2937;
          font-weight: 600;
          font-size: 1rem;
          border: none;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: background 0.2s, transform 0.1s;
        }
        .btn-login:hover {
          background: #d97706;
        }
        .btn-login:active {
          transform: scale(0.98);
        }
        .btn-login:disabled {
          background: #4b5563;
          cursor: not-allowed;
        }
        .error-message {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid #ef4444;
          color: #fca5a5;
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          margin-bottom: 1.25rem;
        }
        .lockout-message {
          background: rgba(245, 158, 11, 0.1);
          border: 1px solid #f59e0b;
          color: #fcd34d;
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          margin-bottom: 1.25rem;
          text-align: center;
        }
        .back-link {
          display: block;
          text-align: center;
          margin-top: 1.5rem;
          color: #9ca3af;
          text-decoration: none;
          font-size: 0.875rem;
        }
        .back-link:hover {
          color: #d1d5db;
        }
        .htmx-request .btn-login {
          background: #4b5563;
          pointer-events: none;
        }
        .htmx-request .btn-login::after {
          content: '...';
        }
      `}</style>
    </head>
    <body>
      <div class="login-container">
        <div class="login-card">
          {/* Logo */}
          <div class="login-logo">
            <div class="login-logo-icon">EG</div>
            <div class="login-logo-text">
              <h1>Exterior Group</h1>
              <span>Admin Portal</span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div class="error-message">
              {error}
            </div>
          )}

          {/* Lockout Message */}
          {locked && (
            <div class="lockout-message">
              Too many failed attempts. Please try again in {lockoutMinutes || 15} minutes.
            </div>
          )}

          {/* Login Form */}
          <form method="post" action="/admin/login">
            <div class="form-group">
              <label class="form-label" for="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                class="form-input"
                placeholder="admin"
                required
                autocomplete="username"
                disabled={locked}
              />
            </div>

            <div class="form-group">
              <label class="form-label" for="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                class="form-input"
                placeholder="••••••••"
                required
                autocomplete="current-password"
                disabled={locked}
              />
            </div>

            <button type="submit" class="btn-login" disabled={locked}>
              {locked ? 'Account Locked' : 'Sign In'}
            </button>
          </form>

          <a href="/" class="back-link">
            ← Back to website
          </a>
        </div>
      </div>
    </body>
  </html>
);

/** Login Error Fragment (for HTMX) */
export const LoginError: FC<{ message: string }> = ({ message }) => (
  <div class="error-message">
    {message}
  </div>
);

export default LoginPage;
