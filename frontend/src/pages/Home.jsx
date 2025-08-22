import React from "react";
import Hero from "../components/Hero";
import LatestCollection from "../components/LatestCollection";
import BestSeller from "../components/BestSeller";
import OurTerms from "../components/OurPolicy";
import NewsletterBox from "../components/NewsletterBox";

const Home = () => {
  return (
    <div className="">
      <Hero />
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <LatestCollection />
        <BestSeller />
      </section>
      <OurTerms />
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <NewsletterBox />
      </section>
    </div>
  );
};

export default Home;
