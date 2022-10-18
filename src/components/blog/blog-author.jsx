import React from 'react';
import { StaticImage } from 'gatsby-plugin-image';

function BlogAuthor() {
  return (
    <div className="flex w-full items-center font-sans px-4 py-12">
      <StaticImage
        className="w-10 h-10 rounded-full mr-4"
        src="../../../images/profile.jpg"
        alt="Avatar of Valerie Burzynski"
        placeholder="blurred"
        layout="fixed"
        width={50}
        height={50}
      />
      <div className="flex-1 px-2">
        <p className="font-bold text-base md:text-xl leading-none mb-2">Valerie Burzynski</p>
        <p className="text-gray-600 text-xs md:text-base">Software Developer</p>
      </div>
      <div className="justify-end">
        <button
          type="button"
          className="bg-transparent border border-gray-500 hover:border-green-500 text-xs text-gray-500 hover:text-green-500 font-bold py-2 px-4 rounded-full"
        >
          Read More
        </button>
      </div>
    </div>
  );
}

export default BlogAuthor;
