import React from 'react';
import { Link } from 'gatsby';

function BlogNavigation({ next, previous }) {
  return (
    <div className="font-sans flex justify-between content-center px-4 pb-12">
      <div className="text-left">
        {previous && (
          <>
            <span className="text-xs md:text-sm font-normal text-gray-600">← Previous Post</span>
            <br />
            <Link
              className="break-normal text-base md:text-sm text-green-500 font-bold no-underline hover:underline"
              to={`/blog/${previous.fields.slug}`}
              rel="prev"
            >
              {previous.frontmatter.title}
            </Link>
          </>
        )}
      </div>
      <div className="text-right">
        {next && (
          <>
            <span className="text-xs md:text-sm font-normal text-gray-600">Next Post →</span>
            <br />
            <Link
              className="break-normal text-base md:text-sm text-green-500 font-bold no-underline hover:underline"
              to={`/blog/${next.fields.slug}`}
              rel="next"
            >
              {next.frontmatter.title}
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default BlogNavigation;
