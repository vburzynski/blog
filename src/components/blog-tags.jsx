import React from 'react';
import PropTypes from 'prop-types';

function BlogTags({ tags }) {
  return (
    <div className="text-base md:text-sm text-gray-500 px-4 py-6">
      Tags:
      {' '}
      {tags
        .map(({ name, href }) => (
          <a href={href} className="text-base md:text-sm text-green-500 no-underline hover:underline">{name}</a>
        ))
        .reduce((prev, curr) => [prev, ', ', curr])}
    </div>
  );
}

BlogTags.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    href: PropTypes.string.isRequired,
  })),
};

BlogTags.defaultProps = {
  tags: [],
};

export default BlogTags;
