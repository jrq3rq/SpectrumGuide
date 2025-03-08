```markdown
autism-support-app/ # Root directory of the autism support application
├── backend/ # Backend-related files for server-side logic
│ ├── server.js # Express server handling Stripe payments and API routes
│ ├── package.json # Backend dependencies (e.g., Express, Stripe) and scripts
│ ├── .env # Backend environment variables (e.g., STRIPE_SECRET_KEY, PORT)
│ └── README.md # Optional backend-specific setup and usage instructions
├── config/ # Configuration files for external services
│ └── serviceAccountKey.json # Firebase service account key for admin SDK access
├── public/ # Static assets served to the browser
│ ├── favicon.ico # Icon displayed in browser tabs
│ ├── index.html # Root HTML file with app mounting point
│ ├── logo192.png # 192x192 logo for PWA (Progressive Web App) support
│ ├── logo512.png # 512x512 logo for PWA splash screens
│ ├── manifest.json # Web app manifest for PWA features (e.g., app name, icons)
│ └── 404.html # Optional custom 404 error page for invalid routes
├── src/ # Source code for the frontend application
│ ├── components/ # Reusable React components
│ │ ├── InfoModal.js
│ │ ├── FloatingInfoBot.js
│ │ ├── StoryActions.js # Component for story-related actions (e.g., save, share)
│ │ ├── Tooltip.js # Component for displaying tooltips
│ │ ├── ChatModal.js # Modal for displaying AI chat interactions
│ │ ├── CheckoutForm.js # Form for processing payments via Stripe
│ │ ├── ChildProfileForm.js # Form for inputting child data to create custom care plans
│ │ ├── Footer.js # Footer component with links or info
│ │ ├── Header.js # Header with navigation links or branding
│ │ ├── LoadingOverlay.js # Overlay for loading states across the app
│ │ ├── MobileSidebar.js # Sidebar navigation for mobile devices
│ │ ├── PaymentComponent.js # Component for payment-related UI
│ │ ├── TTSRadialControls.jsx # Radial controls for text-to-speech (TTS) functionality
│ │ ├── PublicRoute.js # Route wrapper for public-access pages
│ │ └── PrivateRoute.js # Route wrapper for authenticated users only
│ ├── context/ # React context for state management
│ │ └── UserContext.js # Context for managing user authentication state
│ ├── core/ # Core logic or utilities
│ │ └── tts-service.js # Service for text-to-speech functionality
│ ├── data/ # Static data files
│ │ └── navData.js # Data for navigation links or menu items
│ ├── hooks/ # Custom React hooks
│ │ ├── useCreditTracker.js # Hook to track user credits (e.g., for AI usage)
│ │ ├── useLocalStorage.js # Hook to manage data in local storage
│ │ └── useBodyScrollLock.js # Hook to lock body scroll (e.g., for modals)
│ ├── pages/ # Page-level components for routing
│ │ ├── CreateProfile.js # Page for creating a user or child profile
│ │ ├── SignIn.js # Sign-in page for user authentication
│ │ ├── SignUp.js # Sign-up page for new user registration
│ │ ├── SocialStories.js # Page to generate custom social stories
│ │ ├── AboutPage.js # Informational page about the app
│ │ ├── ChatHistoryDisplay.js # Page to view past AI chat interactions
│ │ ├── Interactions.js # Page for viewing saved user interactions
│ │ └── Payment.js # Page for handling payment flows
│ ├── services/ # API or external service integrations
│ │ ├── paymentService.js # Logic for payment processing (e.g., Stripe API calls)
│ │ └── aiService.js # Logic for AI API requests (e.g., generating stories)
│ ├── styles/ # CSS files for styling components
│ │ ├── InfoModal.css
│ │ ├── FloatingInfoBot.css
│ │ ├── CreateProfile.css # Styles for the CreateProfile page
│ │ ├── SignIn.css # Styles for the SignIn page
│ │ ├── SignUp.css # Styles for the SignUp page
│ │ ├── AboutPage.css # Styles for the AboutPage
│ │ ├── SocialStories.css # Styles for the SocialStories page
│ │ ├── StoryActions.css # Styles for story action buttons/components
│ │ ├── Header.css # Styles for the Header component
│ │ ├── Footer.css # Styles for the Footer component
│ │ ├── Interaction.css # Styles for the Interactions page
│ │ ├── Payment.css # Styles for the Payment page
│ │ ├── App.css # Global styles applied across the app
│ │ ├── ChildProfileForm.css # Styles specific to the ChildProfileForm component
│ │ └── ChatModal.css # Styles specific to the ChatModal component
│ ├── utils/ # Utility functions
│ │ ├── rateLimiter.js # Function to limit API request frequency
│ │ └── ScrollToTop.js # Utility to scroll to top on route change
│ ├── App.js # Main app component with routing and layout
│ ├── firebase.js # Firebase configuration and initialization
│ ├── index.js # Entry point for React app rendering
│ └── index.css # Basic global CSS (e.g., resets, typography)
├── firestore.rules # Security rules for Firestore database
├── .env # Frontend environment variables (e.g., Firebase config, AI API keys)
├── .gitignore # Files and directories to ignore in Git (e.g., node_modules)
├── package.json # Frontend dependencies (e.g., React, Firebase) and scripts
└── README.md # Project overview, setup instructions, and documentation
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
