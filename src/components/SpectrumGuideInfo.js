import React from "react";
import "../styles/SpectrumGuideInfo.css";

const SpectrumGuideInfo = ({ isOpen, toggle }) => {
  return (
    <div className="spectrum-guide-container">
      <button className="toggle-button" onClick={toggle}>
        {isOpen ? "Hide" : "Learn more about Spectrum Guide"}
      </button>

      <div className={`info-content ${isOpen ? "open" : "closed"}`}>
        <div className="info-inner">
          <h2>About Spectrum Guide</h2>
          <p>
            Spectrum Guide is an innovative AI tool designed to support parents,
            caregivers, educators, and professionals in nurturing individuals
            with autism. It provides personalized insights, tailored
            recommendations, and actionable plans to enhance understanding and
            manage daily challenges effectively.
          </p>

          <h3>Our Mission</h3>
          <p>
            At Spectrum Guide, we believe every autistic individual deserves
            personalized support that acknowledges their unique needs,
            strengths, and challenges. Our mission is to empower those involved
            in their care with AI-driven tools, fostering environments where
            everyone can thrive.
          </p>

          <p className="pay-per-use">
            <strong>Pay-Per-Use Model:</strong> Spectrum Guide operates on a
            flexible Pay-Per-Use model, where users purchase credits for
            specific services or features. This model allows you to pay only for
            what you use, making personalized support more accessible and
            cost-effective. Whether you need to update a care plan, generate a
            new social story, or gain insights into behavioral management,
            Spectrum Guide adapts to your needs on demand.
          </p>

          <p className="privacy-security">
            <strong>Designed for Individual Use:</strong> Data with Spectrum
            Guide is stored directly on your device, ensuring privacy but also
            meaning that each account is device-specific. Your data, including
            progress, chat history, and personalized insights, does not transfer
            between devices. For continuity, we recommend using the same device
            for all interactions with Spectrum Guide.
          </p>

          <h3>Our Suite of Features</h3>
          <ul>
            <li>
              <strong>Customized Care Plans:</strong> Tailor daily routines and
              strategies to match individual strengths, sensory preferences, and
              triggers, fostering a supportive environment.
            </li>
            <li>
              <strong>Educational Support:</strong> Develop personalized
              learning approaches or Individualized Education Plans (IEPs) that
              align with communication styles, learning methods, and interests
              for optimal educational outcomes.
            </li>
            <li>
              <strong>Behavioral and Sensory Management:</strong> Address
              sensory sensitivities and behavioral challenges proactively with
              strategies that minimize stress and enhance well-being.
            </li>
            <li>
              <strong>Safety and Emergency Planning:</strong> Manage safety
              risks, wandering behaviors, and allergies to ensure secure
              environments across various settings.
            </li>
            <li>
              <strong>Strength-Based Activities:</strong> Leverage individual
              strengths and interests to boost confidence and encourage
              independence through engaging activities.
            </li>
            <li>
              <strong>Social Stories:</strong> Use AI to create personalized
              narratives that help with social cues, routine management, and
              emotional regulation, making learning both engaging and
              supportive.
            </li>
          </ul>

          <p>
            Spectrum Guide uses AI to turn complex data into practical,
            actionable insights, ensuring personalized support for every
            individual's journey. We continuously update our technology and
            methodologies to meet the evolving needs of the autism community.
          </p>

          <p className="privacy-data-security">
            <strong>Privacy and Data Security:</strong> We prioritize your
            privacy at Spectrum Guide. All data is stored locally on your
            device, not on external servers, ensuring confidentiality and
            control over sensitive information. However, consider these points:
            <ul>
              <li>
                <em>Storage Limitation:</em> You're limited by your device's
                storage capacity. You may need to manage or delete older data to
                accommodate new content.
              </li>
              <li>
                <em>Device Dependency:</em> Data is accessible only on the
                device where it's stored. Losing or changing devices requires
                manual data backup or transfer.
              </li>
              <li>
                <em>No Cloud Sync:</em> Data does not sync across devices, so
                using Spectrum Guide on different devices involves additional
                steps for data management.
              </li>
            </ul>
            We promise not to use external databases for your personal
            interactions, protecting against unauthorized access. Nonetheless,
            always consider a backup strategy for your essential data.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SpectrumGuideInfo;
