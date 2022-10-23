import React from 'react';
import { StaticImage } from 'gatsby-plugin-image';
import { BriefcaseIcon, ClockIcon } from '@heroicons/react/24/solid';
import socialmedia from '../../data/socialmedia.yaml';

function ProfileCard() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="pt-12 lg:pt-0 flex flex-wrap items-center">
        <div className="w-full lg:w-3/5 rounded-lg lg:rounded-l-lg lg:rounded-r-none shadow-2xl shadow-primary/50 bg-canvas opacity-90">
          <div className="p-4 lg:p-12 text-center lg:text-left">
            <div className="block lg:hidden mx-auto -mt-16 h-48 w-48">
              <StaticImage
                src="../../images/headshot.jpg"
                alt="Headshot of Valerie Burzynski"
                className="h-48 w-48"
                imgClassName="block lg:hidden rounded-full"
                placeholder="blurred"
                width={192}
                height={192}
              />
            </div>

            <h1 className="text-3xl font-bold pt-8 lg:pt-0">Valerie Burzynski</h1>
            <div className="mx-auto lg:mx-0 w-4/5 pt-3 border-b-2 border-primary opacity-25" />
            <p className="pt-4 text-base font-bold flex items-center justify-center lg:justify-start space-x-1">
              <BriefcaseIcon className="h-4 w-4" />
              <span>Software Developer</span>
            </p>
            <p className="flex items-center justify-center lg:justify-start space-x-1">
              <ClockIcon className="h-4 w-4" />
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

            <div className="text-2xl mt-6 pb-8 lg:pb-0 w-4/5 lg:w-full mx-auto flex flex-wrap items-center justify-between">
              {socialmedia.map(({ iconClassName, href, title }) => (
                <a className="link" href={href}>
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

        <div className="w-full lg:w-2/5 hidden lg:block">
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
