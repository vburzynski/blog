import React from 'react';
import SocialMediaItem from './social-media-item';
import socialmedia from '../data/socialmedia.yaml';

function Footer() {
  return (
    <footer className="flex-none bg-white border-t border-gray-400 shadow">
      <div className="container flex max-w-4xl px-2 py-2 mx-auto lg:px-0">
        <div className="flex items-center justify-end w-full mx-auto space-x-2">
          <h3 className="hidden font-bold text-gray-900 sm:block">Social Media:</h3>
          <ul className="flex justify-center space-x-2 text-sm list-reset">
            {socialmedia.map(({ iconClassName, href, title }) => (
              <SocialMediaItem
                iconClassName={iconClassName}
                href={href}
                title={title}
                key={title}
              />
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
