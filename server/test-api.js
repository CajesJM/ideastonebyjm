// Simple test script to verify API is working
import fetch from 'node-fetch';

const API_BASE = 'http://localhost:3001/api';

async function testAPI() {
  try {
    // Test health endpoint
    const health = await fetch(`${API_BASE}/health`);
    const healthData = await health.json();
    console.log('🏥 Health Check:', healthData);

    // Test demo user creation
    const user = await fetch(`${API_BASE}/auth/demo-user`, { method: 'POST' });
    const userData = await user.json();
    console.log('👤 Demo User:', userData);

    if (userData.success) {
      // Test free plan activation
      const subscription = await fetch(`${API_BASE}/subscriptions/free`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userData.user.id,
          planType: 'free'
        })
      });
      const subData = await subscription.json();
      console.log('🎁 Free Plan:', subData);

      // Test GCash payment
      const payment = await fetch(`${API_BASE}/payments/gcash/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: 99,
          plan: 'starter',
          userId: userData.user.id,
          email: userData.user.email
        })
      });
      const paymentData = await payment.json();
      console.log('💳 GCash Payment:', paymentData);
    }

  } catch (error) {
    console.error('❌ API Test Failed:', error.message);
  }
}

testAPI();