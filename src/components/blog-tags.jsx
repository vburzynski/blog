import React from 'react';

const BlogTags = ({ tags }) => (
  <div className="text-base md:text-sm text-gray-500 px-4 py-6">
    Tags:
    {' '}
    {tags
      .map(({ name, href }) => (
        <a href={href} className="text-base md:text-sm text-green-500 no-underline hover:underline">{name}</a>
      ))
      .reduce((prev, curr) => [prev, ', ', curr])
    }
  </div>
);

export default BlogTags;
