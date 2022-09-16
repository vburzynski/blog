import React from 'react';
import PropTypes from 'prop-types';
import { graphql, Link } from 'gatsby';
import { MDXProvider } from '@mdx-js/react';
import Layout from '../components/layout';
import PageDivider from '../components/page-divider';
import BlogNavigation from '../components/blog-navigation';
import BlogHeader from '../components/blog-header';
import BlogAuthor from '../components/blog-author';
import BlogTags from '../components/blog-tags';

const shortcodes = { Link }; // Provide common components here

// export default function PageTemplate({ data, children }) {
//   return (
//     <>
//       <h1>{data.mdx.frontmatter.title}</h1>
//       <MDXProvider components={shortcodes}>
//         {children}
//       </MDXProvider>
//     </>
//   )
// }

export default function PageTemplate({ data, children }) {
  return (
    <Layout section="home">
      <div className="container w-full md:max-w-3xl mx-auto pt-20">
        <div className="w-full px-4 md:px-6 text-xl text-gray-800 leading-normal">
          <BlogHeader
            title={data.mdx.frontmatter.title}
            published="Published 19 February 2019"
          />
          <article className="prose lg:prose-xl">
            <MDXProvider components={shortcodes}>
              {children}
            </MDXProvider>
          </article>
        </div>
        <BlogTags
          tags={[
            { name: 'tag-a', href: '#' },
            { name: 'tag-b', href: '#' },
          ]}
        />
        <PageDivider />
        <BlogAuthor />
        <PageDivider />
        <BlogNavigation />
      </div>
    </Layout>
  );
}

PageTemplate.propTypes = {
  data: PropTypes.shape({
    mdx: PropTypes.shape({
      frontmatter: PropTypes.shape({
        title: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  }).isRequired,
  children: PropTypes.node,
};

PageTemplate.defaultProps = {
  children: null,
};

export const query = graphql`
  query($id: String!) {
    mdx(id: { eq: $id }) {
      frontmatter {
        title
      }
    }
  }
`;
