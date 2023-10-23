import React, { useState, useEffect } from 'react';
import { StaticImage } from 'gatsby-plugin-image';
import Navigation from './navigation';

const progressStyle = {
  background: 'linear-gradient(to right, #4dc0b5 var(--scroll), transparent 0)',
};

export interface HeaderProps {
  section: string;
}

function Header({ section }: HeaderProps) {
  const [isHeaderFixed, setIsHeaderFixed] = useState(false);

  useEffect(() => {
    const progressBarHandler = () => {
      const totalScroll = document.documentElement.scrollTop;
      const { clientHeight, scrollHeight } = document.documentElement;
      const windowHeight = scrollHeight - clientHeight;
      const scroll = (totalScroll / windowHeight) * 100;

      const progress: HTMLElement | null = document.querySelector('#progress');
      progress?.style.setProperty('--scroll', `${scroll}%`);
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
        className="top-0 z-20 h-1 bg-green-500"
        style={progressStyle}
      />
      <div className="flex flex-wrap items-center justify-between w-full py-1 mx-auto mt-0 md:max-w-4xl">
        <div className="flex pl-4">
          <StaticImage
            className="w-10 h-10 mr-2"
            imgClassName="rounded-full"
            src="../images/profile.jpg"
            alt="Avatar of Valerie Burzynski"
            placeholder="blurred"
            layout="fixed"
            width={30}
            height={30}
          />
          <a className="text-xl font-extrabold text-gray-900 no-underline hover:no-underline" href="/">
            Valerie Burzynski
          </a>
        </div>
        <Navigation section={section} transparentBackground={isHeaderFixed} />
      </div>
    </nav>
  );
}

export default Header;
