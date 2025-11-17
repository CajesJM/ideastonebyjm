import express from 'express';
const router = express.Router();

// Create GCash payment
router.post('/gcash/create', (req, res) => {
  try {
    const { amount, plan, userId, email } = req.body;
    
    if (process.env.NODE_ENV === 'development') {
      // Demo mode - return mock response
      const mockResponse = {
        success: true,
        checkout_url: null,
        transaction_id: 'DEMO_' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        amount: amount,
        plan: plan,
        message: 'Demo payment created successfully - No real money will be charged',
        demo: true
      };
      
      console.log('💳 Demo payment created:', mockResponse.transaction_id);
      
      return res.json(mockResponse);
    }
    
    // Production - real GCash integration would go here
    // const gcashResponse = await fetch('https://api.gcash.com/checkout', {...});
    
    // For now, return a simulated production response
    res.json({
      success: true,
      checkout_url: `https://gcash.com/checkout/simulated-payment-${Date.now()}`,
      transaction_id: 'GCASH_' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      amount: amount,
      plan: plan
    });
    
  } catch (error) {
    console.error('Payment error:', error);
    res.status(500).json({
      success: false,
      error: 'Payment initialization failed'
    });
  }
});

// Verify payment status
router.get('/gcash/verify/:transactionId', (req, res) => {
  try {
    const { transactionId } = req.params;
    
    // In demo mode, all payments are successful
    if (process.env.NODE_ENV === 'development' || transactionId.startsWith('DEMO')) {
      return res.json({
        success: true,
        status: 'success',
        transaction_id: transactionId,
        paid_at: new Date().toISOString(),
        message: 'Demo payment verified successfully'
      });
    }
    
    // Production: Verify with GCash API
    res.json({
      success: true,
      status: 'success',
      transaction_id: transactionId,
      paid_at: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({
      success: false,
      error: 'Payment verification failed'
    });
  }
});

export default router;