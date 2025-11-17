import { motion } from 'framer-motion';
import { useState } from 'react';
import '../Style/Login.css';

const Login = ({ isOpen, onClose, onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  try {
    const endpoint = isLogin ? '/auth/login' : '/auth/register';
    const url = `http://localhost:8000/api${endpoint}`;
    
    console.log('🔄 Making request to:', url);
    console.log('📦 Request data:', {
      email: formData.email,
      password: formData.password,
      ...(isLogin ? {} : { name: formData.name })
    });

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password,
        ...(isLogin ? {} : { name: formData.name })
      })
    });

    console.log('📡 Response status:', response.status);
    console.log('📡 Response ok:', response.ok);

    // Check if response is OK before parsing JSON
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Response error text:', errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Response data:', data);

    if (data.success) {
      console.log('🎉 Login/Register successful');
      // Store user data and token - use the same key as your App.js
      localStorage.setItem('ideastone_user_data_v3', JSON.stringify(data.user));
      localStorage.setItem('ideastone_token', data.token);
      
      onLoginSuccess(data.user);
      onClose();
    } else {
      setError(data.error || 'Authentication failed');
    }
  } catch (error) {
    console.error('❌ Login error:', error);
    setError(error.message || 'Network error. Please try again.');
  } finally {
    setLoading(false);
  }
};

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleDemoLogin = () => {
  const demoUser = {
    id: 'demo_user_' + Date.now(),
    email: 'demo@ideastone.com',
    name: 'Demo User',
    isDemo: true
  };
  
  localStorage.setItem('ideastone_user_data_v3', JSON.stringify(demoUser));
  localStorage.setItem('ideastone_token', 'demo_token');
  
  onLoginSuccess(demoUser);
  onClose();
};

  if (!isOpen) return null;

  return (
    <motion.div
      className="login-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="login-modal"
        initial={{ scale: 0.8, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 50 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Background Elements */}
        <div className="login-background-elements">
          <div className="login-orb login-orb-1"></div>
          <div className="login-orb login-orb-2"></div>
          <div className="login-orb login-orb-3"></div>
        </div>

        <div className="login-header">
          <div className="login-logo">
            <i className="bi bi-strava"></i>
            <span>IdeaStone</span>
          </div>
          <h2>{isLogin ? 'Welcome Back' : 'Join IdeaStone'}</h2>
          <p className="login-subtitle">
            {isLogin ? 'Sign in to continue your capstone journey' : 'Create your account to get started'}
          </p>
          <button className="close-btn" onClick={onClose}>
            <i className="bi bi-x"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <motion.div 
              className="error-message"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <i className="bi bi-exclamation-triangle"></i>
              {error}
            </motion.div>
          )}

          {!isLogin && (
            <motion.div
              className="form-group"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="input-wrapper">
                <i className="bi bi-person input-icon"></i>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Full Name"
                  className="login-input"
                />
              </div>
            </motion.div>
          )}
          
          <motion.div
            className="form-group"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="input-wrapper">
              <i className="bi bi-envelope input-icon"></i>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Email Address"
                className="login-input"
              />
            </div>
          </motion.div>

          <motion.div
            className="form-group"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="input-wrapper">
              <i className="bi bi-lock input-icon"></i>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Must be 6 characters or more"
                className="login-input"
                minLength="6"
              />
            </div>
          </motion.div>

          <motion.button 
            type="submit" 
            className="login-submit-btn" 
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
          >
            {loading ? (
              <>
                <div className="spinner"></div>
                <span>Please wait...</span>
              </>
            ) : (
              <>
                <i className={`bi ${isLogin ? 'bi-box-arrow-in-right' : 'bi-person-plus'}`}></i>
                <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
              </>
            )}
          </motion.button>
        </form>

        <div className="login-divider">
          <span>or</span>
        </div>

        <motion.button 
          type="button" 
          className="demo-login-btn"
          onClick={handleDemoLogin}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <i className="bi bi-robot"></i>
          <span>Try Demo Mode</span>
        </motion.button>

        <div className="login-switch">
          <p>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              type="button" 
              className="switch-mode-btn"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Login;