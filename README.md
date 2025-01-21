```markdown
autism-support-app/
├── public/
│ ├── index.html # Root HTML file
│ ├── 404.html # Custom error page (optional)
│ └── firebase.json # Firebase Hosting configuration (generated during init)
├── src/
│ ├── components/
│ | ├── AIResponseDisplay.js # Displays AI recommendations, saves to local storage
│ │ ├── ChildProfileForm.js # Form for inputting child data
│ │ ├── AIResponseDisplay.js # Displays AI-generated recommendations
│ │ ├── Header.js # App header/navigation
│ │ └── Footer.js # Footer component
│ ├── pages/
│ │ ├── HomePage.js # Landing page
│ │ ├── FormPage.js # Page containing the form
│ │ └── RecommendationsPage.js # Page showing AI recommendations
│ ├── context/
│ │ └── FormContext.js # Manages form data state globally
│ ├── services/
│ │ ├── firebaseConfig.js # Firebase configuration for frontend
│ │ ├── api.js # Handles API calls to Firebase Functions
│ │ └── aiService.js # Encapsulates AI interaction logic
│ ├── utils/
| │ ├── storageUtils.js # Helper functions for local storage
│ │ └── validation.js # Input validation utilities
│ ├── styles/
│ | ├── App.css # General/global styles for the app
│ │ ├── ChildProfileForm.css # Specific styles for the form
│ │ ├── App.css # Global styles
│ │ ├── Form.css # Styles for the form
│ │ └── Recommendations.css # Styles for AI recommendations
│ ├── App.js # Main app component
│ ├── index.js # Entry point
│ └── index.css # Basic global styles
├── functions/
│ ├── index.js # Entry point for Firebase Cloud Functions
│ ├── aiService.js # Logic for interacting with external AI APIs
│ └── package.json # Dependencies for Cloud Functions
├── firestore.rules # Firestore security rules
├── firestore.indexes.json # Firestore indexes (if needed)
├── firebase.json # Firebase project configuration
├── .firebaserc # Firebase project aliases
├── .env # Environment variables (e.g., AI API keys, Firebase config)
├── .gitignore # Ignored files
├── package.json # Dependencies and scripts
└── README.md # Documentation
```
