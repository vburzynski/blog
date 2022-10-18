import React from 'react';
import PropTypes from 'prop-types';
import { DateTime } from 'luxon';

function BlogCard({ post }) {
  return (
    <div className="flex flex-wrap md:flex-nowrap">
      <div className="md:w-32 md:mb-0 mb-6 flex-shrink-0 flex flex-col text-sm">
        <span className="font-semibold title-font text-gray-700">
          {post.frontmatter.category}
        </span>
        <span className="mt-1 text-gray-500 text-xs">
          {DateTime.fromISO(post.frontmatter.date).toLocaleString(DateTime.DATE_MED)}
        </span>
      </div>
      <div className="md:flex-grow">
        <h2 className="text-2xl font-medium text-gray-900 title-font mb-2">
          <a className="text-pink-500" href={`/blog/${post.fields.slug}`}>
            {post.fields.title}
          </a>
        </h2>
        <p className="leading-relaxed">
          {post.excerpt}
        </p>
      </div>
    </div>
  );
}

BlogCard.propTypes = {
  post: PropTypes.shape({
    // TODO: fill me in...
  }).isRequired,
};

export default BlogCard;
