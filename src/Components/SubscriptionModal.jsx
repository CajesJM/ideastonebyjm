import { motion, AnimatePresence } from 'framer-motion';
import { useSubscription } from '../Context/SubscriptionContext';
import { useState, useEffect } from 'react';
import '../Style/SubscriptionModal.css';
import gcashIcon from '../Assets/payment-icons/gcash.png';
import paypalIcon from '../Assets/payment-icons/paypal.png';
import creditCardIcon from '../Assets/payment-icons/credit_debit.png';
import mayaIcon from '../Assets/payment-icons/maya.png';

const API_BASE = 'http://localhost:8000/api';

const SubscriptionModal = ({ isOpen, onClose, user }) => {
  const {
    subscribe,
    subscribeWithPayment,
    currentPlan,
    isSubscribed,
    handlePaymentCallback
  } = useSubscription();

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('gcash');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState('select-plan');

  const subscriptionPlans = [
    {
      type: 'free',
      name: 'Free Plan',
      price: 0,
      duration: 'forever',
      limit: 10,
      features: [
        '10 free idea generations',
        'Basic project templates',
        'Community support',
        'Standard generation speed',
        'Access to basic filters'
      ],
      popular: false,
      highlighted: false,
      isFree: true
    },
    {
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
        'Advanced filters',
        'Save up to 20 ideas'
      ],
      popular: true,
      highlighted: true
    },
    {
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
        'Save unlimited ideas',
        'Export capabilities'
      ],
      popular: false,
      highlighted: false
    },
    {
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
        'Custom templates',
        'Early access to features'
      ],
      popular: false,
      highlighted: false
    }
  ];

  const paymentMethods = [
    {
      id: 'gcash',
      name: 'GCash',
      icon: gcashIcon,
      description: 'Pay using GCash wallet',
      enabled: true
    },
    {
      id: 'paypal',
      name: 'PayPal',
      icon: paypalIcon,
      description: 'Pay with PayPal account',
      enabled: false
    },
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: creditCardIcon,
      description: 'Secure card payment',
      enabled: false
    },
    {
      id: 'maya',
      name: 'Maya',
      icon: mayaIcon,
      description: 'Pay using Maya wallet',
      enabled: false
    },
  ];

  // Reset when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setPaymentStep('select-plan');
      setSelectedPaymentMethod('gcash');
      setSelectedPlan(null);
      setIsProcessing(false);
    }
  }, [isOpen]);

  // Handle payment verification from URL parameters
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

          // Close modal and show success message
          alert('🎉 Payment successful! Your subscription has been activated.');
          onClose();
        } catch (error) {
          console.error('Payment callback processing failed:', error);
          alert('Payment verification failed. Please contact support.');
        }
      }
    };

    if (isOpen) {
      checkPaymentCallback();
    }
  }, [isOpen, handlePaymentCallback, onClose]);

  const handleFreePlanActivation = async () => {
    if (!user) {
      alert('Please sign in to activate your free plan');
      return;
    }

    setIsProcessing(true);

    try {
      const freePlan = subscriptionPlans.find(p => p.type === 'free');
      await subscribe(freePlan);

      setTimeout(() => {
        alert(`🎉 Successfully activated Free Plan! You now have 10 free generations.`);
        onClose();
      }, 500);
    } catch (error) {
      console.error('Error activating free plan:', error);
      alert('Failed to activate free plan. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaidPlanSubscription = async (plan) => {
    if (!user) {
      alert('Please sign in to proceed with payment');
      return;
    }

    setIsProcessing(true);

    try {
      const result = await subscribeWithPayment(plan);

      if (result && result.redirecting) {
        // User is being redirected to payment gateway
        console.log('Redirecting to payment gateway...');
        // Don't close modal yet - let the redirect happen
      } else {
        // Payment completed immediately (demo mode or direct activation)
        console.log('Subscription activated:', result);
        alert(`🎉 Successfully subscribed to ${plan.name}! You now have ${plan.limit} generations per month.`);
        onClose();
      }
    } catch (error) {
      console.error('Payment subscription failed:', error);
      alert('Subscription failed: ' + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const processDirectGCashPayment = async (plan) => {
  if (!user) {
    alert('Please sign in to proceed with payment');
    return;
  }

  setIsProcessing(true);
  
  try {
    // Create GCash payment request
    const paymentResponse = await fetch(`${API_BASE}/payments/gcash/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: plan.price,
        plan: plan.type,
        userId: user.id,
        email: user.email
      })
    });

    if (!paymentResponse.ok) {
      throw new Error(`HTTP error! status: ${paymentResponse.status}`);
    }

    const paymentData = await paymentResponse.json();
    
    if (paymentData.success) {
      // Check if we're on mobile and try GCash app first
      const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      
      if (isMobile && paymentData.checkout_url) {
        console.log('Mobile device detected, trying GCash app...');
        
        // Try to open GCash app
        window.location.href = paymentData.checkout_url;
        
        // Fallback to web after a delay if GCash app isn't installed
        setTimeout(() => {
          if (!document.hidden) {
            console.log('GCash app not detected, falling back to web...');
            if (paymentData.web_url) {
              window.location.href = paymentData.web_url;
            } else {
              // If no web URL, show simulation
              showGCashSimulation(plan, paymentData.transaction_id);
            }
          }
        }, 2000);
        
      } else if (paymentData.web_url) {
        // Desktop or fallback - use web URL
        console.log('Using web checkout URL');
        window.location.href = paymentData.web_url;
      } else {
        // No URLs available, show simulation
        console.log('No payment URLs available, showing simulation');
        await showGCashSimulation(plan, paymentData.transaction_id);
      }
      
      return;
    } else {
      throw new Error('Failed to create GCash payment');
    }
  } catch (error) {
    console.error('GCash payment error:', error);
    alert('Payment initialization failed: ' + error.message);
  } finally {
    setIsProcessing(false);
  }
};
  // Realistic GCash simulation function
  const showGCashSimulation = async (plan, transactionId) => {
    // Create a realistic GCash simulation modal
    const simulationHTML = `
    <div style="
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, #00A859, #008C4A);
      color: white;
      font-family: Arial, sans-serif;
      z-index: 10000;
      display: flex;
      flex-direction: column;
    ">
      <!-- GCash Header -->
      <div style="
        background: rgba(0,0,0,0.1);
        padding: 20px;
        text-align: center;
        border-bottom: 1px solid rgba(255,255,255,0.2);
      ">
        <h1 style="margin: 0; font-size: 24px; font-weight: bold;">GCash</h1>
        <p style="margin: 5px 0 0 0; opacity: 0.8;">Secure Mobile Wallet</p>
      </div>

      <!-- Payment Details -->
      <div style="
        flex: 1;
        padding: 30px 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
      ">
        <div style="
          background: rgba(255,255,255,0.1);
          border-radius: 20px;
          padding: 30px;
          max-width: 400px;
          width: 100%;
          backdrop-filter: blur(10px);
        ">
          <!-- Merchant Info -->
          <div style="margin-bottom: 30px;">
            <div style="font-size: 14px; opacity: 0.8; margin-bottom: 5px;">Paying</div>
            <div style="font-size: 18px; font-weight: bold;">IdeaStone</div>
            <div style="font-size: 12px; opacity: 0.7;">${plan.name} Subscription</div>
          </div>

          <!-- Amount -->
          <div style="
            font-size: 48px;
            font-weight: bold;
            margin: 20px 0;
            color: #FFD700;
          ">
            ₱${plan.price}
          </div>

          <!-- Transaction ID -->
          <div style="
            background: rgba(255,255,255,0.1);
            padding: 10px;
            border-radius: 10px;
            margin: 20px 0;
            font-size: 12px;
            opacity: 0.8;
          ">
            Transaction: ${transactionId}
          </div>

          <!-- Payment Methods -->
          <div style="margin: 30px 0;">
            <div style="font-size: 14px; opacity: 0.8; margin-bottom: 15px;">Payment Method</div>
            <div style="
              background: rgba(255,255,255,0.15);
              padding: 15px;
              border-radius: 10px;
              display: flex;
              align-items: center;
              gap: 15px;
            ">
              <div style="
                width: 40px;
                height: 40px;
                background: white;
                border-radius: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #00A859;
                font-weight: bold;
                font-size: 20px;
              ">G</div>
              <div>
                <div style="font-weight: bold;">GCash Wallet</div>
                <div style="font-size: 12px; opacity: 0.8;">Balance: ₱1,234.56</div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div style="display: flex; gap: 10px; margin-top: 20px;">
            <button onclick="window.paymentCancelled()" style="
              flex: 1;
              background: rgba(255,255,255,0.2);
              border: 1px solid rgba(255,255,255,0.3);
              color: white;
              padding: 15px;
              border-radius: 10px;
              font-size: 16px;
              cursor: pointer;
            ">Cancel</button>
            <button onclick="window.paymentConfirmed()" style="
              flex: 2;
              background: #FFD700;
              border: none;
              color: #000;
              padding: 15px;
              border-radius: 10px;
              font-size: 16px;
              font-weight: bold;
              cursor: pointer;
            ">Pay ₱${plan.price}</button>
          </div>
        </div>
      </div>

      <!-- GCash Footer -->
      <div style="
        background: rgba(0,0,0,0.1);
        padding: 15px;
        text-align: center;
        border-top: 1px solid rgba(255,255,255,0.2);
        font-size: 12px;
        opacity: 0.7;
      ">
        Secured by GCash • 256-bit Encryption
      </div>
    </div>
  `;

    // Create simulation window
    return new Promise((resolve, reject) => {
      const simulationDiv = document.createElement('div');
      simulationDiv.innerHTML = simulationHTML;
      document.body.appendChild(simulationDiv);

      // Add global functions for buttons
      window.paymentConfirmed = async () => {
        try {
          // Show processing state
          const payButton = simulationDiv.querySelector('button:last-child');
          payButton.innerHTML = '<div>Processing Payment...</div>';
          payButton.disabled = true;

          // Simulate processing delay
          await new Promise(resolve => setTimeout(resolve, 2000));

          // Activate subscription
          const subscriptionResponse = await fetch(`${API_BASE}/subscriptions/activate`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId: user.id,
              planType: plan.type,
              transactionId: transactionId,
              paymentMethod: 'gcash'
            })
          });

          if (subscriptionResponse.ok) {
            const subscriptionData = await subscriptionResponse.json();
            if (subscriptionData.success) {
              subscribe(plan);

              // Show success screen
              simulationDiv.innerHTML = `
              <div style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(135deg, #00A859, #008C4A);
                color: white;
                font-family: Arial, sans-serif;
                z-index: 10000;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                text-align: center;
              ">
                <div style="
                  background: rgba(255,255,255,0.1);
                  border-radius: 20px;
                  padding: 40px;
                  max-width: 400px;
                  width: 90%;
                  backdrop-filter: blur(10px);
                ">
                  <div style="font-size: 80px; margin-bottom: 20px;">✅</div>
                  <h2 style="margin: 0 0 10px 0;">Payment Successful!</h2>
                  <p style="opacity: 0.8; margin-bottom: 20px;">
                    Your ${plan.name} subscription has been activated
                  </p>
                  <div style="
                    background: rgba(255,255,255,0.1);
                    padding: 15px;
                    border-radius: 10px;
                    margin: 20px 0;
                    font-size: 14px;
                  ">
                    <div>Amount: <strong>₱${plan.price}</strong></div>
                    <div>Transaction: ${transactionId}</div>
                  </div>
                  <button onclick="window.closeSimulation()" style="
                    background: #FFD700;
                    border: none;
                    color: #000;
                    padding: 15px 30px;
                    border-radius: 10px;
                    font-size: 16px;
                    font-weight: bold;
                    cursor: pointer;
                    margin-top: 20px;
                  ">
                    Continue to IdeaStone
                  </button>
                </div>
              </div>
            `;

              // Add close function
              window.closeSimulation = () => {
                document.body.removeChild(simulationDiv);
                onClose();
                resolve();
              };

              // Auto close after 3 seconds
              setTimeout(() => {
                if (document.body.contains(simulationDiv)) {
                  document.body.removeChild(simulationDiv);
                  onClose();
                }
                resolve();
              }, 3000);
            }
          }
        } catch (error) {
          console.error('Payment processing error:', error);
          alert('Payment processing failed');
          document.body.removeChild(simulationDiv);
          reject(error);
        }
      };

      window.paymentCancelled = () => {
        document.body.removeChild(simulationDiv);
        reject(new Error('Payment cancelled by user'));
      };
    });
  };

  const handleSubscribe = async (plan, paymentMethod = null) => {
    if (plan.type === 'free') {
      await handleFreePlanActivation();
      return;
    }

    if (!paymentMethod) {
      alert('Please select a payment method');
      return;
    }

    if (paymentMethod === 'gcash') {
      await processDirectGCashPayment(plan);
    } else {
      alert('This payment method is currently unavailable. Please use GCash.');
    }
  };

  const PaymentIcon = ({ method }) => {
    return (
      <div className="payment-icon-wrapper">
        <img
          src={method.icon}
          alt={method.name}
          className="payment-icon-img"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
        <div className="payment-icon-fallback" style={{ display: 'none' }}>
          {method.fallbackIcon}
        </div>
        {!method.enabled && (
          <div className="payment-method-disabled">
            <span>Coming Soon</span>
          </div>
        )}
      </div>
    );
  };

  const needsFreeActivation = !isSubscribed && (!currentPlan || currentPlan.type !== 'free');

  const renderPaymentDetails = (plan) => (
    <div className="payment-details-section">
      <div className="payment-header">
        <button
          className="back-button"
          onClick={() => setPaymentStep('select-plan')}
        >
          <i className="bi bi-arrow-left"></i>
          Back to Plans
        </button>
        <h3>Complete Your Payment</h3>
      </div>

      <div className="order-summary">
        <h4>Order Summary</h4>
        <div className="summary-details">
          <div className="summary-item">
            <span>Plan:</span>
            <span>{plan.name}</span>
          </div>
          <div className="summary-item">
            <span>Billing:</span>
            <span>{plan.duration}</span>
          </div>
          <div className="summary-item">
            <span>Generations:</span>
            <span>{plan.limit === 'unlimited' ? 'Unlimited' : `${plan.limit} per month`}</span>
          </div>
          <div className="summary-item total">
            <span>Total Amount:</span>
            <span>₱{plan.price}</span>
          </div>
        </div>
      </div>

      <div className="payment-method-selection">
        <h4>Selected Payment Method</h4>
        <div className="selected-payment-method">
          <PaymentIcon method={paymentMethods.find(m => m.id === selectedPaymentMethod)} />
          <div className="selected-payment-info">
            <span className="payment-name">{paymentMethods.find(m => m.id === selectedPaymentMethod)?.name}</span>
            <span className="payment-description">
              {paymentMethods.find(m => m.id === selectedPaymentMethod)?.description}
            </span>
          </div>
        </div>
      </div>

      <div className="gcash-instructions">
        <h4>Ready to Pay with GCash</h4>
        <p>Click the button below to be redirected to GCash payment page where you can complete your transaction securely.</p>

        <div className="real-payment-note">
          <i className="bi bi-shield-check"></i>
          <div>
            <strong>Secure Payment</strong>
            <span>You will be redirected to GCash to complete your payment securely</span>
          </div>
        </div>
      </div>

      <motion.button
        className="confirm-payment-btn"
        onClick={() => handleSubscribe(plan, selectedPaymentMethod)}
        disabled={isProcessing}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {isProcessing ? (
          <>
            <i className="bi bi-arrow-repeat spinner"></i>
            Redirecting to GCash...
          </>
        ) : (
          <>
            <i className="bi bi-arrow-up-right"></i>
            Pay with GCash - ₱{plan.price}
          </>
        )}
      </motion.button>

      <div className="security-notice">
        <i className="bi bi-shield-check"></i>
        <span>Your payment is secure and encrypted. We never store your payment details.</span>
      </div>
    </div>
  );

  const handlePlanSelection = (plan) => {
    if (!user) {
      alert('Please sign in to continue');
      return;
    }

    if (plan.isFree) {
      handleSubscribe(plan);
    } else {
      setSelectedPlan(plan);
      setPaymentStep('payment-details');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="subscription-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="subscription-modal"
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="modal-header">
              <div className="header-content">
                <i className="bi bi-rocket-takeoff header-icon"></i>
                <div>
                  <h2>Get Started with IdeaStone</h2>
                  <p>Choose your plan to start generating capstone ideas</p>
                </div>
              </div>
              <button className="close-btn" onClick={onClose}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            {!user && (
              <div className="signin-required-banner">
                <div className="banner-content">
                  <i className="bi bi-exclamation-circle"></i>
                  <div>
                    <h4>Sign In Required</h4>
                    <p>Please sign in to activate your free plan or subscribe to paid plans</p>
                  </div>
                </div>
              </div>
            )}

            {needsFreeActivation && user && (
              <div className="activation-banner">
                <div className="banner-content">
                  <i className="bi bi-exclamation-triangle"></i>
                  <div>
                    <h4>Activation Required</h4>
                    <p>You need to activate a plan to start generating ideas</p>
                  </div>
                </div>
              </div>
            )}

            {isSubscribed && (
              <div className="current-plan-section">
                <div className="current-plan-badge">
                  <i className="bi bi-check-circle"></i>
                  <span>Current Plan: <strong>{currentPlan?.name}</strong></span>
                </div>
                <p className="current-plan-description">
                  You're currently subscribed to {currentPlan?.name} with{' '}
                  {currentPlan?.limit === 'unlimited' ? 'unlimited' : currentPlan?.limit} generations.
                </p>
              </div>
            )}

            {paymentStep === 'select-plan' && (
              <div className="plans-container">
                {subscriptionPlans.map((plan, index) => (
                  <motion.div
                    key={plan.type}
                    className={`plan-card ${plan.popular ? 'popular' : ''} ${plan.highlighted ? 'highlighted' : ''} ${plan.isFree ? 'free-plan' : ''}`}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.15, type: "spring", stiffness: 300 }}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  >
                    {plan.isFree && (
                      <div className="free-badge">
                        <i className="bi bi-gift"></i>
                        Perfect for Starters
                      </div>
                    )}

                    {plan.popular && (
                      <div className="popular-badge">
                        <i className="bi bi-star-fill"></i>
                        Most Popular
                      </div>
                    )}

                    <div className="plan-header">
                      <div className="plan-type">
                        <h3>{plan.name}</h3>
                        {plan.highlighted && <span className="value-badge">Best Value</span>}
                      </div>
                      <div className="plan-price">
                        {plan.isFree ? (
                          <span className="price-free">FREE</span>
                        ) : (
                          <>
                            <span className="price">₱{plan.price}</span>
                            <span className="duration">/month</span>
                          </>
                        )}
                      </div>
                      <div className="generation-limit">
                        {plan.limit === 'unlimited' ? (
                          <span className="unlimited">Unlimited Generations</span>
                        ) : (
                          <span>{plan.limit} Generations</span>
                        )}
                      </div>
                    </div>

                    <ul className="plan-features">
                      {plan.features.map((feature, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + (i * 0.1) }}
                        >
                          <i className="bi bi-check-circle-fill"></i>
                          <span>{feature}</span>
                        </motion.li>
                      ))}
                    </ul>

                    <motion.button
                      className={`subscribe-btn ${plan.popular ? 'popular' : ''} ${plan.isFree ? 'free' : ''} ${!user ? 'disabled' : ''}`}
                      whileHover={user ? { scale: 1.02 } : {}}
                      whileTap={user ? { scale: 0.98 } : {}}
                      onClick={() => handlePlanSelection(plan)}
                      disabled={isProcessing || !user}
                    >
                      {isProcessing && plan.isFree ? (
                        <>
                          <i className="bi bi-arrow-repeat spinner"></i>
                          Activating...
                        </>
                      ) : plan.isFree ? (
                        <>
                          <i className="bi bi-arrow-right-circle"></i>
                          Activate Free Plan
                        </>
                      ) : (
                        <>
                          Get {plan.name}
                          <i className="bi bi-arrow-right"></i>
                        </>
                      )}
                    </motion.button>

                    {plan.isFree && (
                      <div className="no-payment-needed">
                        <i className="bi bi-shield-check"></i>
                        No payment required • Activate instantly
                      </div>
                    )}

                    {!plan.isFree && (
                      <div className="payment-info">
                        <i className="bi bi-credit-card"></i>
                        GCash payment required
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}

            {paymentStep === 'payment-details' && selectedPlan && renderPaymentDetails(selectedPlan)}

            <div className="guarantee-section">
              <div className="guarantee-grid">
                <div className="guarantee-item">
                  <i className="bi bi-shield-check"></i>
                  <span>Secure Payment</span>
                </div>
                <div className="guarantee-item">
                  <i className="bi bi-arrow-clockwise"></i>
                  <span>Cancel Anytime</span>
                </div>
                <div className="guarantee-item">
                  <i className="bi bi-headset"></i>
                  <span>24/7 Support</span>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <p>
                <i className="bi bi-info-circle"></i>
                Start with Free Plan or upgrade anytime! All paid plans include a 7-day money-back guarantee.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SubscriptionModal;