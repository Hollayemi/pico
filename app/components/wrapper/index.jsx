import React from "react";
import Header from "./header";
import Footer from "./footer";
import SlideDisplay from "../slider/slider";

export const HomeWrapper = ({ children, miniSlider, title }) => {
  return (
    <div>
      <Header isHome={!miniSlider} />
      {miniSlider && <SlideDisplay noContent pageTitle={title} />}
      {children}
      <Footer />
    </div>
  );
};

export default HomeWrapper;
