// import React, { useState, useRef, useEffect } from "react";
// import { Link } from "react-router-dom"; // Import Link for navigation
// import { FaBookOpen, FaHistory, FaRobot, FaChevronDown } from "react-icons/fa"; // Import FaChevronDown
// import "../styles/AboutPage.css"; // Use or update styles specific to the About page

// const AboutPage = () => {
//   // State to control dropdown visibility
//   const [isImprovementsOpen, setIsImprovementsOpen] = useState(false);
//   const [isSymptomsOpen, setIsSymptomsOpen] = useState(false);

//   // Refs to measure content height
//   const improvementsRef = useRef(null);
//   const symptomsRef = useRef(null);

//   // Set max-height dynamically based on content
//   const [improvementsHeight, setImprovementsHeight] = useState(0);
//   const [symptomsHeight, setSymptomsHeight] = useState(0);

//   useEffect(() => {
//     if (isImprovementsOpen && improvementsRef.current) {
//       setImprovementsHeight(improvementsRef.current.scrollHeight);
//     } else {
//       setImprovementsHeight(0);
//     }
//   }, [isImprovementsOpen]);

//   useEffect(() => {
//     if (isSymptomsOpen && symptomsRef.current) {
//       setSymptomsHeight(symptomsRef.current.scrollHeight);
//     } else {
//       setSymptomsHeight(0);
//     }
//   }, [isSymptomsOpen]);

//   return (
//     <>
//       <div className="navigation-section-page">
//         <div className="navigation-section">
//           <div className="button-grid">
//             {/* Care Plan Button */}
//             <Link
//               to="/form"
//               className="nav-button"
//               onClick={(e) => {
//                 console.log("Clicked Care Plan link to /form");
//                 // No authentication check here; handled by PrivateRoute
//               }}
//             >
//               <FaRobot size={40} color="#00c7eb" />
//               <span>Care Plan</span>
//               <p>Create personalized AI care plans via a profile form.</p>
//             </Link>

//             {/* Custom Stories Button */}
//             <Link
//               to="/social-stories"
//               className="nav-button"
//               onClick={(e) => {
//                 console.log("Clicked Custom Stories link to /social-stories");
//                 // No authentication check here; handled by PrivateRoute
//               }}
//             >
//               <FaBookOpen size={40} color="#00c7eb" />
//               <span>Custom Stories</span>
//               <p>Craft personalized stories for skills and scenarios.</p>
//             </Link>

//             {/* Care Plan History Button */}
//           </div>
//         </div>
//       </div>

//       <div className="about-page">
//         <div className="about-content">
//           {/* <h1>About Spectrum's AI Guide</h1> */}
//           <p>
//             <b
//               style={{
//                 color: "#00c7eb",
//               }}
//             >
//               Spectrum's Guide
//             </b>{" "}
//             is an innovative AI tool designed to support parents, caregivers,
//             educators, and professionals in nurturing individuals with autism.
//             It provides personalized insights, tailored recommendations, and
//             actionable plans to enhance understanding and manage daily
//             challenges effectively.
//           </p>

//           <h2>Our Mission</h2>
//           <p>
//             At Spectrum's Guide, we believe every autistic individual deserves
//             personalized support that acknowledges their unique needs,
//             strengths, and challenges. Our mission is to empower those involved
//             in their care with AI-driven tools, fostering environments where
//             everyone can thrive.
//           </p>

//           <p className="pay-per-use">
//             <strong>Pay-Per-Use Model:</strong> Spectrum's Guide operates on a
//             flexible Pay-Per-Use model, where users purchase credits for
//             specific services or features. This model allows you to pay only for
//             what you use, making personalized support more accessible and
//             cost-effective. Whether you need to update a care plan, generate a
//             new social story, or gain insights into behavioral management,
//             Spectrum's Guide adapts to your needs on demand.
//           </p>

//           <p
//             style={{
//               backgroundColor: "#e3f8ed",
//               padding: "10px",
//               borderRadius: "8px",
//               borderLeft: "4px solid #02a35c",
//               marginBottom: "15px",
//             }}
//           >
//             <strong>Designed for Individual Use:</strong> Data with Spectrum's
//             Guide is stored directly on your device, ensuring privacy but also
//             meaning that each account is device-specific. Your data, including
//             progress, chat history, and personalized insights, does not transfer
//             between devices. For continuity, we recommend using the same device
//             for all interactions with Spectrum's Guide.
//           </p>

//           <p>Our suite of features includes:</p>
//           <ul>
//             <li>
//               <strong>Customized Care Plans:</strong> Tailor daily routines and
//               strategies to match individual strengths, sensory preferences, and
//               triggers, fostering a supportive environment.
//             </li>
//             <li>
//               <strong>Educational Support:</strong> Develop personalized
//               learning approaches or Individualized Education Plans (IEPs) that
//               align with communication styles, learning methods, and interests
//               for optimal educational outcomes.
//             </li>
//             <li>
//               <strong>Behavioral and Sensory Management:</strong> Address
//               sensory sensitivities and behavioral challenges proactively with
//               strategies that minimize stress and enhance well-being.
//             </li>
//             <li>
//               <strong>Safety and Emergency Planning:</strong> Manage safety
//               risks, wandering behaviors, and allergies to ensure secure
//               environments across various settings.
//             </li>
//             <li>
//               <strong>Strength-Based Activities:</strong> Leverage individual
//               strengths and interests to boost confidence and encourage
//               independence through engaging activities.
//             </li>
//             <li>
//               <strong>Social Stories:</strong> Use AI to create personalized
//               narratives that help with social cues, routine management, and
//               emotional regulation, making learning both engaging and
//               supportive.
//             </li>
//           </ul>

//           <p>
//             <strong>Spectrum's Guide</strong> uses AI to turn complex data into
//             practical, actionable insights, ensuring personalized support for
//             every individual's journey. We continuously update our technology
//             and methodologies to meet the evolving needs of the autism
//             community.
//           </p>

//           <p className="privacy-intro">
//             <strong>Privacy and Data Security:</strong> At Spectrum's Guide,
//             your privacy is our priority. All data is stored{" "}
//             <strong>locally on your device</strong>—never on external
//             servers—ensuring you maintain full control and confidentiality over
//             sensitive information. However, please note the following:
//           </p>
//           <div className="privacy-notice">
//             <ul className="privacy-list">
//               <li>
//                 <strong>
//                   <em>Storage Limitation:</em>
//                 </strong>{" "}
//                 Your device’s storage capacity sets the limit. You might need to
//                 manage or delete older data to make room for new content.
//               </li>
//               <li>
//                 <strong>
//                   <em>Device Dependency:</em>
//                 </strong>{" "}
//                 Data stays on the device where it’s stored. If you lose or
//                 switch devices, manual backup or transfer is required.
//               </li>
//               <li>
//                 <strong>
//                   <em>No Cloud Sync:</em>
//                 </strong>{" "}
//                 Data doesn’t sync across devices, so using Spectrum's Guide on
//                 multiple devices requires extra data management steps.
//               </li>
//             </ul>
//           </div>
//           <p className="privacy-footer">
//             We have no plans to use external databases for your personal
//             interactions, safeguarding against unauthorized access. That said,
//             we recommend maintaining a backup strategy for your essential data.
//           </p>

//           {/* Proposed Improvements Dropdown */}
//           <p
//             className="expandable-section"
//             onClick={() => setIsImprovementsOpen(!isImprovementsOpen)}
//           >
//             Proposed Improvements
//             <FaChevronDown
//               className={`expand-icon ${isImprovementsOpen ? "open" : ""}`}
//               size={20}
//             />
//           </p>
//           <div
//             className={`expandable-content ${isImprovementsOpen ? "open" : ""}`}
//             style={{ maxHeight: `${improvementsHeight}px` }}
//             ref={improvementsRef}
//           >
//             <ul className="proposed-improvements">
//               <li>
//                 <b>Predictive Behavioral Forecasting</b> – Turns reactivity into
//                 prevention. Enhance Spectrum Guide’s behavioral and sensory
//                 management with real-time pattern analysis and proactive alerts
//                 to anticipate needs.
//               </li>
//               <li>
//                 <b>Non-Verbal Communication Interpretation</b> – Unlocks
//                 understanding for non-verbal individuals. Integrate voice and
//                 gesture recognition into Spectrum Guide’s AI suite to provide
//                 real-time communication support for non-verbal users.
//               </li>
//               <li>
//                 <b>Sensory Environment Optimization</b> – Directly tackles a
//                 near-universal need. Connect Spectrum Guide’s sensory management
//                 capabilities to external devices for automated environmental
//                 adjustments tailored to user preferences.
//               </li>
//               <li>
//                 <b>Long-Term Skill Development Tracking</b> – Bridges childhood
//                 to independence. Upgrade Spectrum Guide’s data tracking into a
//                 comprehensive, long-term development dashboard to monitor
//                 progress over time.
//               </li>
//               <li>
//                 <b>Social Relationship Building</b> – Fosters lasting
//                 connections. Expand Spectrum Guide’s social stories feature into
//                 a dynamic social simulation or peer-matching tool to foster
//                 relationship development.
//               </li>
//               <li>
//                 <b>Mental Health Monitoring</b> – Addresses a hidden crisis.
//                 Incorporate mental health analytics into Spectrum Guide’s AI,
//                 linking it with behavioral data for holistic well-being
//                 insights.
//               </li>
//               <li>
//                 <b>Transition Support</b> – Prepares for adulthood. Adapt
//                 Spectrum Guide’s Individualized Education Plans (IEPs) into
//                 frameworks that support transitions into adulthood, such as
//                 school-to-work pathways.
//               </li>
//             </ul>
//           </div>
//           {/* Symptoms and Dualities Dropdown */}
//           <p
//             className="expandable-section"
//             onClick={() => setIsSymptomsOpen(!isSymptomsOpen)}
//           >
//             List of Autism Symptoms and Their Dualities, Ranked by Commonality
//             <FaChevronDown
//               className={`expand-icon ${isSymptomsOpen ? "open" : ""}`}
//               size={20}
//             />
//           </p>
//           <div
//             className={`expandable-content ${isSymptomsOpen ? "open" : ""}`}
//             style={{ maxHeight: `${symptomsHeight}px` }}
//             ref={symptomsRef}
//           >
//             <ul className="proposed-improvements">
//               <li>
//                 <b>Social Interaction Difficulties</b> – Trouble with social
//                 cues, eye contact, reciprocity, or forming relationships
//                 (affects ~90% of autistic individuals, per CDC). <b>Duality:</b>{" "}
//                 Interactive Social Simulations – Use AI-driven virtual or
//                 augmented reality (e.g., avatars or AR overlays) to practice
//                 social scenarios in a safe, controlled way, building confidence
//                 and skills. Directly counters isolation by providing structured,
//                 repeatable social exposure.
//               </li>
//               <li>
//                 <b>Sensory Sensitivities (Hyper- or Hyposensitivity)</b> – Over-
//                 or under-reaction to sounds, lights, textures, etc. (affects
//                 ~80–90%, per Sensory Processing Disorder research).{" "}
//                 <b>Duality:</b> Adaptive Environmental Control – AI-integrated
//                 wearables or smart home systems adjust sensory inputs (e.g., dim
//                 lights, reduce noise) in real-time based on detected distress.
//                 Balances sensory overload or under-stimulation with tailored
//                 environmental responses.
//               </li>
//               <li>
//                 <b>Repetitive Behaviors or Restricted Interests</b> – Repetitive
//                 movements (e.g., hand-flapping) or intense focus on specific
//                 topics (affects ~70–80%, per DSM-5 studies). <b>Duality:</b>{" "}
//                 Strength-Based Redirection – Channel these behaviors into
//                 productive outlets (e.g., a repetitive hand motion becomes a
//                 game controller input; a train obsession fuels a coding
//                 project). Transforms rigidity into creative or functional
//                 engagement.
//               </li>
//               <li>
//                 <b>Communication Challenges (Verbal or Non-Verbal)</b> – Delayed
//                 speech, echolalia, or complete non-verbal status (affects
//                 ~60–70%, with 25–30% minimally verbal, per CDC). <b>Duality:</b>{" "}
//                 Sound and Gesture Interpretation – AI uses sound therapy (e.g.,
//                 musical cues) or gesture recognition to translate non-verbal
//                 signals into communication, enhancing expression. Counters
//                 silence or repetition with alternative, meaningful output.
//               </li>
//               <li>
//                 <b>Difficulty with Change or Transitions</b> – Resistance to
//                 routine changes or new environments (affects ~50–60%, per
//                 clinical observations). <b>Duality:</b> Predictive Transition
//                 Coaching – AI forecasts upcoming changes (e.g., school to home)
//                 and provides gradual, visual, or auditory prep (e.g., a
//                 countdown with calming tones). Eases rigidity by preempting and
//                 smoothing disruptions.
//               </li>
//               <li>
//                 <b>Emotional Regulation Issues</b> – Meltdowns, anxiety, or
//                 difficulty managing emotions (affects ~40–50%, with higher rates
//                 in co-occurring conditions, per NIH). <b>Duality:</b> Real-Time
//                 Emotional Feedback – AI via wearables detects stress (e.g.,
//                 heart rate spikes) and offers instant calming strategies (e.g.,
//                 breathing exercises via haptic feedback). Stabilizes volatility
//                 with immediate, personalized support.
//               </li>
//               <li>
//                 <b>Executive Functioning Deficits</b> – Trouble with planning,
//                 organizing, or completing tasks (affects ~30–50%, per autism
//                 research). <b>Duality:</b> Task Decomposition AI – Breaks goals
//                 into micro-steps with visual or auditory prompts (e.g., “Put on
//                 socks” → “Find socks”), adapting to the individual’s pace.
//                 Simplifies complexity with structured guidance.
//               </li>
//               <li>
//                 <b>Motor Skill Challenges</b> – Fine or gross motor difficulties
//                 (e.g., handwriting, coordination) (affects ~20–40%, per studies
//                 like Jaswal & Akhtar, 2019). <b>Duality:</b> Motion-Enhancing
//                 Interfaces – AI-driven tools (e.g., adaptive styluses or
//                 gamified exercises) guide and strengthen motor actions through
//                 real-time feedback. Counters physical limitations with
//                 assistive, engaging tech.
//               </li>
//               <li>
//                 <b>Cognitive Processing Variability</b> – Uneven skills (e.g.,
//                 advanced math but poor verbal reasoning) (affects ~20–30%, per
//                 splinter skills research). <b>Duality:</b> Adaptive Learning
//                 Pathways – AI tailors education to leverage strengths (e.g.,
//                 visual math puzzles) while scaffolding weaknesses (e.g., verbal
//                 games). Balances uneven abilities with customized growth.
//               </li>
//               <li>
//                 <b>Co-occurring Conditions (e.g., Anxiety, ADHD)</b> –
//                 Additional mental health or attention issues (affects ~10–40%,
//                 per NIH comorbidity data). <b>Duality:</b> Integrated Symptom
//                 Monitoring – AI tracks overlapping symptoms (e.g., restlessness
//                 from ADHD) and adjusts strategies (e.g., fidget prompts for
//                 focus). Addresses complexity by harmonizing support across
//                 conditions.
//               </li>
//             </ul>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default AboutPage;
import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaBookOpen,
  FaHistory,
  FaRobot,
  FaChevronDown,
  FaBook,
} from "react-icons/fa";
import "../styles/AboutPage.css";

const AboutPage = () => {
  const [isImprovementsOpen, setIsImprovementsOpen] = useState(false);
  const improvementsRef = useRef(null);
  const [improvementsHeight, setImprovementsHeight] = useState(0);

  useEffect(() => {
    if (isImprovementsOpen && improvementsRef.current) {
      setImprovementsHeight(improvementsRef.current.scrollHeight);
    } else {
      setImprovementsHeight(0);
    }
  }, [isImprovementsOpen]);

  return (
    <>
      <div className="navigation-section-page">
        <div className="navigation-section">
          <div className="button-grid">
            <Link
              to="/form"
              className="nav-button"
              onClick={(e) => {
                console.log("Clicked Care Plan link to /form");
              }}
            >
              <FaRobot size={40} color="#00c7eb" />
              <span>Care Plan</span>
              <p>Create personalized AI care plans via a profile form.</p>
            </Link>
            <Link
              to="/social-stories"
              className="nav-button"
              onClick={(e) => {
                console.log("Clicked Custom Stories link to /social-stories");
              }}
            >
              <FaBookOpen size={40} color="#00c7eb" />
              <span>Custom Stories</span>
              <p>Craft personalized stories for skills and scenarios.</p>
            </Link>
            <Link
              to="/pecs-board"
              className="nav-button"
              onClick={(e) => {
                console.log("Clicked PECS Board link to /pecs-board");
              }}
            >
              <FaBook size={40} color="#00c7eb" />
              <span>PECS Boards</span>
              <p>Create and upload custom PECS boards for visual support.</p>
            </Link>
          </div>
        </div>
      </div>

      <div className="about-page">
        <div className="about-content">
          <p>
            <b style={{ color: "#00c7eb" }}>Spectrum's Guide</b> is an AI tool
            designed to support parents, caregivers, educators, and
            professionals in understanding autism. It provides personalized
            insights, tailored suggestions, and educational plans to help
            caregivers support daily life in a non-medical way.
          </p>

          <h2>Our Mission</h2>
          <p>
            At Spectrum's Guide, we believe every autistic individual deserves
            personalized support that acknowledges their unique needs,
            strengths, and challenges. Our mission is to empower caregivers with
            AI-driven educational tools, fostering environments where everyone
            can thrive.
          </p>

          <p className="pay-per-use">
            <strong>Pay-Per-Use Model:</strong> Spectrum's Guide operates on a
            flexible Pay-Per-Use model, where users purchase credits for
            specific services or features. This lets you pay only for what you
            use, making support accessible. It offers a free tier; premium plans
            unlock more features.
          </p>

          <p
            style={{
              backgroundColor: "#e3f8ed",
              padding: "10px",
              borderRadius: "8px",
              borderLeft: "4px solid #02a35c",
              marginBottom: "15px",
            }}
          >
            <strong>Designed for Individual Use:</strong> Data with Spectrum's
            Guide is stored directly on your device, ensuring privacy but also
            meaning that each account is device-specific. Your data, including
            progress, chat history, and personalized insights, does not transfer
            between devices. We recommend using the same device for all
            interactions with Spectrum's Guide.
          </p>

          <p>Our suite of features includes:</p>
          <ul>
            <li>
              <strong>Customized Care Plans:</strong> Suggest daily routines and
              strategies based on individual strengths, sensory preferences, and
              triggers, fostering a supportive environment.
            </li>
            <li>
              <strong>Educational Support:</strong> Suggest personalized
              learning approaches or Individualized Education Plans (IEPs) that
              align with communication styles, learning methods, and interests
              for better educational outcomes.
            </li>
            <li>
              <strong>Behavioral and Sensory Insights:</strong> Provide
              educational tips on sensory preferences and behaviors to help
              caregivers create a more comfortable environment.
            </li>
            <li>
              <strong>Safety and Emergency Planning Ideas:</strong> Offer
              suggestions to help caregivers plan for safety, such as ideas for
              addressing wandering or allergies, to create secure environments.
            </li>
            <li>
              <strong>Strength-Based Activities:</strong> Suggest activities
              that use individual strengths and interests to boost confidence
              and encourage independence.
            </li>
            <li>
              <strong>Social Stories:</strong> Use AI to create personalized
              narratives that teach social cues, routine understanding, and
              emotional awareness, making learning engaging and supportive.
            </li>
            <li>
              <strong>PECS Boards:</strong> Enable creation of custom visual
              support boards and upload of pre-made PDFs to assist with
              communication and daily tasks.
            </li>
          </ul>

          <p>
            <strong>Spectrum's Guide</strong> uses AI to turn data into
            practical, educational insights, offering personalized support for
            caregivers in a non-medical way. We continuously update our
            technology to meet the needs of the autism community.
          </p>

          <p className="privacy-intro">
            <strong>Privacy and Data Security:</strong> At Spectrum's Guide,
            your privacy is our priority. All data is stored{" "}
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
                Data stays on the device where it’s stored. If you lose or
                switch devices, manual backup or transfer is required.
              </li>
              <li>
                <strong>
                  <em>No Cloud Sync:</em>
                </strong>{" "}
                Data doesn’t sync across devices, so using Spectrum's Guide on
                multiple devices requires extra data management steps.
              </li>
            </ul>
          </div>
          <p className="privacy-footer">
            We have no plans to use external databases for your personal
            interactions, safeguarding against unauthorized access. We recommend
            maintaining a backup strategy for your essential data.
          </p>

          <p
            className="expandable-section"
            onClick={() => setIsImprovementsOpen(!isImprovementsOpen)}
          >
            Proposed Improvements
            <FaChevronDown
              className={`expand-icon ${isImprovementsOpen ? "open" : ""}`}
              size={20}
            />
          </p>
          <div
            className={`expandable-content ${isImprovementsOpen ? "open" : ""}`}
            style={{ maxHeight: `${improvementsHeight}px` }}
            ref={improvementsRef}
          >
            <ul className="proposed-improvements">
              <li>
                <b>Behavioral Pattern Insights</b> – Offer caregivers
                educational tips based on behavior patterns to better understand
                daily routines.
              </li>
              <li>
                <b>Non-Verbal Communication Support</b> – Suggest ways to
                understand non-verbal cues through AI, helping caregivers
                communicate better.
              </li>
              <li>
                <b>Sensory Environment Suggestions</b> – Provide ideas for
                adjusting environments to suit sensory preferences, creating
                comfort.
              </li>
              <li>
                <b>Skill Development Tracking</b> – Add a dashboard to track
                skill growth over time, helping caregivers see progress.
              </li>
              <li>
                <b>Social Relationship Support</b> – Expand social stories into
                a tool for practicing social skills, fostering connections.
              </li>
              <li>
                <b>Emotional Awareness Tools</b> – Suggest activities to help
                caregivers understand and support emotional needs.
              </li>
              <li>
                <b>Transition Support</b> – Adapt IEPs into guides for life
                transitions, like school-to-work, to support growth.
              </li>
              <li>
                <b>PECS Board Enhancements</b> – Improve PECS boards with
                advanced symbol libraries and real-time customization options.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutPage;
