import React from "react";
import "../styles/components/Container.css"; 

const Container = ({ children }) => {
  return <div className="container-wrapper">{children}</div>;
};

export default Container;