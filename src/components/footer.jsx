import React from 'react';
import SocialMediaItem from './social-media-item';
import socialmedia from '../data/socialmedia.yaml';

function Footer() {
  return (
    <footer className="bg-white border-t border-gray-400 shadow flex-none">
      <div className="container max-w-4xl mx-auto flex py-2">
        <div className="w-full mx-auto flex justify-end items-center space-x-2">
          <h3 className="font-bold text-gray-900">Social Media:</h3>
          <ul className="list-reset justify-center text-sm flex space-x-2">
            {socialmedia.map(({ iconClassName, href, title }) => (
              <SocialMediaItem
                iconClassName={iconClassName}
                href={href}
                title={title}
              />
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
