import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import './LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [notice, setNotice] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
    setNotice('');
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError('Email and password are required');
      return false;
    }

    if (!isLogin && !formData.name) {
      setError('Name is required for registration');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }

    if (!isLogin && formData.confirmPassword !== formData.password) {
      setError('Passwords do not match');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      let response;
      if (isLogin) {
        response = await authAPI.login({
          email: formData.email,
          password: formData.password,
        });

        // Store token and user info
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('user', JSON.stringify(response.data.user));

        // Redirect to dashboard
        navigate('/dashboard');
        return;
      }

      // Registration: create account, then send the user to the login page
      await authAPI.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      setIsLogin(true);
      setFormData({ name: '', email: formData.email, password: '', confirmPassword: '' });
      setNotice('Account created successfully. Please login to continue.');
    } catch (err) {
      setError(
        err.response?.data?.error || 
        err.response?.data?.message || 
        'Authentication failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setNotice('');
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
  };

  const handleForgotPassword = () => {
    setNotice(
      formData.email
        ? `If an account exists for ${formData.email}, a password reset link would be sent here.`
        : 'Enter your email above, then choose “Forgot Password?” to receive a reset link.'
    );
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
            <p>
              {isLogin
                ? 'Login to access your dashboard'
                : 'Register to start analyzing MRI images'}
            </p>
          </div>

          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          {notice && !error && (
            <div className="alert alert-info">
              {notice}
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            {!isLogin && (
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  disabled={loading}
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  disabled={loading}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M12 5C7 5 2.73 8.11 1 12.5C2.73 16.89 7 20 12 20C17 20 21.27 16.89 23 12.5C21.27 8.11 17 5 12 5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="12" cy="12.5" r="3" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M2 2L22 22M9.9 4.24C10.5 4.07 11.2 4 12 4C17 4 21.27 7.11 23 11.5C22.18 13.65 20.79 15.5 19 16.77M14.12 14.12C13.8 14.63 13.35 15.06 12.82 15.35C12.29 15.64 11.69 15.78 11.08 15.75C10.47 15.72 9.88 15.52 9.38 15.18C8.88 14.84 8.5 14.37 8.28 13.83C8.06 13.29 7.99 12.7 8.09 12.12C8.19 11.54 8.45 11 8.84 10.56M7 7C4.73 8.39 3 10.67 2 13.5C3.73 17.89 8 21 13 21C15.24 21 17.34 20.38 19.15 19.32" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </button>
              </div>
              {!isLogin && (
                <small className="form-hint">
                  Password must be at least 6 characters
                </small>
              )}
            </div>

            {!isLogin && (
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter your password"
                  disabled={loading}
                />
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary btn-block"
              disabled={loading}
            >
              {loading ? (
                <span className="loading-text">
                  <span className="spinner-small"></span>
                  {isLogin ? 'Logging in...' : 'Registering...'}
                </span>
              ) : (
                <span>{isLogin ? 'Login' : 'Register'}</span>
              )}
            </button>
          </form>

          {isLogin && (
            <div className="forgot-row">
              <button
                type="button"
                className="link-button"
                onClick={handleForgotPassword}
                disabled={loading}
              >
                Forgot Password?
              </button>
            </div>
          )}

          <div className="login-footer">
            <p>
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <button
                type="button"
                onClick={toggleMode}
                className="link-button"
                disabled={loading}
              >
                {isLogin ? 'Register here' : 'Login here'}
              </button>
            </p>
          </div>

          <div className="back-to-home">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="btn btn-secondary btn-sm"
              disabled={loading}
            >
              ← Back to Home
            </button>
          </div>
        </div>

        <div className="login-info">
          <div className="login-info-icon">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
              <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="3"/>
              <path d="M20 28C20 28 24 20 32 20C40 20 44 28 44 28" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
              <circle cx="26" cy="30" r="3" fill="currentColor"/>
              <circle cx="38" cy="30" r="3" fill="currentColor"/>
              <path d="M22 40C22 40 26 44 32 44C38 44 42 40 42 40" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
              <path d="M16 16L22 10M48 16L42 10M32 8V4" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
            </svg>
          </div>
          <h3>Brain Tumor Detection System</h3>
          <p>
            Advanced AI-powered MRI analysis using deep learning to detect and
            classify brain tumors with high accuracy.
          </p>
          <div className="info-features">
            <div className="info-feature">
              <span className="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              <span>Fast & Accurate Analysis</span>
            </div>
            <div className="info-feature">
              <span className="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <rect x="4" y="3" width="16" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <path d="M8 7H16M8 11H16M8 15H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </span>
              <span>Comprehensive Reports</span>
            </div>
            <div className="info-feature">
              <span className="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L4 7V13C4 18 8 21 12 22C16 21 20 18 20 13V7L12 2Z" stroke="currentColor" strokeWidth="2"/>
                  <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              <span>Secure & Private</span>
            </div>
            <div className="info-feature">
              <span className="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <path d="M9 9H15M9 12H15M9 15H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </span>
              <span>User-Friendly Interface</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
