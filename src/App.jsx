import { HashRouter, Routes, Route } from 'react-router-dom';
import IdeaGenerator from './Components/IdeaGenerator.jsx';
import HomePage from './HomePage.jsx';
import AboutPage from './AboutPage.jsx';
import ProjectShowcase from './ProjectShowcase.jsx';
import Support from './Support.jsx';
import Loader from './Components/Loader.jsx';
import { SubscriptionProvider } from './Context/SubscriptionContext.jsx';
import { useState, useEffect } from 'react';

// Use Laravel backend - IMPORTANT: Use full URL with port 8000
const API_BASE = '/api';

function App() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Check if user is logged in on app start AND listen for changes
  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        const savedUser = localStorage.getItem('ideastone_user_data_v3');
        console.log('🔍 Checking auth status, savedUser:', savedUser);
        
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          setUser(userData);
          console.log('👤 User loaded from storage:', userData.email);
        } else {
          setUser(null);
          console.log('👤 No user found in storage');
        }
      } catch (error) {
        console.warn('Auth check failed:', error);
        setUser(null);
      } finally {
        setAuthLoading(false);
      }
    };

    // Check immediately
    checkAuthStatus();

    // Listen for storage changes (from Login component)
    const handleStorageChange = (e) => {
      if (e.key === 'ideastone_user_data_v3') {
        console.log('🔄 Storage changed, checking auth status...');
        checkAuthStatus();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    const handlePaymentCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const transactionId = urlParams.get('transaction_id');
      const status = urlParams.get('status');
      
      if (transactionId && status) {
        try {
          console.log('🔄 Processing payment callback:', { transactionId, status });
          
          if (status === 'success') {
            // Verify payment with backend
            const verifyResponse = await fetch(`${API_BASE}/payments/gcash/verify/${transactionId}`);
            const verifyData = await verifyResponse.json();
            
            if (verifyData.success) {
              alert('🎉 Payment successful! Your subscription has been activated.');
              // You might want to refresh user data or subscription status here
            } else {
              alert('Payment verification failed. Please contact support.');
            }
          } else if (status === 'cancelled') {
            alert('Payment was cancelled.');
          }
          
          // Clean up URL - remove the callback parameters
          const cleanUrl = window.location.pathname;
          window.history.replaceState({}, document.title, cleanUrl);
          
        } catch (error) {
          console.error('Payment callback error:', error);
          alert('Error processing payment callback. Please check your subscription status.');
        }
      }
    };

    handlePaymentCallback();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      setAuthLoading(true);
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();
      
      if (data.success) {
        setUser(data.user);
        localStorage.setItem('ideastone_user_data_v3', JSON.stringify(data.user));
        console.log('✅ Login successful:', data.user.email);
        return { success: true, user: data.user };
      } else {
        return { success: false, error: data.error || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Network error during login. Make sure Laravel is running on port 8000.' };
    } finally {
      setAuthLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('ideastone_user_data_v3');
    console.log('👋 User logged out');
  };

  // Create demo user (for testing)
  const createDemoUser = async () => {
    try {
      setAuthLoading(true);
      console.log('🚀 Creating demo user via Laravel...');
      
      const response = await fetch(`${API_BASE}/auth/demo-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Laravel response error:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setUser(data.user);
        localStorage.setItem('ideastone_user_data_v3', JSON.stringify(data.user));
        console.log('🎭 Demo user created:', data.user.email);
        return { success: true, user: data.user };
      } else {
        return { success: false, error: data.error || 'Failed to create demo user' };
      }
    } catch (error) {
      console.error('Demo user creation error:', error);
      return { success: false, error: 'Make sure Laravel server is running on port 8000. Run: php artisan serve' };
    } finally {
      setAuthLoading(false);
    }
  };

  // Manual login success handler (for Login component)
  const handleLoginSuccess = (userData) => {
    console.log('✅ Login successful via callback:', userData);
    setUser(userData);
  };

  // Initial loading timer
  useEffect(() => {
    const timer = setTimeout(() => { 
      setLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loader/>;
  }

  // Create auth context value
  const authContextValue = {
    user,
    login,
    logout,
    createDemoUser,
    onLoginSuccess: handleLoginSuccess,
    isLoading: authLoading,
    isAuthenticated: !!user
  };

  return (
    <>
      <SubscriptionProvider user={user}>
        <HashRouter>
          <Routes>
            <Route path="/" element={<HomePage auth={authContextValue} />} />
            <Route path="/Generator" element={<IdeaGenerator auth={authContextValue} />} />
            <Route path="/About" element={<AboutPage auth={authContextValue} />} />
            <Route path="/showcase" element={<ProjectShowcase auth={authContextValue} />} />
            <Route path="/support" element={<Support auth={authContextValue} />} />
          </Routes>
        </HashRouter>
      </SubscriptionProvider>
    </>
  );
}

export default App;