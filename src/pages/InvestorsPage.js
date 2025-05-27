import React, { useState } from "react";
import { Link } from "react-router-dom"; // Add Link import
import { FaHome, FaArrowLeft, FaArrowRight } from "react-icons/fa"; // Add arrow icons
import "../styles/InvestorsPage.css";

const InvestorsPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Challenge",
      text1: "Autism caregivers face relentless stress and burnout.",
      text2: "Most tools are clinical, fragmented, and ignore daily needs.",
      text3: "Lack of accessible, personalized support worsens care quality.",
      text4: "Families need practical help—not just diagnosis-focused tools.",
      image: "/images/PITCHDECK/slide1.png",
      alt: "Stressed caregiver with head in hands",
    },
    {
      title: "Solution",
      text1: "Spectrum’s Guide is an AI-powered tool built for caregivers.",
      text2: "It delivers custom plans tailored to individual needs.",
      text3: "PECS boards and social stories improve daily interactions.",
      text4: "Empowers families to provide consistent, confident care.",
      image: "/images/PITCHDECK/slide2.png",
      alt: "Spectrum’s Guide care plan screenshot",
    },
    {
      title: "Market Opportunity",
      text1: "$100B global autism care market is growing fast.",
      text2: "6M+ U.S. caregivers need scalable, smart solutions.",
      text3: "Healthtech adoption and burnout fuel urgent demand.",
      text4: "Personalized, home-based tools are the future of care.",
      image: "/images/PITCHDECK/slide3.png",
      alt: "Bar chart of autism care market growth",
    },
    {
      title: "Benefits",
      text1: "PECS boards support non-verbal communication.",
      text2: "Social stories build emotional understanding and routine.",
      text3: "Safety planning protects against real-life risks.",
      text4: "Behavioral insights reduce stress for caregivers and kids.",
      image: "/images/PITCHDECK/slide4.png",
      alt: "Icons for care plans, PECS boards, and social stories",
    },
    {
      title: "Momentum",
      text1: "Beta testers praise usability and real-world value.",
      text2: "Pay-per-use model balances access and sustainability.",
      text3: "Continuous iteration guided by lived caregiver input.",
      image: "/images/PITCHDECK/slide5.png",
      alt: "Caregiver testimonial quote",
    },
    {
      title: "Team",
      text1: "James: Full-stack builder, architect of the MVP.",
      text2: "Tatiana: Caregiver expert guiding product decisions.",
      text3: "Tech meets lived experience for authentic innovation.",
      text4: "A team rooted in empathy, speed, and purpose.",
      image: "/images/PITCHDECK/slide6.png",
      alt: "Headshots of James and Tatiana",
    },
    {
      title: "Investment",
      text1: "We’re raising $250K to scale to 10K users.",
      text2: "$100K: AI & AR features (sync, stories).",
      text3: "$100K: Marketing + strategic partnerships.",
      text4: "$50K: Team (UX, caregiver liaison). Join us.",
      image: "/images/PITCHDECK/slide7.png",
      alt: "Pie chart of $250K funding allocation",
    },
    {
      title: "Contact Us",
      text1: "Let’s connect to discuss Spectrum’s Guide’s future.",
      text2: "Email: james@studiovoice2fly.com",
      text3: '<a href="https://www.linkedin.com/in/james-rrsantos" target="_blank" rel="noopener noreferrer" aria-label="Visit James Santos LinkedIn profile">LinkedIn</a>',
    },
  ];

  const handleNext = () => {
    setCurrentSlide((prev) => (prev < slides.length - 1 ? prev + 1 : prev));
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="investors-page">
      <div className="carousel">
        <div
          className={`carousel-slide ${
            slides[currentSlide].image
              ? currentSlide % 2 === 0
                ? "image-left"
                : "image-right"
              : "carousel-slide--contact"
          }`}
        >
          {slides[currentSlide].image ? (
            <>
              <img
                src={slides[currentSlide].image}
                alt={slides[currentSlide].alt}
                className="carousel-image"
              />
              <div className="carousel-text">
                <h2>{slides[currentSlide].title}</h2>
                <p>{slides[currentSlide].text1}</p>
                <p>{slides[currentSlide].text2}</p>
                <p dangerouslySetInnerHTML={{ __html: slides[currentSlide].text3 }} />
                <p>{slides[currentSlide].text4}</p>
              </div>
            </>
          ) : (
            <div className="carousel-contact-text">
              <h2>{slides[currentSlide].title}</h2>
              <p>{slides[currentSlide].text1}</p>
              <p>{slides[currentSlide].text2}</p>
              <p dangerouslySetInnerHTML={{ __html: slides[currentSlide].text3 }} />
              <p>{slides[currentSlide].text4}</p>
              <Link
                to="/signin"
                className="carousel-contact-home"
                aria-label="Return to Sign-In Page"
              >
                <FaHome className="home-icon" />
                <span className="home-text"/>
              </Link>
            </div>
          )}
        </div>
        <div className="carousel-navigation">
          <button
            onClick={handlePrev}
            disabled={currentSlide === 0}
            aria-label="Previous Slide"
            className="nav-button"
          >
            Prev
          </button>
          <div className="carousel-indicators">
            {slides.map((_, index) => (
              <span
                key={index}
                className={`indicator ${currentSlide === index ? "active" : ""}`}
                onClick={() => goToSlide(index)}
                role="button"
                tabIndex={0}
                aria-label={`Go to slide ${index + 1}`}
                onKeyDown={(e) => e.key === "Enter" && goToSlide(index)}
              />
            ))}
          </div>
          <button
            onClick={handleNext}
            disabled={currentSlide === slides.length - 1}
            aria-label="Next Slide"
            className="nav-button"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvestorsPage;



//   Slide 1: Challenge

//   Autism caregivers endure relentless stress, with 80% reporting burnout from the overwhelming demands of daily care. Existing tools, often clinical and fragmented, fail to address the practical realities of caregiving, leaving families unsupported in their day-to-day challenges. The absence of accessible, personalized resources diminishes care quality, exacerbating emotional and physical strain on caregivers and hindering the well-being of autistic individuals. Families urgently need intuitive, tailored solutions that go beyond diagnosis-focused tools to provide meaningful support, enabling them to navigate autism care with confidence and resilience.

//   Slide 2: Solution

//   Spectrum’s Guide is an AI-powered platform meticulously designed to meet the real-world needs of autism caregivers. By delivering custom care plans tailored to each individual’s unique strengths and challenges, it simplifies the complexities of caregiving. Integrated PECS boards and social stories enhance communication and emotional understanding, fostering stronger connections between caregivers and those they support. This intuitive tool empowers families to provide consistent, confident care, transforming daily interactions into opportunities for growth and stability, all while prioritizing ease of use and accessibility.

//   Slide 3: Market Opportunity

//   The autism care market, valued at $100 billion globally, is experiencing rapid growth fueled by the rising adoption of healthtech solutions. With over 6 million caregivers in the U.S. alone seeking scalable, AI-driven tools, the demand for innovative, home-based solutions has never been greater. Escalating caregiver burnout and the shift toward personalized care create an urgent need for platforms like Spectrum’s Guide. As healthtech continues to redefine caregiving, our focus on intuitive, tailored support positions us to capture a significant share of this expansive, high-growth market.

//   Slide 4: Benefits

//   Spectrum’s Guide delivers transformative benefits that directly address caregivers’ core needs. PECS boards facilitate non-verbal communication, enabling clearer, more meaningful interactions for autistic individuals. Social stories nurture emotional awareness, helping establish routines and fostering independence. Safety planning features mitigate real-world risks, such as wandering, ensuring secure environments for families. By providing behavioral insights, our platform reduces stress for both caregivers and those they support, creating calmer, more supportive caregiving experiences that enhance quality of life.

//   Slide 5: Momentum

//   Our live beta, tested by over 50 caregivers, has earned praise for its intuitive design and measurable impact on daily caregiving. The pay-per-use model ensures accessibility while proving sustainable, balancing affordability with growth potential. Invitations from two prestigious incubators affirm our scalable, mission-driven approach, signaling strong external validation. Guided by continuous caregiver feedback, we iterate rapidly, refining our platform to meet evolving needs and solidifying our path toward widespread adoption and impact.

//   Slide 6: Team

//   Spectrum’s Guide is driven by a dynamic duo whose complementary expertise fuels our mission. James, a full-stack technologist, built the MVP with innovative precision, laying a robust foundation for scalability. Tatiana, a caregiver expert, brings deep, lived experience, ensuring our solutions resonate authentically with users. Together, their blend of technical prowess and empathetic insight drives rapid, user-centric development. United by a passion to revolutionize autism support, James and Tatiana embody the vision and execution needed to deliver transformative impact.

//   Slide 7: Investment

//   We are seeking a $250K Seed investment to scale Spectrum’s Guide to 10K caregivers within 12 months, amplifying our impact in the autism care space. $100K will enhance our AI capabilities, introducing cloud sync and AR-powered social stories to deliver a seamless user experience. Another $100K will fuel marketing efforts and strategic partnerships with autism organizations, driving user acquisition and community trust. $50K will expand our team, adding a UX designer and caregiver liaison to refine our platform and deepen user engagement. Join us to transform autism care with AI-powered, caregiver-focused innovation, creating a brighter future for families worldwide.