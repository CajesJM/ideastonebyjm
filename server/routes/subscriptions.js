import express from 'express';
const router = express.Router();

// Activate free plan
router.post('/free', (req, res) => {
  try {
    const { userId, planType } = req.body;
    const demoData = req.app.get('demoData');
    
    // Remove any existing free plan for this user
    demoData.subscriptions = demoData.subscriptions.filter(
      sub => !(sub.userId === userId && sub.planType === 'free')
    );
    
    // Create new subscription record
    const subscription = {
      id: 'sub_' + Math.random().toString(36).substr(2, 9),
      userId,
      planType: 'free',
      generationsLeft: 10,
      totalGenerations: 10,
      activatedAt: new Date(),
      status: 'active',
      isTrial: true
    };
    
    demoData.subscriptions.push(subscription);
    
    console.log('🎁 Free plan activated for user:', userId);
    
    res.json({ 
      success: true, 
      message: 'Free plan activated successfully! You now have 10 generations.',
      subscription 
    });
  } catch (error) {
    console.error('Error activating free plan:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to activate free plan' 
    });
  }
});

// Activate paid subscription
router.post('/activate', (req, res) => {
  try {
    const { userId, planType, transactionId, paymentMethod } = req.body;
    const demoData = req.app.get('demoData');
    
    // Plan limits
    const planLimits = {
      starter: 50,
      pro: 200,
      unlimited: 999999 // Large number for "unlimited"
    };
    
    const subscription = {
      id: 'sub_' + Math.random().toString(36).substr(2, 9),
      userId,
      planType,
      generationsLeft: planLimits[planType] || 50,
      totalGenerations: planLimits[planType] || 50,
      activatedAt: new Date(),
      status: 'active',
      transactionId,
      paymentMethod,
      isTrial: false
    };
    
    demoData.subscriptions.push(subscription);
    
    console.log('💳 Paid subscription activated:', { userId, planType, transactionId });
    
    res.json({ 
      success: true, 
      message: `Successfully subscribed to ${planType} plan!`,
      subscription 
    });
  } catch (error) {
    console.error('Error activating subscription:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to activate subscription' 
    });
  }
});

// Get user subscription
router.get('/user/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const demoData = req.app.get('demoData');
    
    const subscription = demoData.subscriptions
      .filter(sub => sub.userId === userId)
      .sort((a, b) => new Date(b.activatedAt) - new Date(a.activatedAt))[0];
    
    res.json({ 
      success: true, 
      subscription: subscription || null 
    });
  } catch (error) {
    console.error('Error fetching subscription:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch subscription' 
    });
  }
});

// Update generations (when user generates an idea)
router.post('/use-generation', (req, res) => {
  try {
    const { userId } = req.body;
    const demoData = req.app.get('demoData');
    
    const subscription = demoData.subscriptions
      .filter(sub => sub.userId === userId)
      .sort((a, b) => new Date(b.activatedAt) - new Date(a.activatedAt))[0];
    
    if (subscription && subscription.generationsLeft > 0) {
      subscription.generationsLeft -= 1;
      res.json({ 
        success: true, 
        generationsLeft: subscription.generationsLeft,
        message: `Generation used. ${subscription.generationsLeft} left.`
      });
    } else {
      res.status(400).json({ 
        success: false, 
        error: 'No generations left. Please upgrade your plan.' 
      });
    }
  } catch (error) {
    console.error('Error using generation:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to use generation' 
    });
  }
});

export default router;