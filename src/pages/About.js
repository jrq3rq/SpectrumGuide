import React from "react";
import "../styles/About.css"; // Add styles specific to the About page if needed
// import logo from "../assets/puzzle-1020410_640.jpg";

const About = () => {
  return (
    <div className="about-page">
      {/* <div className="about-logo-container">
        <img src={logo} alt="Spectrum Guide Logo" className="about-logo" />
      </div> */}
      <h1>About Spectrum Guide</h1>
      <p>
        Spectrum Guide is an innovative tool designed to support parents and
        caregivers of autistic individuals by providing personalized insights,
        tailored recommendations, and actionable plans through advanced AI
        technology.
      </p>
      <h2>Our Mission</h2>
      <p>
        We believe every individual deserves customized support that recognizes
        their unique needs, strengths, and challenges. Spectrum Guide empowers
        families, educators, and therapists with AI-driven tools to create
        supportive, growth-oriented environments.
      </p>
      <p className="pay-per-use">
        <strong>Pay-Per-Use Model:</strong> Spectrum Guide is available through
        a flexible Pay-Per-Use model, allowing users to purchase credits for
        specific services or features. This model provides the freedom to use
        only what you need when you need it, making personalized support
        accessible and cost-effective for families and professionals alike.
        Whether you require an update to a care plan, need to generate a new
        social story, or want insights into behavioral management, you can
        utilize Spectrum Guide’s advanced features on a per-use basis.
      </p>
      <p
        style={{
          backgroundColor: "#e3f8ed",
          padding: "10px",
          borderRadius: "5px",
          borderLeft: "4px solid #02a35c",
          marginBottom: "15px",
        }}
      >
        <strong>Designed for Individual Use:</strong> Because Spectrum Guide
        stores data directly on your device, each account is linked to a single
        device. This means user progress, chat history, and personalized
        insights cannot be transferred between devices. To ensure seamless
        access to tailored support, we recommend using the same device for all
        Spectrum Guide interactions.
      </p>
      <p
        style={{
          backgroundColor: "#ffebee",
          padding: "10px",
          borderRadius: "5px",
          borderLeft: "4px solid #d32f2f",
          marginBottom: "15px",
        }}
      >
        <strong>Privacy and Data Security:</strong> At Spectrum Guide, we
        prioritize your privacy. All chat history and generated stories are
        stored locally on your device, not on external servers. This ensures
        that your personal data and the sensitive details of your loved ones'
        lives remain confidential and under your control. We commit to not using
        external databases for storing these personal interactions, safeguarding
        your information against unauthorized access.
      </p>

      <p>
        Spectrum Guide offers a comprehensive suite of features tailored to
        support individuals with autism. Our <b>Customized Care Plans</b> allow
        for the tailoring of daily routines and care strategies to match each
        person's unique strengths, sensory preferences, and specific triggers,
        creating a nurturing and supportive environment. With{" "}
        <b>Educational Support</b>, we help develop personalized learning
        approaches or Individualized Education Plans (IEPs) that are designed
        based on an individual's preferred communication styles, learning
        methods, and interests, aiming to optimize educational outcomes.
      </p>
      <p>
        In terms of <b>Behavioral and Sensory Management</b>, we focus on
        proactively addressing sensory sensitivities and behavioral challenges,
        employing strategies that help reduce stress and enhance overall
        well-being. Our commitment to <b>Safety and Emergency Planning</b>{" "}
        involves taking measures to manage safety risks, wandering behaviors,
        and allergies, ensuring that environments like home, school, and public
        spaces are secure for autistic individuals.
      </p>
      <p>
        We also emphasize <b>Strength-Based Activities</b>, where we highlight
        and leverage each individual's strengths and special interests to not
        only boost their confidence but also to encourage independence through
        activities that are both enjoyable and meaningful. Finally,{" "}
        <b>Social Stories</b> are generated using AI technology to provide
        personalized narratives that aid in navigating social situations,
        understanding routines, and managing emotional regulation in a way
        that's both engaging and supportive. This holistic approach ensures that
        each aspect of life for individuals with autism is addressed with care
        and precision.
      </p>
      <p>
        Spectrum Guide harnesses the power of AI to transform data into
        actionable insights, ensuring every individual receives personalized
        support to thrive in their unique journey.
      </p>
    </div>
  );
};

export default About;
