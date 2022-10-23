import React from 'react';
import PropTypes from 'prop-types';
import Footer from './footer';
import Header from './header';
import svg from '../images/circuit-board.svg';

function Layout({ section, children }) {
  return (
    <div className="bg-shadow font-sans leading-normal tracking-normal min-h-screen flex flex-col">
      <Header section={section} />
      <div className="grow pt-11 lg:pt-16" style={{ backgroundImage: `url(${svg})` }}>
        {children}
      </div>
      <Footer />
    </div>
  );
}

Layout.propTypes = {
  section: PropTypes.string.isRequired,
  children: PropTypes.node,
};

Layout.defaultProps = {
  children: null,
};

export default Layout;
