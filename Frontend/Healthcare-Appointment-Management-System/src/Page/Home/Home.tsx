import React, { useEffect, useState } from "react";
import "./Home.css";
import Navbar from "../../Components/Navbar/Navbar";
import assetsData from "../../assets/assetsData.ts";
import About from "../../Components/About/About";
import Department from "../../Components/Department/Department";
// import axiosInstance from "../../utils/axios";
import Footer from "../../Components/Footer/Footer.tsx";
// import DoctorList from "../../Components/DoctorSection/DoctorList";
import List from "../../Components/DoctorList/List.tsx";

const Home: React.FC = () => {
  const carouselTexts = [
    {
      Title: "Providing the best healthcare for you and your family.",
      Desc: "We offer personalized care and advanced treatments to ensure your well-being.",
    },
    {
      Title: "Advanced medical treatments with a compassionate touch.",
      Desc: "Our team combines expertise with empathy to deliver exceptional healthcare.",
    },
    {
      Title: "Your health is our top priority. Schedule a visit today.",
      Desc: "Book appointments easily and access top-notch medical services.",
    },
    {
      Title: "Leading the way in innovative medical solutions.",
      Desc: "We embrace technology to provide cutting-edge healthcare solutions.",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselTexts.length);
    }, 4000);

    return () => clearInterval(intervalId);
  }, [carouselTexts.length]);

  return (
    <div className="home-container">
      <Navbar />
      <div className="home__hero">
        <img
          className="home__hero-image"
          src={assetsData.heroBg}
          alt="Abstract background"
        />

        <div className="home__hero-caption">
          <h2 className="home__caption-title">
            {carouselTexts[currentIndex].Title}
          </h2>
          <p className="home__caption-desc">
            {carouselTexts[currentIndex].Desc}
          </p>
          <button className="home__hero-caption-btn">Read More</button>

          <div className="home__carousel-dots">
            {carouselTexts.map((_, index) => (
              <span
                key={index}
                className={`dot ${index === currentIndex ? "active" : ""}`}
              ></span>
            ))}
          </div>
        </div>
      </div>
      <div id="about">
      <About />
      </div>
      <div id="department">
      <Department />
      </div>
      <div>
      <List/>
      </div>
      <div id="contact">
      <Footer/>
      </div>
    </div>
  );
};

export default Home;
