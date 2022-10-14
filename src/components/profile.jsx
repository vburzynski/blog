import React from 'react';
import { StaticImage } from 'gatsby-plugin-image';
import socialmedia from '../data/socialmedia.yaml';

function Profile() {
  return (
    <div className="max-w-4xl flex flex-wrap items-center mx-auto">
      {/* Main Col */}
      <div className="w-full lg:w-3/5 rounded-lg lg:rounded-l-lg lg:rounded-r-none shadow-2xl shadow-primary/50 bg-canvas opacity-90">
        <div className="p-4 lg:p-12 text-center lg:text-left">
          <StaticImage
            className="block lg:hidden rounded-full shadow-xl mx-auto -mt-16 h-48 w-48 bg-cover bg-center"
            src="../images/headshot.jpg"
            alt="Avatar of Valerie Burzynski"
            placeholder="blurred"
            width={192}
            height={192}
          />

          <h1 className="text-3xl font-bold pt-8 lg:pt-0">Valerie Burzynski</h1>
          <div className="mx-auto lg:mx-0 w-4/5 pt-3 border-b-2 border-primary opacity-25" />
          <p className="pt-4 text-base font-bold flex items-center justify-center lg:justify-start">
            <svg
              className="h-4 fill-current text-primary pr-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M9 12H1v6a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6h-8v2H9v-2zm0-1H0V5c0-1.1.9-2 2-2h4V2a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1h4a2 2 0 0 1 2 2v6h-9V9H9v2zm3-8V2H8v1h4z" />
            </svg>
            {' '}
            Software Developer
          </p>
          <p>Professional Nerd Since 2007</p>
          <p className="pt-8 text-sm">
            As an immersive Software Engineer and Web Developer, Valerie delves into complex systems
            to decrypt and understand how the entire system works. Next, she builds a conceptual
            mind map to refactor and improve the project.
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

      <div className="w-full lg:w-2/5">
        <StaticImage
          className="rounded-none lg:rounded-lg shadow-2xl hidden lg:block"
          src="../images/headshot.jpg"
          alt="Avatar of Valerie Burzynski"
          placeholder="blurred"
          layout="fixed"
          width={350}
        />
      </div>
    </div>
  );
}

export default Profile;
