import React from 'react';

export default function SocialMediaItem({ href, title, iconClassName }) {
  return (
    <li>
      <a
        className="inline-block py-1 text-gray-600 no-underline hover:text-gray-900 hover:text-underline"
        href={href}
      >
        <i className={`${iconClassName} mr-1`} />
        {title}
      </a>
    </li>
  );
}
