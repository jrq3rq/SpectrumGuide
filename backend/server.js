// backend/server.js
const express = require("express");
const cors = require("cors");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
require("dotenv").config(); // Load environment variables

const app = express();

// CORS Configuration
app.use(
  cors({
    origin: "http://localhost:3000", // Frontend URL
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(express.json());

// Endpoint to create Payment Intent
app.post("/create-payment-intent", async (req, res) => {
  const { amount, currency, metadata, receipt_email } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      metadata,
      receipt_email,
    });

    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Error creating Payment Intent:", error);
    res.status(500).send({ error: error.message });
  }
});

// Start the server
const PORT = process.env.PORT || 4242;
app.listen(PORT, () => console.log(`Backend server running on port ${PORT}`));
