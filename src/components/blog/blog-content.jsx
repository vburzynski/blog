import React from 'react';
import PropTypes from 'prop-types';

function BlogContent({ html }) {
  return (
    <article
      className="prose lg:prose-xl prose-code:before:content-none prose-code:overflow-hidden prose-code:after:content-none prose-code:break-word prose-code:whitespace-pre-wrap prose-pre:break-word prose-pre:whitespace-pre-wrap prose-pre:overflow-hidden"
      dangerouslySetInnerHTML={{ __html: html }}
      itemProp="articleBody"
    />
  );
}

BlogContent.propTypes = {
  html: PropTypes.string.isRequired,
};

export default BlogContent;
