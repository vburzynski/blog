import React from 'react';
import PropTypes from 'prop-types';
import { oneLine } from 'common-tags';

function BlogContent({ html }) {
  return (
    <article
      className={oneLine`
        prose lg:prose-xl
        prose-code:before:content-none prose-code:overflow-hidden prose-code:after:content-none
        prose-code:break-words prose-code:whitespace-normal
        prose-pre:break-words prose-pre:whitespace-normal prose-pre:overflow-hidden
      `}
      dangerouslySetInnerHTML={{ __html: html }}
      itemProp="articleBody"
    />
  );
}

BlogContent.propTypes = {
  html: PropTypes.string.isRequired,
};

export default BlogContent;
