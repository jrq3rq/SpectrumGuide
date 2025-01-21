```markdown
autism-support-app/
├── public/
│ ├── favicon.ico # Favicon for the app
│ ├── index.html # Root HTML file
│ ├── logo192.png # Logo assets
│ ├── logo512.png # Logo assets
│ ├── manifest.json # Web app manifest
│ └── 404.html # Custom error page (optional)
├── src/
│ ├── components/
│ │ ├── ChildProfileForm.js # Form for inputting child data
│ │ ├── AIResponseDisplay.js # Displays AI recommendations, saves to local storage
│ │ ├── Header.js # App header/navigation
│ │ └── Footer.js # Footer component
│ ├── styles/
│ │ ├── App.css # General/global styles for the app
│ │ ├── ChildProfileForm.css # Specific styles for the form
│ │ ├── Header.css # Styles for header component
│ │ └── Footer.css # Styles for footer component
│ ├── App.js # Main app component
│ ├── index.js # Entry point
│ ├── index.css # Basic global styles
│ └── pages/ # (Optional) For adding page-level components in the future
│ ├── HomePage.js # Landing page
│ ├── FormPage.js # Page containing the form
│ └── RecommendationsPage.js # Page showing AI recommendations
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
