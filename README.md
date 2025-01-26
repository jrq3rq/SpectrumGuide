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
│ ├── pages/
│ │ ├── About.js # About page
│ │ ├── ChatHistoryDisplay.js
│ │ ├── Payment.js # Payment page
│ │ └── Interactions.js # Page for viewing saved interactions
│ ├── utils/
│ │ └── ScrollToTop.js
│ ├── components/
│ │ ├── MobileSidebar.js
│ │ ├── ChatModal.js # Modal for displaying AI interactions
│ │ ├── Header.js # Header with navigation
│ │ ├── Footer.js # Footer for the app
│ │ └── ChildProfileForm.js # Form for inputting child data
│ ├── services/
│ │ └── aiService.js # AI service for handling API requests
│ ├── styles/
│ │ ├── About.css
│ │ ├── Header.css # Styles for the header
│ │ ├── Footer.css # Styles for the footer
│ │ ├── Interaction.css
│ │ ├── Payment.css
│ │ ├── App.css # General/global styles for the app
│ │ ├── ChildProfileForm.css # Specific styles for the form
│ │ └── ChatModal.css # Specific styles for the chat modal
│ ├── App.js # Main app component
│ ├── index.js # Entry point
│ └── index.css # Basic global styles
├── .env # Environment variables (e.g., AI API keys, Firebase config)
├── .gitignore # Ignored files
├── package.json # Dependencies and scripts
└── README.md # Documentation
```
