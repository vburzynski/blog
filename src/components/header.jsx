import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { StaticImage } from 'gatsby-plugin-image';
import Navigation from './navigation';

const progressStyle = {
  background: 'linear-gradient(to right, #4dc0b5 var(--scroll), transparent 0)',
};

function Header({ section }) {
  const [isHeaderFixed, setIsHeaderFixed] = useState(false);

  useEffect(() => {
    const progressBarHandler = () => {
      const totalScroll = document.documentElement.scrollTop;
      const { clientHeight, scrollHeight } = document.documentElement;
      const windowHeight = scrollHeight - clientHeight;
      const scroll = (totalScroll / windowHeight) * 100;

      const progress = document.querySelector('#progress');
      progress.style.setProperty('--scroll', `${scroll}%`);
      setIsHeaderFixed(window.scrollY > 10);
    };

    window.addEventListener('scroll', progressBarHandler);
    window.addEventListener('resize', progressBarHandler);
    progressBarHandler();

    return () => {
      window.removeEventListener('scroll', progressBarHandler);
      window.removeEventListener('resize', progressBarHandler);
    };
  }, []);

  return (
    <nav id="header" className={`fixed w-full z-10 top-0 ${isHeaderFixed ? 'bg-canvas shadow' : 'bg-canvas'}`}>
      <div
        id="progress"
        className="h-1 z-20 top-0 bg-green-500"
        style={progressStyle}
      />
      <div className="w-full md:max-w-4xl mx-auto flex flex-wrap items-center justify-between mt-0 py-1">
        <div className="flex pl-4">
          <StaticImage
            className="w-10 h-10 rounded-full mr-2"
            src="../../images/profile.jpg"
            alt="Avatar of Valerie Burzynski"
            placeholder="blurred"
            layout="fixed"
            width={30}
            height={30}
          />
          <a className="text-gray-900 no-underline hover:no-underline font-extrabold text-xl" href="/">
            Valerie Burzynski
          </a>
        </div>
        <Navigation section={section} transparentBackground={isHeaderFixed} />
      </div>
    </nav>
  );
}

Header.propTypes = {
  section: PropTypes.string.isRequired,
};

export default Header;
