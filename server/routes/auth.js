import express from 'express';
const router = express.Router();

// Simple demo authentication
router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;
    const demoData = req.app.get('demoData');
    
    // Simple demo auth - in production, use proper authentication
    let user = demoData.users.find(u => u.email === email);
    
    if (!user) {
      user = {
        id: 'user_' + Math.random().toString(36).substr(2, 9),
        email: email,
        name: email.split('@')[0],
        createdAt: new Date(),
        isDemo: true
      };
      
      demoData.users.push(user);
      console.log('👤 New user created:', user.email);
    }
    
    res.json({
      success: true,
      user: user,
      token: 'demo_token_' + Math.random().toString(36).substr(2, 16),
      message: 'Login successful (Demo Mode)'
    });
    
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({
      success: false,
      error: 'Authentication failed'
    });
  }
});

// Get user profile
router.get('/profile/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const demoData = req.app.get('demoData');
    
    const user = demoData.users.find(u => u.id === userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    res.json({
      success: true,
      user: user
    });
    
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch profile'
    });
  }
});

// Demo user creation (for testing)
router.post('/demo-user', (req, res) => {
  try {
    const demoData = req.app.get('demoData');
    
    const user = {
      id: 'demo_user_' + Math.random().toString(36).substr(2, 6),
      email: `demo${Date.now()}@ideastone.com`,
      name: 'Demo User',
      createdAt: new Date(),
      isDemo: true
    };
    
    demoData.users.push(user);
    
    res.json({
      success: true,
      user: user,
      token: 'demo_token_' + Math.random().toString(36).substr(2, 16)
    });
    
  } catch (error) {
    console.error('Demo user error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create demo user'
    });
  }
});

export default router;