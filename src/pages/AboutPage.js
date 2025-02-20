import React from "react";
import "../styles/AboutPage.css"; // Add styles specific to the About page if needed
// import logo from "../assets/puzzle-1020410_640.jpg";

const AboutPage = () => {
  return (
    <div className="about-page">
      {/* <div className="about-logo-container">
        <img src={logo} alt="Spectrum Guide Logo" className="about-logo" />
      </div> */}
      <h1>About Spectrum Guide</h1>
      <p>
        Spectrum Guide is an innovative AI tool designed to support parents,
        caregivers, educators, and professionals in nurturing individuals with
        autism. It provides personalized insights, tailored recommendations, and
        actionable plans to enhance understanding and manage daily challenges
        effectively.
      </p>

      <h2>Our Mission</h2>
      <p>
        At Spectrum Guide, we believe every autistic individual deserves
        personalized support that acknowledges their unique needs, strengths,
        and challenges. Our mission is to empower those involved in their care
        with AI-driven tools, fostering environments where everyone can thrive.
      </p>

      <p className="pay-per-use">
        <strong>Pay-Per-Use Model:</strong> Spectrum Guide operates on a
        flexible Pay-Per-Use model, where users purchase credits for specific
        services or features. This model allows you to pay only for what you
        use, making personalized support more accessible and cost-effective.
        Whether you need to update a care plan, generate a new social story, or
        gain insights into behavioral management, Spectrum Guide adapts to your
        needs on demand.
      </p>

      <p
        style={{
          backgroundColor: "#e3f8ed",
          padding: "10px",
          borderRadius: "8px",
          borderLeft: "4px solid #02a35c",
          // borderTop: "1px solid #02a35c",
          // borderRight: "1px solid #02a35c",
          // borderBottom: "1px solid #02a35c",
          marginBottom: "15px",
        }}
      >
        <strong>Designed for Individual Use:</strong> Data with Spectrum Guide
        is stored directly on your device, ensuring privacy but also meaning
        that each account is device-specific. Your data, including progress,
        chat history, and personalized insights, does not transfer between
        devices. For continuity, we recommend using the same device for all
        interactions with Spectrum Guide.
      </p>

      <p>Our suite of features includes:</p>
      <ul>
        <li>
          <strong>Customized Care Plans:</strong> Tailor daily routines and
          strategies to match individual strengths, sensory preferences, and
          triggers, fostering a supportive environment.
        </li>
        <li>
          <strong>Educational Support:</strong> Develop personalized learning
          approaches or Individualized Education Plans (IEPs) that align with
          communication styles, learning methods, and interests for optimal
          educational outcomes.
        </li>
        <li>
          <strong>Behavioral and Sensory Management:</strong> Address sensory
          sensitivities and behavioral challenges proactively with strategies
          that minimize stress and enhance well-being.
        </li>
        <li>
          <strong>Safety and Emergency Planning:</strong> Manage safety risks,
          wandering behaviors, and allergies to ensure secure environments
          across various settings.
        </li>
        <li>
          <strong>Strength-Based Activities:</strong> Leverage individual
          strengths and interests to boost confidence and encourage independence
          through engaging activities.
        </li>
        <li>
          <strong>Social Stories:</strong> Use AI to create personalized
          narratives that help with social cues, routine management, and
          emotional regulation, making learning both engaging and supportive.
        </li>
      </ul>

      <p>
        <strong>Spectrum Guide</strong> uses AI to turn complex data into
        practical, actionable insights, ensuring personalized support for every
        individual's journey. We continuously update our technology and
        methodologies to meet the evolving needs of the autism community.
      </p>

      <p className="privacy-intro">
        <strong>Privacy and Data Security:</strong> At Spectrum Guide, your
        privacy is our priority. All data is stored{" "}
        <strong>locally on your device</strong>—never on external
        servers—ensuring you maintain full control and confidentiality over
        sensitive information. However, please note the following:
      </p>
      <div className="privacy-notice">
        <ul className="privacy-list">
          <li>
            <strong>
              <em>Storage Limitation:</em>
            </strong>{" "}
            Your device’s storage capacity sets the limit. You might need to
            manage or delete older data to make room for new content.
          </li>
          <li>
            <strong>
              <em>Device Dependency:</em>
            </strong>{" "}
            Data stays on the device where it’s stored. If you lose or switch
            devices, manual backup or transfer is required.
          </li>
          <li>
            <strong>
              <em>No Cloud Sync:</em>
            </strong>{" "}
            Data doesn’t sync across devices, so using Spectrum Guide on
            multiple devices requires extra data management steps.
          </li>
        </ul>
      </div>
      <p className="privacy-footer">
        We have no plans to use external databases for your personal
        interactions, safeguarding against unauthorized access. That said, we
        recommend maintaining a backup strategy for your essential data.
      </p>
    </div>
  );
};

export default AboutPage;
