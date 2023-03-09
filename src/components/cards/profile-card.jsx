import React from 'react';
import { StaticImage } from 'gatsby-plugin-image';
import { BriefcaseIcon, ClockIcon } from '@heroicons/react/24/solid';
import socialmedia from '../../data/socialmedia.yaml';

function ProfileCard() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-wrap items-center pt-12 lg:pt-0">
        <div className="w-full rounded-lg shadow-2xl lg:w-3/5 lg:rounded-l-lg lg:rounded-r-none shadow-primary/50 bg-canvas opacity-90">
          <div className="p-4 text-center lg:p-12 lg:text-left">
            <div className="block w-48 h-48 mx-auto -mt-16 lg:hidden">
              <StaticImage
                src="../../images/headshot.jpg"
                alt="Headshot of Valerie Burzynski"
                className="w-48 h-48"
                imgClassName="block lg:hidden rounded-full"
                placeholder="blurred"
                width={192}
                height={192}
              />
            </div>

            <h1 className="pt-8 text-3xl font-bold lg:pt-0">Valerie Burzynski</h1>
            <div className="w-4/5 pt-3 mx-auto border-b-2 opacity-25 lg:mx-0 border-primary" />
            <p className="flex items-center justify-center pt-4 space-x-1 text-base font-bold lg:justify-start">
              <BriefcaseIcon className="w-4 h-4" />
              <span>Software Developer</span>
            </p>
            <p className="flex items-center justify-center space-x-1 lg:justify-start">
              <ClockIcon className="w-4 h-4" />
              <span>Professional Nerd Since 2006</span>
            </p>
            <p className="pt-4 text-sm">
              As an immersive Software Engineer and Web Developer, I love diving into large complex
              systems to decrypt and understand how everything works. I also find tough or
              challenging technical issues rather engaging. It probably helps that I'm a bit of
              an epistemophile; I have a love of knowledge as well as the impulse to investigate
              and inquire. I'm perpetually curious. I find great architecture, structure, and
              design inspiring.
            </p>

            <div className="flex flex-wrap items-center justify-between w-4/5 pb-8 mx-auto mt-6 text-2xl lg:pb-0 lg:w-full">
              {socialmedia.map(({ iconClassName, href, title }) => (
                <a className="link" href={href} key={title}>
                  <div className="h-6 fill-current text-primary-800 hover:text-primary">
                    <title>{title}</title>
                    <i className={`${iconClassName}`} />
                  </div>
                </a>
              ))}
            </div>

            {/*  Use https://simpleicons.org/ to find the svg for your preferred product  */}
          </div>
        </div>

        <div className="hidden w-full lg:w-2/5 lg:block">
          <StaticImage
            className=""
            imgClassName="rounded-none lg:rounded-lg shadow-2xl"
            src="../../images/headshot.jpg"
            alt="Avatar of Valerie Burzynski"
            placeholder="blurred"
            layout="fixed"
            width={350}
          />
        </div>
      </div>
    </div>
  );
}

export default ProfileCard;
