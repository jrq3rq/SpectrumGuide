import React from "react";

const SpectrumGuideInfo = ({ isOpen, toggle }) => {
  return (
    <div
      style={{
        width: "100%",
        padding: "10px",
        borderRadius: "8px",
        backgroundColor: "#ffffff",
        fontFamily: "Arial, sans-serif",
        color: "#333",
        border: "1px solid #c3c3c3",
      }}
    >
      <button
        onClick={toggle}
        style={{
          display: "block",
          width: "100%",
          padding: "10px",
          backgroundColor: "#02C7EB",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          fontSize: "14px",
        }}
      >
        {isOpen ? "Hide" : "Learn more about Spectrum Guide"}
      </button>

      <div
        style={{
          maxHeight: isOpen ? "1000px" : "0px", // Increased max height for more content
          overflowY: "auto", // Allows scrolling if content exceeds max height
          transition: "max-height 0.4s ease-in-out",
          marginTop: isOpen ? "15px" : "0px",
          opacity: isOpen ? 1 : 0,
          transition: "opacity 0.3s ease-in-out, max-height 0.4s ease-in-out",
        }}
      >
        <div
          style={{
            padding: "15px",
            backgroundColor: "transparent",
            // backgroundColor: "#F4F4F9",
            borderRadius: "5px",
            border: "1px solid #ddd",
          }}
        >
          <h2
            style={{
              color: "#02C7EB",
              marginBottom: "10px",
            }}
          >
            About Spectrum Guide
          </h2>
          <p>
            Spectrum Guide is an innovative tool designed to support parents,
            caregivers, educators, and professionals who work with autistic
            individuals. By leveraging advanced AI technology, Spectrum Guide
            offers personalized insights, tailored recommendations, and
            actionable plans to meet the unique needs of each person. Our aim is
            to enhance understanding, manage daily challenges, and promote a
            fulfilling life for those on the autism spectrum.
          </p>

          <p
            style={{
              backgroundColor: "#e3f2fd",
              padding: "10px",
              borderRadius: "5px",
              borderLeft: "4px solid #02C7EB",
              marginBottom: "15px",
            }}
          >
            <strong>Pay-Per-Use Model:</strong> Spectrum Guide is available
            through a flexible Pay-Per-Use model, allowing users to purchase
            credits for specific services or features. This approach gives you
            control over your spending, ensuring you only pay for what you use.
            Whether you need to create a customized behavior strategy, develop
            an IEP, or generate a social story, you can tailor your usage to
            your immediate needs without committing to a full subscription.
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
            stored <strong>locally on your device</strong>, not on external
            servers. This approach ensures that your personal data and the
            sensitive details of your loved ones' lives remain confidential and
            under your control. However, please note:
            <ul style={{ margin: "5px 0px 0px 20px", padding: "0" }}>
              <li>
                <em>Storage Limitation:</em> Local storage has capacity
                constraints. If you exceed these limits, you might need to
                manage or delete older data to make room for new information.
              </li>
              <li>
                <em>Device Dependency:</em> Your data is only accessible on the
                device where it's stored. If you lose or change devices, you'll
                need to manually back up or transfer your data to maintain
                access.
              </li>
              <li>
                <em>No Cloud Sync:</em> Without cloud storage, your data won't
                automatically sync across multiple devices, which means you'll
                need to take extra steps if you use Spectrum Guide on different
                devices.
              </li>
            </ul>
            We commit to not using external databases for storing these personal
            interactions, safeguarding your information against unauthorized
            access. However, always ensure you have a backup strategy for your
            critical data.
          </p>

          <p style={{ marginBottom: "15px" }}>
            Our mission extends beyond just providing tools; we aim to empower
            families and caregivers by focusing on five core areas:
          </p>

          <ul style={{ marginLeft: "20px", marginBottom: "15px" }}>
            <li>
              <strong>Customized Care Plans:</strong> Our AI helps in crafting
              care plans that are bespoke to each individual's strengths,
              sensory preferences, and specific triggers. This ensures a
              nurturing environment where everyone can thrive.
            </li>
            <li>
              <strong>Educational Support:</strong> From developing
              Individualized Education Plans (IEPs) to suggesting educational
              methods that suit different learning styles, Spectrum Guide aids
              in optimizing educational outcomes for autistic individuals.
            </li>
            <li>
              <strong>Behavioral and Sensory Management:</strong> By
              understanding and predicting sensory sensitivities and behavioral
              triggers, we offer strategies to manage these effectively,
              reducing stress and enhancing well-being.
            </li>
            <li>
              <strong>Safety and Emergency Planning:</strong> We provide
              guidance on addressing safety concerns, managing wandering
              tendencies, and dealing with allergies, ensuring safer
              environments in various settings like home, school, or public
              places.
            </li>
            <li>
              <strong>Strength-Based Activities:</strong> By focusing on
              individual strengths and interests, we help in planning activities
              that not only engage but also empower, building confidence and
              independence.
            </li>
            <li>
              <strong>Social Stories:</strong> Through AI-generated stories, we
              assist in teaching social cues, managing routines, and improving
              emotional regulation, tailored to each individual's needs for a
              more engaging and supportive learning experience.
            </li>
          </ul>

          <p>
            Spectrum Guide harnesses the power of AI to transform complex data
            into simple, actionable insights, ensuring that every person with
            autism can navigate their unique journey with the support they need
            to succeed.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SpectrumGuideInfo;
