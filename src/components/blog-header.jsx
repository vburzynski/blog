import React from 'react';
import PropTypes from 'prop-types';

function BlogHeader({ title, published }) {
  return (
    <div className="font-sans">
      <p className="text-base md:text-sm text-green-500 font-bold">
        &lt;
        {' '}
        <a href="/blog" className="text-base md:text-sm text-green-500 font-bold no-underline hover:underline">BACK TO BLOG</a>
      </p>
      <h1 className="font-bold font-sans break-normal text-gray-900 pt-6 pb-2 text-3xl md:text-4xl">{title}</h1>
      <p className="text-sm md:text-base font-normal text-gray-600 pb-4">{published}</p>
    </div>
  );
}

BlogHeader.propTypes = {
  title: PropTypes.string.isRequired,
  published: PropTypes.string.isRequired,
};

export default BlogHeader;
