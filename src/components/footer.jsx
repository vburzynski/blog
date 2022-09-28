import React from 'react';
import SocialMediaItem from './social-media-item';
import socialmedia from '../data/socialmedia.yaml';

function Footer() {
  return (
    <footer className="bg-white border-t border-gray-400 shadow flex-none">
      <div className="container max-w-4xl mx-auto flex py-8">
        <div className="w-full mx-auto flex flex-wrap">
          <div className="flex w-full md:w-1/2 ">
            <div className="px-8">
              <h3 className="font-bold text-gray-900">About</h3>
              <p className="py-4 text-gray-600 text-sm">
                As an immersive Software Engineer and Web Developer, Valerie delves into complex
                systems to decrypt and understand how the entire system works. Next, she builds a
                conceptual mind map to refactor and improve the project.
              </p>
            </div>
          </div>

          <div className="flex w-full md:w-1/2">
            <div className="px-8">
              <h3 className="font-bold text-gray-900">Social</h3>
              <ul className="list-reset items-center text-sm pt-3">
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
        </div>
      </div>
    </footer>
  );
}

export default Footer;
