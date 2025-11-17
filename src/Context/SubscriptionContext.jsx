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

// Payment methods
const PAYMENT_METHODS = {
  GCASH: 'gcash',
  CREDIT_CARD: 'credit_card',
  PAYPAL: 'paypal'
};

// Storage keys
const STORAGE_KEYS = {
  SUBSCRIPTION: 'ideastone_subscription_v3',
  GENERATION_COUNT: 'ideastone_generation_count_v3',
  USAGE_HISTORY: 'ideastone_usage_history_v3',
  BILLING_HISTORY: 'ideastone_billing_history_v3',
  USER_DATA: 'ideastone_user_data_v3'
};

// API Base URL
const API_BASE = 'http://localhost:8000/api';

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within SubscriptionProvider');
  }
  return context;
};

export const SubscriptionProvider = ({ children, user }) => {
  const [subscription, setSubscription] = useState(null);
  const [generationCount, setGenerationCount] = useState(0);
  const [usageHistory, setUsageHistory] = useState([]);
  const [billingHistory, setBillingHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiSubscription, setApiSubscription] = useState(null);

  // Load data from localStorage and API
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load local storage data
        const savedSubscription = localStorage.getItem(STORAGE_KEYS.SUBSCRIPTION);
        const savedCount = localStorage.getItem(STORAGE_KEYS.GENERATION_COUNT);
        const savedUsageHistory = localStorage.getItem(STORAGE_KEYS.USAGE_HISTORY);
        const savedBillingHistory = localStorage.getItem(STORAGE_KEYS.BILLING_HISTORY);

        // Load API subscription data if user is logged in
        if (user) {
          try {
            const response = await fetch(`${API_BASE}/subscriptions/user/${user.id}`);
            if (response.ok) {
              const data = await response.json();
              if (data.success && data.subscription) {
                setApiSubscription(data.subscription);
                console.log('📡 API Subscription loaded:', data.subscription);

                // If we have API subscription, use it instead of local storage
                if (savedSubscription) {
                  console.log('🔄 Overriding local subscription with API data');
                  localStorage.removeItem(STORAGE_KEYS.SUBSCRIPTION);
                }
              }
            }
          } catch (apiError) {
            console.warn('⚠️ Could not load API subscription, using local data:', apiError);
          }
        }

        // Use API subscription if available, otherwise use local storage
        if (apiSubscription) {
          const subscriptionData = apiSubscription;

          // FIX: Map API snake_case to camelCase
          const planType = subscriptionData.plan_type;
          const planKey = planType ? planType.toUpperCase() : 'FREE';

          setSubscription({
            plan: planType,
            name: SUBSCRIPTION_PLANS[planKey]?.name || 'Free Plan',
            limit: subscriptionData.total_generations || 10,
            generationsLeft: subscriptionData.generations_left || 8,
            price: SUBSCRIPTION_PLANS[planKey]?.price || 0,
            duration: 'monthly',
            subscribedAt: subscriptionData.activated_at,
            expiresAt: null,
            status: subscriptionData.status || 'active',
            isApiSubscription: true
          });
        } else if (savedSubscription) {
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
        localStorage.removeItem(STORAGE_KEYS.SUBSCRIPTION);
        localStorage.removeItem(STORAGE_KEYS.GENERATION_COUNT);
        setSubscription(null);
        setGenerationCount(0);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user]);

  // Payment integration functions
  const createGCashPayment = async (plan, userData) => {
    try {
      const response = await fetch(`${API_BASE}/payments/gcash/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: plan.price,
          plan: plan.type,
          userId: userData.id,
          email: userData.email
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Payment creation failed');
      }

      return data;
    } catch (error) {
      console.error('GCash payment creation error:', error);
      throw error;
    }
  };

  const verifyPayment = async (transactionId) => {
    try {
      const response = await fetch(`${API_BASE}/payments/gcash/verify/${transactionId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Payment verification error:', error);
      throw error;
    }
  };

  // Refresh subscription data from API
  const refreshSubscriptionData = async () => {
    if (!user) return;

    try {
      const response = await fetch(`${API_BASE}/subscriptions/user/${user.id}`);
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.subscription) {
          setApiSubscription(data.subscription);
          
          // Update local subscription state
          const subscriptionData = data.subscription;
          const planType = subscriptionData.plan_type;
          const planKey = planType ? planType.toUpperCase() : 'FREE';

          setSubscription({
            plan: planType,
            name: SUBSCRIPTION_PLANS[planKey]?.name || 'Free Plan',
            limit: subscriptionData.total_generations || 10,
            generationsLeft: subscriptionData.generations_left || 8,
            price: SUBSCRIPTION_PLANS[planKey]?.price || 0,
            duration: 'monthly',
            subscribedAt: subscriptionData.activated_at,
            expiresAt: null,
            status: subscriptionData.status || 'active',
            isApiSubscription: true
          });

          console.log('Subscription data refreshed from API');
        }
      }
    } catch (error) {
      console.warn('Could not refresh subscription data:', error);
    }
  };

  // Handle payment callback
  const handlePaymentCallback = async (transactionId) => {
    try {
      console.log('Handling payment callback for:', transactionId);
      
      const verification = await verifyPayment(transactionId);
      
      if (verification.success && verification.status === 'success') {
        // Payment successful - refresh subscription data
        await refreshSubscriptionData();
        return { success: true, message: 'Payment verified successfully' };
      } else {
        throw new Error('Payment verification failed');
      }
    } catch (error) {
      console.error('Payment callback handling failed:', error);
      throw error;
    }
  };

  // Enhanced subscribe function that works with both local and API
  const subscribe = useCallback(async (plan, paymentMethod = null, transactionId = null) => {
    console.log('Subscribing to plan:', plan.type);

    // For API subscriptions (when user is logged in)
    if (user) {
      try {
        if (plan.type === 'free') {
          // FIXED: Use full API URL
          const response = await fetch(`${API_BASE}/subscriptions/free`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId: user.id,
              planType: plan.type
            })
          });

          // Check if response is OK
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();

          if (data.success) {
            const apiSubscription = data.subscription;
            setApiSubscription(apiSubscription);

            const newSubscription = {
              plan: plan.type,
              name: plan.name,
              limit: plan.limit,
              generationsLeft: apiSubscription.generations_left,
              price: 0,
              duration: 'forever',
              subscribedAt: apiSubscription.activated_at,
              expiresAt: null,
              status: 'active',
              isApiSubscription: true
            };

            setSubscription(newSubscription);

            // Reset generation count
            setGenerationCount(0);
            localStorage.setItem(STORAGE_KEYS.GENERATION_COUNT, '0');

            console.log('🎁 Free plan activated via API with', apiSubscription.generationsLeft, 'generations');
            return newSubscription;
          } else {
            throw new Error(data.error || 'Failed to activate free plan');
          }
        } else {
          // FIXED: Use full API URL
          const response = await fetch(`${API_BASE}/subscriptions/activate`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId: user.id,
              planType: plan.type,
              transactionId: transactionId,
              paymentMethod: paymentMethod
            })
          });

          // Check if response is OK
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();

          if (data.success) {
            const apiSubscription = data.subscription;
            setApiSubscription(apiSubscription);

            // FIX: Map API response fields
            const newSubscription = {
              plan: apiSubscription.plan_type, 
              name: plan.name,
              limit: apiSubscription.total_generations, 
              generationsLeft: apiSubscription.generations_left, 
              price: 0,
              duration: 'forever',
              subscribedAt: apiSubscription.activated_at, 
              expiresAt: null,
              status: 'active',
              isApiSubscription: true
            };

            setSubscription(newSubscription);

            // Reset generation count
            setGenerationCount(0);
            localStorage.setItem(STORAGE_KEYS.GENERATION_COUNT, '0');

            // Add to billing history for paid plans only
            const billingRecord = {
              id: transactionId,
              plan: plan.name,
              amount: plan.price,
              date: newSubscription.subscribedAt,
              status: 'completed',
              paymentMethod: paymentMethod
            };

            const updatedBillingHistory = [billingRecord, ...billingHistory];
            setBillingHistory(updatedBillingHistory);
            localStorage.setItem(STORAGE_KEYS.BILLING_HISTORY, JSON.stringify(updatedBillingHistory));

            console.log(`💳 Subscribed to ${plan.name} via API`);
            return newSubscription;
          } else {
            throw new Error(data.error || 'Failed to activate subscription');
          }
        }
      } catch (error) {
        console.error('API subscription error:', error);
        throw error; 
      }
    } else {
      // Local storage subscription (no user logged in)
      if (plan.type === 'free') {
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

        console.log('Free plan activated locally with 10 generations');
        return freeSubscription;
      }

      // Local paid plans
      const newSubscription = {
        plan: plan.type,
        name: plan.name,
        limit: plan.limit,
        price: plan.price,
        duration: plan.duration,
        subscribedAt: new Date().toISOString(),
        expiresAt: plan.duration === 'monthly'
          ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
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

      console.log(`Subscribed to ${plan.name} locally`);
      return newSubscription;
    }
  }, [user, billingHistory]);

  // Enhanced subscribe function for paid plans with payment
  const subscribeWithPayment = async (plan, paymentMethod = PAYMENT_METHODS.GCASH) => {
    console.log('Starting payment subscription for:', plan.type);

    if (!user) {
      throw new Error('User must be logged in to subscribe to paid plans');
    }

    if (plan.type === 'free') {
      // Use existing free plan subscription
      return await subscribe(plan);
    }

    // For paid plans, require payment
    try {
      // Step 1: Create payment
      const paymentResult = await createGCashPayment(plan, user);
      
      // Step 2: If we have a checkout URL, redirect to payment gateway
      if (paymentResult.checkout_url && !paymentResult.demo) {
        console.log('Redirecting to payment gateway:', paymentResult.checkout_url);
        window.location.href = paymentResult.checkout_url;
        return { redirecting: true, transactionId: paymentResult.transaction_id };
      }

      // Step 3: For demo payments or immediate activation
      if (paymentResult.demo || !paymentResult.checkout_url) {
        console.log('Processing demo/immediate payment activation');
        
        // Activate subscription with the transaction ID
        const subscriptionResult = await subscribe(
          plan, 
          paymentMethod, 
          paymentResult.transaction_id
        );
        
        return subscriptionResult;
      }

    } catch (error) {
      console.error('Payment subscription failed:', error);
      throw error;
    }
  };

  const incrementGeneration = useCallback(async () => {
    console.log('🔄 SUPER SIMPLE incrementGeneration');

    let newCount = generationCount + 1;
    setGenerationCount(newCount);
    localStorage.setItem(STORAGE_KEYS.GENERATION_COUNT, newCount.toString());

    // For API subscriptions, also decrement the generationsLeft locally
    if (subscription?.isApiSubscription && subscription.generationsLeft > 0) {
      const newGenerationsLeft = subscription.generationsLeft - 1;
      setSubscription(prev => ({
        ...prev,
        generationsLeft: newGenerationsLeft
      }));
      console.log('📊 Local generationsLeft updated to:', newGenerationsLeft);
    }

    // Optional: Still call the API in the background (but don't depend on it)
    if (user && subscription?.isApiSubscription) {
      fetch(`${API_BASE}/subscriptions/use-generation`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({userId: user.id})
      }).catch(err => console.log('⚠️ API call failed (but local count worked)'));
    }

    return newCount;
  }, [generationCount, subscription, user]);

  const canGenerate = useCallback(() => {
    if (!subscription) {
      console.log('No plan activated - cannot generate');
      return false;
    }

    // Check if subscription is expired (for local subscriptions only)
    if (!subscription.isApiSubscription && subscription.expiresAt && new Date(subscription.expiresAt) < new Date()) {
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

    // For API subscriptions, use generationsLeft from backend
    if (subscription.isApiSubscription && subscription.generationsLeft !== undefined) {
      const canGenerateApi = subscription.generationsLeft > 0;
      console.log('API subscription check:', {
        plan: subscription.plan,
        generationsLeft: subscription.generationsLeft,
        canGenerate: canGenerateApi
      });
      return canGenerateApi;
    }

    // Free plan check (local)
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

    // Paid limited plans (starter, pro) - local
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

    console.log('🔍 getRemainingGenerations check:', {
      plan: subscription.plan,
      isApiSubscription: subscription.isApiSubscription,
      generationsLeft: subscription.generationsLeft,
      generationCount,
      limit: subscription.limit
    });

    // For API subscriptions, use generationsLeft from backend
    if (subscription.isApiSubscription && subscription.generationsLeft !== undefined) {
      console.log('📡 Using API generationsLeft:', subscription.generationsLeft);
      return subscription.generationsLeft;
    }

    // For local subscriptions, calculate remaining
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

  // Handle payment verification on page load
  useEffect(() => {
    const checkPaymentCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const transactionId = urlParams.get('transaction_id');
      const paymentStatus = urlParams.get('payment_status');
      
      if (transactionId && paymentStatus === 'success') {
        try {
          console.log('Processing payment callback from URL');
          await handlePaymentCallback(transactionId);
          
          // Clean up URL
          const newUrl = window.location.pathname;
          window.history.replaceState({}, document.title, newUrl);
          
        } catch (error) {
          console.error('Payment callback processing failed:', error);
        }
      }
    };

    checkPaymentCallback();
  }, []);

  const currentPlanValue = getCurrentPlan();

  const value = {
    // State
    subscription,
    generationCount,
    usageHistory,
    billingHistory,
    isLoading,
    apiSubscription,

    // Plans
    currentPlan: currentPlanValue,

    // Core functions
    subscribe,
    subscribeWithPayment,
    incrementGeneration,
    canGenerate,
    getRemainingGenerations,

    // Payment functions
    createGCashPayment,
    verifyPayment,
    handlePaymentCallback,
    refreshSubscriptionData,

    // Enhanced subscription detection
    isSubscribed: !!subscription && subscription.status === 'active',
    isFreePlan: subscription?.plan === 'free',
    isPaidPlan: !!subscription && subscription.status === 'active' && subscription.plan !== 'free',
    hasNoPlan: !subscription,
    isApiSubscription: subscription?.isApiSubscription || false,

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
    canGenerate: canGenerate(),
    isApiSubscription: subscription?.isApiSubscription || false,
    user: user ? 'Logged in' : 'Not logged in'
  });

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};