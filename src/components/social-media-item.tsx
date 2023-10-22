import React from 'react';
import PropTypes from 'prop-types';

export default function SocialMediaItem({ href, title, iconClassName }) {
  return (
    <li>
      <a
        className="inline-block text-gray-600 no-underline hover:text-gray-900 hover:text-underline py-1"
        href={href}
      >
        <i className={`${iconClassName} mr-1`} />
        {title}
      </a>
    </li>
  );
};

