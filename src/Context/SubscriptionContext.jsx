import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const SubscriptionContext = createContext();

// Subscription plans configuration
export const SUBSCRIPTION_PLANS = {
  FREE: {
    type: 'free',
    name: 'Free Plan',
    price: 0,
    duration: 'forever',
    limit: 10,
    features: [
      '10 idea generations per month',
      'Basic project templates',
      'Community support',
      'Standard generation speed'
    ],
    tier: 0
  },
  STARTER: {
    type: 'starter',
    name: 'Starter Plan',
    price: 99,
    duration: 'monthly',
    limit: 50,
    features: [
      '50 idea generations per month',
      'All project templates',
      'Email support',
      'Faster generation',
      'Save up to 20 ideas'
    ],
    tier: 1
  },
  PRO: {
    type: 'pro',
    name: 'Pro Plan',
    price: 199,
    duration: 'monthly',
    limit: 200,
    features: [
      '200 idea generations per month',
      'Premium project templates',
      'Priority support',
      'Instant generation',
      'AI-powered enhancements',
      'Save unlimited ideas'
    ],
    tier: 2
  },
  UNLIMITED: {
    type: 'unlimited',
    name: 'Unlimited Plan',
    price: 399,
    duration: 'monthly',
    limit: 'unlimited',
    features: [
      'Unlimited idea generations',
      'All premium templates',
      '24/7 priority support',
      'Instant generation',
      'Advanced AI enhancements',
      'Team collaboration',
      'Custom templates'
    ],
    tier: 3
  }
};

// Storage keys
const STORAGE_KEYS = {
  SUBSCRIPTION: 'ideastone_subscription_v3',
  GENERATION_COUNT: 'ideastone_generation_count_v3',
  USAGE_HISTORY: 'ideastone_usage_history_v3',
  BILLING_HISTORY: 'ideastone_billing_history_v3'
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within SubscriptionProvider');
  }
  return context;
};

export const SubscriptionProvider = ({ children }) => {
  const [subscription, setSubscription] = useState(null);
  const [generationCount, setGenerationCount] = useState(0);
  const [usageHistory, setUsageHistory] = useState([]);
  const [billingHistory, setBillingHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load all data from localStorage on mount
  useEffect(() => {
    const loadData = () => {
      try {
        const savedSubscription = localStorage.getItem(STORAGE_KEYS.SUBSCRIPTION);
        const savedCount = localStorage.getItem(STORAGE_KEYS.GENERATION_COUNT);
        const savedUsageHistory = localStorage.getItem(STORAGE_KEYS.USAGE_HISTORY);
        const savedBillingHistory = localStorage.getItem(STORAGE_KEYS.BILLING_HISTORY);
        
        if (savedSubscription) {
          const subscriptionData = JSON.parse(savedSubscription);
          // Check if subscription is expired
          if (subscriptionData.expiresAt && new Date(subscriptionData.expiresAt) < new Date()) {
            console.log('Subscription expired, resetting to no plan');
            localStorage.removeItem(STORAGE_KEYS.SUBSCRIPTION);
            setSubscription(null);
          } else {
            setSubscription(subscriptionData);
          }
        }
        // If no subscription found, user has no active plan (subscription remains null)
        
        if (savedCount) {
          setGenerationCount(parseInt(savedCount));
        }
        
        if (savedUsageHistory) {
          setUsageHistory(JSON.parse(savedUsageHistory));
        }
        
        if (savedBillingHistory) {
          setBillingHistory(JSON.parse(savedBillingHistory));
        }
      } catch (error) {
        console.error('Error loading subscription data:', error);
        // Reset corrupted data
        localStorage.removeItem(STORAGE_KEYS.SUBSCRIPTION);
        localStorage.removeItem(STORAGE_KEYS.GENERATION_COUNT);
        setSubscription(null);
        setGenerationCount(0);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Enhanced subscribe function that properly handles free plan activation
  const subscribe = useCallback((plan, paymentMethod = null, transactionId = null) => {
    console.log('Subscribing to plan:', plan.type);
    
    if (plan.type === 'free') {
      // Handle free plan subscription - user explicitly activates free plan
      const freeSubscription = {
        plan: 'free',
        name: 'Free Plan',
        limit: SUBSCRIPTION_PLANS.FREE.limit,
        price: 0,
        duration: 'forever',
        subscribedAt: new Date().toISOString(),
        expiresAt: null,
        status: 'active'
      };
      
      setSubscription(freeSubscription);
      localStorage.setItem(STORAGE_KEYS.SUBSCRIPTION, JSON.stringify(freeSubscription));
      
      // Reset generation count when activating free plan
      setGenerationCount(0);
      localStorage.setItem(STORAGE_KEYS.GENERATION_COUNT, '0');
      
      console.log('Free plan activated with 10 generations');
      return freeSubscription;
    }

    // Handle paid plans
    const newSubscription = {
      plan: plan.type,
      name: plan.name,
      limit: plan.limit,
      price: plan.price,
      duration: plan.duration,
      subscribedAt: new Date().toISOString(),
      expiresAt: plan.duration === 'monthly' 
        ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        : plan.duration === 'yearly'
        ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
        : null,
      status: 'active',
      paymentMethod: paymentMethod,
      transactionId: transactionId || `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
    
    setSubscription(newSubscription);
    localStorage.setItem(STORAGE_KEYS.SUBSCRIPTION, JSON.stringify(newSubscription));

    // Reset generation count when subscribing to a new plan
    setGenerationCount(0);
    localStorage.setItem(STORAGE_KEYS.GENERATION_COUNT, '0');

    // Add to billing history for paid plans only
    const billingRecord = {
      id: newSubscription.transactionId,
      plan: plan.name,
      amount: plan.price,
      date: newSubscription.subscribedAt,
      status: 'completed',
      paymentMethod: paymentMethod
    };
    
    const updatedBillingHistory = [billingRecord, ...billingHistory];
    setBillingHistory(updatedBillingHistory);
    localStorage.setItem(STORAGE_KEYS.BILLING_HISTORY, JSON.stringify(updatedBillingHistory));

    console.log(`Subscribed to ${plan.name}`);
    
    return newSubscription;
  }, [billingHistory]);

  const incrementGeneration = useCallback(() => {
    const newCount = generationCount + 1;
    setGenerationCount(newCount);
    localStorage.setItem(STORAGE_KEYS.GENERATION_COUNT, newCount.toString());

    // Record usage
    const usageRecord = {
      timestamp: new Date().toISOString(),
      type: 'idea_generation',
      subscription: subscription?.plan || 'none'
    };
    
    const updatedUsageHistory = [usageRecord, ...usageHistory.slice(0, 99)];
    setUsageHistory(updatedUsageHistory);
    localStorage.setItem(STORAGE_KEYS.USAGE_HISTORY, JSON.stringify(updatedUsageHistory));

    console.log('Generation incremented:', newCount);
    return newCount;
  }, [generationCount, subscription, usageHistory]);

  const canGenerate = useCallback(() => {
    // No subscription at all - user hasn't activated any plan
    if (!subscription) {
      console.log('No plan activated - cannot generate');
      return false;
    }
    
    // Check if subscription is expired
    if (subscription.expiresAt && new Date(subscription.expiresAt) < new Date()) {
      console.log('Subscription expired, cannot generate');
      setSubscription(null);
      localStorage.removeItem(STORAGE_KEYS.SUBSCRIPTION);
      return false;
    }
    
    // Unlimited plan - always can generate
    if (subscription.plan === 'unlimited') {
      console.log('Unlimited plan - can generate');
      return true;
    }
    
    // Free plan check
    if (subscription.plan === 'free') {
      const canGenerateFree = generationCount < SUBSCRIPTION_PLANS.FREE.limit;
      console.log('Free plan check:', { 
        plan: 'free', 
        generationCount, 
        limit: SUBSCRIPTION_PLANS.FREE.limit, 
        canGenerate: canGenerateFree 
      });
      return canGenerateFree;
    }
    
    // Paid limited plans (starter, pro)
    const canGeneratePaid = generationCount < subscription.limit;
    console.log('Paid plan check:', { 
      plan: subscription.plan, 
      generationCount, 
      limit: subscription.limit, 
      canGenerate: canGeneratePaid 
    });
    return canGeneratePaid;
  }, [subscription, generationCount]);

  const getRemainingGenerations = useCallback(() => {
    if (!subscription) {
      return 0; // No plan activated
    }

    if (subscription.plan === 'unlimited') {
      return 'Unlimited';
    }

    if (subscription.plan === 'free') {
      const remaining = SUBSCRIPTION_PLANS.FREE.limit - generationCount;
      return Math.max(0, remaining);
    }

    const remaining = subscription.limit - generationCount;
    return Math.max(0, remaining);
  }, [subscription, generationCount]);

  const getCurrentPlan = useCallback(() => {
    if (!subscription) {
      return null; // No plan activated
    }
    
    const foundPlan = Object.values(SUBSCRIPTION_PLANS).find(plan => plan.type === subscription.plan);
    return foundPlan || null;
  }, [subscription]);

  const currentPlanValue = getCurrentPlan();

  const value = {
    // State
    subscription,
    generationCount,
    usageHistory,
    billingHistory,
    isLoading,
    
    // Plans
    currentPlan: currentPlanValue,
    
    // Core functions
    subscribe,
    incrementGeneration,
    canGenerate,
    getRemainingGenerations,
    
    // Enhanced subscription detection
    isSubscribed: !!subscription && subscription.status === 'active',
    isFreePlan: subscription?.plan === 'free',
    isPaidPlan: !!subscription && subscription.status === 'active' && subscription.plan !== 'free',
    hasNoPlan: !subscription, // New: user hasn't activated any plan
    
    // Additional info
    remainingGenerations: getRemainingGenerations(),
    canGenerateNow: canGenerate()
  };

  console.log('Subscription Context State:', {
    subscription,
    generationCount,
    currentPlan: currentPlanValue?.name || 'No Plan',
    isSubscribed: !!subscription,
    remaining: getRemainingGenerations(),
    canGenerate: canGenerate()
  });

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};