import React from "react";
import "../styles/About.css"; // Add styles specific to the About page if needed

const About = () => {
  return (
    <div className="about-page">
      <h1>About Spectrum Guide</h1>
      <p>
        Spectrum Guide is an innovative tool designed to support parents and
        caregivers of autistic individuals by providing personalized insights,
        tailored recommendations, and actionable plans through advanced AI
        technology.
      </p>
      <p>
        Our mission is to empower families and caregivers by addressing unique
        needs and fostering growth, safety, and well-being for every individual.
        Spectrum Guide focuses on five core areas:
      </p>
      <ul>
        <li>
          <strong>Customized Care Plans:</strong> Tailor daily routines and care
          strategies to align with individual strengths, sensory preferences,
          and triggers, ensuring a supportive and nurturing environment.
        </li>
        <li>
          <strong>Educational Support:</strong> Develop personalized learning
          approaches or Individualized Education Plans (IEPs) based on preferred
          communication styles, learning methods, and interests to optimize
          educational outcomes.
        </li>
        <li>
          <strong>Behavioral and Sensory Management:</strong> Proactively manage
          sensory sensitivities, challenges, and triggers to reduce stress and
          improve overall well-being.
        </li>
        <li>
          <strong>Safety and Emergency Planning:</strong> Address safety risks,
          wandering behaviors, and allergies to create safe environments at
          home, school, and in public spaces.
        </li>
        <li>
          <strong>Strength-Based Activities:</strong> Highlight strengths and
          special interests to boost confidence, encourage independence, and
          foster enjoyable, meaningful experiences.
        </li>
      </ul>
      <p>
        Spectrum Guide harnesses the power of AI to transform data into
        actionable insights, ensuring every individual receives personalized
        support to thrive in their unique journey.
      </p>
    </div>
  );
};

export default About;
