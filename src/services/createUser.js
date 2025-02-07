// src/services/createUser.js
const admin = require("firebase-admin");

console.log("Starting to create test user..."); // Add this line

const serviceAccount = require("../../config/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const auth = admin.auth();

async function createTestUser() {
  try {
    console.log("Attempting to create user..."); // Add this line for additional logging
    const user = await auth.createUser({
      email: "testuser123@gmail.com", // Change this to a new email
      emailVerified: false,
      password: "Pass123!",
      displayName: "Test User",
      disabled: false,
    });
    console.log("Successfully created new user:", user.uid);
    return user.uid;
  } catch (error) {
    console.error("Error creating new user:", error);
    throw error;
  }
}

// To ensure the function is called, you can call it here or export and call it elsewhere
createTestUser()
  .then((userId) => {
    console.log("User creation process completed with ID:", userId);
  })
  .catch((error) => {
    console.error("Failed to complete user creation:", error);
  });

module.exports = { createTestUser };
