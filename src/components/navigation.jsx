import React, { useState } from 'react';
import PropTypes from 'prop-types';
import NavigationItem from './navigation-item';

const sections = [
  { key: 'home', title: 'Home', href: '/' },
  { key: 'blog', title: 'Blog', href: '/blog' },
];

export default function Navigation({ section, transparentBackground }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <>
      {/* Menu Button */}
      <div className="block pr-4 lg:hidden">
        <button
          id="nav-toggle"
          type="button"
          className="flex items-center px-3 py-2 text-gray-500 border border-gray-600 rounded appearance-none hover:text-gray-900 hover:border-green-500 focus:outline-none"
          onClick={toggleMenu}
        >
          <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <title>Menu</title>
            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
          </svg>
        </button>
      </div>

      {/* Menu Content */}
      <div
        id="nav-content"
        className={`w-full flex-grow lg:flex lg:items-center lg:w-auto ${!menuOpen && 'hidden'} lg:block mt-2 lg:mt-0 ${transparentBackground ? 'bg-white' : 'bg-gray-100'} lg:bg-transparent z-20`}
      >
        <ul className="items-center justify-end flex-1 list-reset lg:flex">
          {sections.map(({ key, title, href }) => (
            <NavigationItem key={key} title={title} href={href} isActive={key === section} />
          ))}
        </ul>
      </div>
    </>
  );
}

Navigation.propTypes = {
  section: PropTypes.string.isRequired,
  transparentBackground: PropTypes.bool,
};

Navigation.defaultProps = {
  transparentBackground: false,
};
