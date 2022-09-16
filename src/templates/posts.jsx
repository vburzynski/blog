import React from 'react';
import PropTypes from 'prop-types';
import { graphql, Link } from 'gatsby';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import { DateTime } from 'luxon';
import { MDXProvider } from '@mdx-js/react';
import Layout from '../components/layout';
import PageDivider from '../components/page-divider';
import BlogNavigation from '../components/blog-navigation';
import BlogHeader from '../components/blog-header';
import BlogTags from '../components/blog-tags';

const shortcodes = { Link };

export default function PageTemplate({ data, children }) {
  const published = DateTime.fromISO(data.mdx.frontmatter.date).toLocaleString(DateTime.DATE_HUGE);
  const image = getImage(data.mdx.frontmatter.image);

  return (
    <Layout section="home">
      <div className="container w-full md:max-w-3xl mx-auto pt-20">
        <div className="w-full px-4 md:px-6 text-xl text-gray-800 leading-normal">
          <BlogHeader title={data.mdx.fields.title} published={published} />
          <GatsbyImage image={image} alt={data.mdx.frontmatter.imageAlt} />
          <BlogTags tags={data.mdx.frontmatter.tags} />
          <article className="prose lg:prose-xl break-all whitespace-pre-wrap">
            <MDXProvider components={shortcodes}>
              {children}
            </MDXProvider>
          </article>
        </div>
        <BlogTags tags={data.mdx.frontmatter.tags} />
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
        tags: PropTypes.arrayOf(PropTypes.string),
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
      fields {
        title
      }
      frontmatter {
        date
        tags
        image {
          childImageSharp {
            gatsbyImageData(
              width: 1536
            )
          }
        }
        imageAlt
      }
    }
  }
`;
