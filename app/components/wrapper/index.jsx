import React from "react";
import Header from "./header";

export const HomeWrapper = ({ children }) => {
  return (
    <div>
      <Header />
      {children}
    </div>
  );
};

export default HomeWrapper;
