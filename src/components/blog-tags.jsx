import React from 'react';
import PropTypes from 'prop-types';

function BlogTags({ tags }) {
  return (
    <div className="text-base md:text-sm text-gray-500 py-6">
      Tags:
      {' '}
      {tags
        .map((name) => (
          <a href={`tags/${name}`} className="text-base md:text-sm text-green-500 no-underline hover:underline">{name}</a>
        ))
        .reduce((prev, curr) => [prev, ', ', curr])}
    </div>
  );
}

BlogTags.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.shape(PropTypes.string.isRequired)),
};

BlogTags.defaultProps = {
  tags: [],
};

export default BlogTags;
