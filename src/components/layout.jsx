import React from "react";
import Footer from "./footer";
import Header from "./header";

const Layout = ({ section, children }) => (
  <div className="bg-gray-100 font-sans leading-normal tracking-normal">
    <Header section={section} />
    {children}
    <Footer />
  </div>
);

export default Layout;
