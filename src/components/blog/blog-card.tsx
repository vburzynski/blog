import React from 'react';
import PropTypes from 'prop-types';
import { DateTime } from 'luxon';

function BlogCard({ post }) {
  return (
    <div className="flex flex-wrap md:flex-nowrap">
      <div className="md:w-32 flex-shrink-0 flex flex-row md:flex-col text-sm space-x-2 md:space-x-0 items-center md:items-start">
        <span className="font-semibold title-font text-gray-700">
          {DateTime.fromISO(post.frontmatter.date).toLocaleString(DateTime.DATE_MED)}
        </span>
        <span className="text-gray-500 text-xs">
          {post.frontmatter.category}
        </span>
      </div>
      <div className="md:flex-grow">
        <h2 className="text-2xl font-medium text-primary-700 title-font">
          <a href={`/blog/${post.fields.slug}`}>
            {post.fields.title}
          </a>
        </h2>
        <p className="italic text-sm mb-2">{post.frontmatter.summary}</p>
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
