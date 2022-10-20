import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import { DateTime } from 'luxon';
import Layout from '../components/layout';
import PageDivider from '../components/page-divider';
import { Blog } from '../components';

export default function PageTemplate({
  data: {
    previous,
    next,
    markdownRemark: post,
  },
  children,
}) {
  const published = DateTime.fromISO(post.frontmatter.date).toLocaleString(DateTime.DATE_HUGE);
  const image = getImage(post.frontmatter.image);

  return (
    <Layout section="home">
      <Blog>
        <Blog.Header title={post.fields.title} published={published} />
        <GatsbyImage image={image} alt={post.frontmatter.imageAlt} />
        {/* <Blog.Tags tags={post.frontmatter.tags} /> */}
        <Blog.Content html={post.html} />
        {children}
        {/* <Blog.Tags tags={post.frontmatter.tags} /> */}
        <PageDivider />
        <Blog.Navigation previous={previous} next={next} />
      </Blog>
    </Layout>
  );
}

PageTemplate.propTypes = {
  data: PropTypes.any,
  children: PropTypes.node,
};

PageTemplate.defaultProps = {
  children: null,
};

export const pageQuery = graphql`
  query BlogPostBySlug(
    $id: String!
    $previousPostId: String
    $nextPostId: String
  ) {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(id: { eq: $id }) {
      id
      excerpt(pruneLength: 160)
      html
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
    previous: markdownRemark(id: { eq: $previousPostId }) {
      fields {
        slug
      }
      frontmatter {
        title
      }
    }
    next: markdownRemark(id: { eq: $nextPostId }) {
      fields {
        slug
      }
      frontmatter {
        title
      }
    }
  }
`
