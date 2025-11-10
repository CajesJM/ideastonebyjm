import { motion, AnimatePresence } from 'framer-motion';
import { useSubscription } from '../Context/SubscriptionContext';
import '../Style/SubscriptionModal.css';
import gcashIcon from '../Assets/payment-icons/gcash.png';
import paypalIcon from '../Assets/payment-icons/paypal.png';
import creditCardIcon from '../Assets/payment-icons/credit_debit.png';
import mayaIcon from '../Assets/payment-icons/maya.png';

const SubscriptionModal = ({ isOpen, onClose }) => {
  const { subscribe, currentPlan, isSubscribed } = useSubscription();

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
      description: 'Pay using GCash wallet'
    },
    {
      id: 'paypal',
      name: 'PayPal',
      icon: paypalIcon,
      description: 'Pay with PayPal account'
    },
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: creditCardIcon,
      description: 'Secure card payment'
    },
    {
      id: 'maya',
      name: 'Maya',
      icon: mayaIcon,
      description: 'Pay using Maya wallet'
    },
  ];

  const handleSubscribe = (plan, paymentMethod = null) => {
    if (plan.type === 'free') {
      // Free plan - no payment needed
      subscribe(plan);
      
      // Show success message
      setTimeout(() => {
        alert(`🎉 Successfully activated Free Plan! You now have 10 free generations.`);
        onClose();
      }, 500);
      return;
    }

    if (!paymentMethod) {
      alert('Please select a payment method');
      return;
    }

    // Show payment processing state
    alert(`Processing ${plan.name} payment via ${paymentMethod}...`);
    
    // Simulate payment processing
    setTimeout(() => {
      subscribe(plan);
      alert(`🎉 Successfully subscribed to ${plan.name}! You now have ${plan.limit} generations per month.`);
      onClose();
    }, 2000);
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
      </div>
    );
  };

  // Check if user needs to activate free plan
  const needsFreeActivation = !isSubscribed && (!currentPlan || currentPlan.type !== 'free');

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

            {/* Activation Required Banner */}
            {needsFreeActivation && (
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

            {/* Current Plan Status */}
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

            {/* Plans Grid */}
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
                  {/* Free Plan Badge */}
                  {plan.isFree && (
                    <div className="free-badge">
                      <i className="bi bi-gift"></i>
                      Perfect for Starters
                    </div>
                  )}

                  {/* Popular Badge */}
                  {plan.popular && (
                    <div className="popular-badge">
                      <i className="bi bi-star-fill"></i>
                      Most Popular
                    </div>
                  )}

                  {/* Plan Header */}
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

                  {/* Features List */}
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

                  {/* Payment Section for Paid Plans */}
                  {!plan.isFree && (
                    <div className="payment-section">
                      <h4>Choose Payment Method</h4>
                      <div className="payment-methods">
                        {paymentMethods.map((method) => (
                          <motion.button
                            key={method.id}
                            className="payment-method-btn"
                            whileHover={{ 
                              scale: 1.05, 
                              boxShadow: "0 5px 15px rgba(99, 102, 241, 0.3)" 
                            }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleSubscribe(plan, method.id)}
                          >
                            <PaymentIcon method={method} />
                            <span className="payment-name">{method.name}</span>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* CTA Button */}
                  <motion.button
                    className={`subscribe-btn ${plan.popular ? 'popular' : ''} ${plan.isFree ? 'free' : ''}`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      if (plan.isFree) {
                        handleSubscribe(plan);
                      } else if (paymentMethods.length === 1) {
                        handleSubscribe(plan, paymentMethods[0].id);
                      }
                    }}
                  >
                    {plan.isFree ? (
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

                  {/* No Payment Needed for Free Plan */}
                  {plan.isFree && (
                    <div className="no-payment-needed">
                      <i className="bi bi-shield-check"></i>
                      No payment required • Activate instantly
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Guarantee Section */}
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

            {/* Footer */}
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