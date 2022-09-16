import React from 'react';
import PropTypes from 'prop-types';
import Footer from './footer';
import Header from './header';

function Layout({ section, children }) {
  return (
    <div className="bg-gray-100 font-sans leading-normal tracking-normal">
      <Header section={section} />
      {children}
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
