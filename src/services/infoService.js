// Simulated AI service with scripted responses
const qaScript = {
  "what is spectrum ai guide":
    "Spectrum's AI Guide is a tool designed to assist caregivers and users with personalized support for autism-related needs, offering care plans, social stories, and more.",
  "what does this app do":
    "This app provides tools like care plans, social stories, and chat features to support individuals with autism and their caregivers, enhancing daily life and education.",
  "how do i sign up":
    "Click 'Sign Up' below the sign-in form to create an account with your email and password or use Google sign-in.",
  "is this free":
    "The app offers a free tier with limited credits; premium plans (bronze, silver, gold) provide more features and credits.",
  "who can use this":
    "Anyone can sign up, but it’s tailored for caregivers, educators, and professionals supporting individuals with autism.",
};

export const sendToInfoService = async (prompt) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate async response
      const query = prompt.toLowerCase().trim();
      const response =
        qaScript[query] ||
        "Sorry, I can only answer specific questions about Spectrum's AI Guide and the app. Try asking something like 'What is Spectrum AI Guide?'";
      resolve(response);
    }, 500); // 500ms delay to mimic AI latency
  });
};
