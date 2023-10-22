import React from 'react';
import PropTypes from 'prop-types';

export default function NavigationItem({ title, href, isActive }) {
  const customStyle = isActive
    ? 'text-gray-900 font-bold'
    : 'text-gray-600 hover:text-gray-900 hover:text-underline';

  return (
    <li>
      <a className={`inline-block py-2 px-2 ${customStyle} no-underline`} href={href}>
        {title}
      </a>
    </li>
  );
}

NavigationItem.propTypes = {
  title: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired,
  isActive: PropTypes.bool,
};

NavigationItem.defaultProps = {
  isActive: false,
};
