```markdown
autism-support-app/
├── backend/
│ ├── server.js # Express server handling Stripe payments
│ ├── package.json # Backend dependencies and scripts
│ ├── .env # Backend environment variables (e.g., STRIPE_SECRET_KEY)
│ └── README.md # Backend-specific documentation (optional)
├── config/
│ └── serviceAccountKey.json # Firebase service account key
├── public/
│ ├── favicon.ico # Favicon for the app
│ ├── index.html # Root HTML file
│ ├── logo192.png # Logo assets
│ ├── logo512.png # Logo assets
│ ├── manifest.json # Web app manifest
│ └── 404.html # Custom error page (optional)
├── src/
│ ├── components/
│ │ ├── StoryActions.js
│ │ ├── Tooltip.js
│ │ ├── ChatModal.js # Modal for displaying AI interactions
│ │ ├── CheckoutForm.js
│ │ ├── ChildProfileForm.js # Form for inputting child data
│ │ ├── Footer.js
│ │ ├── Header.js # Header with navigation
│ │ ├── LoadingOverlay.js
│ │ ├── MobileSidebar.js
│ │ ├── PaymentComponent.js
│ │ ├── TTSRadialControls.jsx
│ │ └── PrivateRoute.js # New file for protecting routes
│ ├── context/
│ │ └── UserContext.js # New file for user context
│ ├── core/
│ │ └── tts-service.js
│ ├── data/
│ │ └── navData.js
│ ├── hooks/
│ │ └── useLocalStorage.js
│ ├── pages/
│ │ ├── CreateProfile.js
│ │ ├── SignIn.js
│ │ ├── SignUp.js
│ │ ├── SocialStories.js
│ │ ├── About.js # About page
│ │ ├── ChatHistoryDisplay.js
│ │ ├── Interactions.js # Page for viewing saved interactions
│ │ └── Payment.js # Payment page
│ ├── services/
│ │ ├── paymentService.js
│ │ └── aiService.js # AI service for handling API requests
│ ├── styles/
│ │ ├── CreateProfile.css
│ │ ├── SignIn.css
│ │ ├── SignUp.css
│ │ ├── About.css
│ │ ├── SocialStories.css
│ │ ├── StoryActions.css
│ │ ├── Header.css # Styles for the header
│ │ ├── Footer.css # Styles for the footer
│ │ ├── Interaction.css
│ │ ├── Payment.css
│ │ ├── App.css # General/global styles for the app
│ │ ├── ChildProfileForm.css # Specific styles for the form
│ │ └── ChatModal.css # Specific styles for the chat modal
├── hooks/
│ │ ├── useBodyScrollLock.js
│ │ └── useLocalStorage.js
│ ├── utils/
│ │ ├── rateLimiter.js
│ │ └── ScrollToTop.js
│ ├── firebase.js # Firebase configuration file
│ ├── App.js # Main app component
│ ├── index.js # Entry point
│ └── index.css # Basic global styles
├── .env # Environment variables (e.g., AI API keys, Firebase config)
├── .gitignore # Ignored files
├── package.json # Dependencies and scripts
└── README.md # Documentation
```

# 🎉 Stripe Subscription Payments Integration

This document explains how to integrate **Stripe subscription payments** into the `autism-support-app` in the simplest and least invasive way. The goal is to add subscription functionality with minimal modifications to the existing codebase while ensuring security and scalability.

---

```plaintext
autism-support-app/
├── backend/
│   ├── server.js                   # Express server handling Stripe subscriptions (MODIFIED)
│   ├── package.json                # Backend dependencies and scripts
│   ├── .env                        # Updated to include STRIPE_SECRET_KEY
│   └── README.md                   # (Optional) Backend documentation
├── src/
│   ├── components/
│   │   ├── PaymentComponent.js      # Stripe Elements integration for subscriptions (MODIFIED)
│   │   ├── CheckoutForm.js          # Handles subscription form submission (MODIFIED)
│   │   └── ...                      # Other UI components (unchanged)
│   ├── pages/
│   │   └── Payment.js               # Payment page ensuring authenticated users subscribe (MODIFIED)
│   ├── services/
│   │   └── paymentService.js        # New file: Handles subscription status checks and API calls
│   ├── App.js                       # Modified to track and display subscription status
│   └── ...                          # Other source files and assets
├── .env                             # Frontend environment variables (includes REACT_APP_STRIPE_PUBLISHABLE_KEY)
├── .gitignore                       # Ignored files
├── package.json                     # Project dependencies and scripts
└── README.md                        # General project documentation
```

# Revised Pricing Strategy for AI Feature Usage

## Overview

This document outlines a revised pricing strategy for managing AI feature interactions via a credit system across Free, Silver, and Gold plans. The aim is to simplify the credit system, ensure fairness, enhance user understanding, and improve retention and engagement.

## Credit System Simplification

- **Uniform Credit Value**: Across all plans, 1 credit is equivalent to:
  - 1 Custom Care Plan
  - 1 Custom Story
  - 10 AI Chat messages

This consistency across all features simplifies the understanding for users.

## Plan Details

### Free Account

- **Allocation**: 1 credit per week.
- **Usage Breakdown**:
  - **Custom Care Plan**: 1 credit
  - **Custom Story**: 1 credit
  - **AI Chats**: 10 messages per credit

**Credit Regeneration**: After using the credit, a timer starts for a week. Once the week passes, the credit regenerates if the previous credit was fully used. If not used, it doesn't regenerate until the existing credit is consumed.

### Bronze Plan

- **Allocation**: 10 credits for $9.95.
- **Usage Breakdown**:
  - **Custom Care Plans**: 10 plans
  - **Custom Stories**: 10 stories
  - **AI Chat Messages**: 100 messages (10 credits x 10 messages per credit)

### Silver Tier (Optional)

- **Allocation**: 25 credits for $19.95.
- **Usage Breakdown**:
  - **Custom Care Plans**: 25 plans
  - **Custom Stories**: 25 stories
  - **AI Chat Messages**: 250 messages (25 credits x 10 messages per credit)

### Gold Plan

- **Allocation**: 50 credits for $29.95.
- **Usage Breakdown**:
  - **Custom Care Plans**: 50 plans
  - **Custom Stories**: 50 stories
  - **AI Chat Messages**: 500 messages (50 credits x 10 messages per credit)

## Additional Recommendations

- **Value Perception**: By setting a clear value for each credit, users will have a better understanding of what they receive for their investment, enhancing perceived value.

- **Fairness in Scaling**: The scaling from Free to Silver to Gold, with an optional middle tier, ensures users feel the upgrade is fair and proportional.

- **Monetization Strategy**: Offer additional credit bundles or add-ons for specific features at a discounted rate to encourage balanced usage of all features.

- **User Retention**: Implement a feature where users can convert unused AI chat credits into Care Plans or Stories at a 1:1 ratio once a month, providing flexibility and encouraging continued use.

- **Market Positioning**: Regularly review competitor pricing to ensure your service remains competitive. Adjust offerings if necessary or introduce promotional offers.

- **Psychological Pricing**: Pricing at $9.95, $19.95, and $29.95 leverages psychological pricing to make the cost feel more appealing.

- **Clear Communication**: Ensure the UI clearly explains how credits are used for each feature, possibly with visual aids or tooltips for clarity.

- **User Feedback**: Establish a mechanism for users to provide feedback on pricing and value, using this to refine the strategy over time.

- **A/B Testing**: Before implementing changes, consider A/B testing different pricing structures with small user groups to gauge effectiveness.

## Conclusion

This revised strategy aims to balance simplicity, fairness, user engagement, and revenue potential. It ensures that even Free account users feel valued by providing meaningful interaction with AI features, encouraging potential upgrades to paid plans. The clear, consistent credit system across all plans should enhance user understanding and satisfaction.
