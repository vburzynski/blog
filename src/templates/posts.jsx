import React from 'react';
import PropTypes from 'prop-types';
import { graphql, Link } from 'gatsby';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import { DateTime } from 'luxon';
import Layout from '../components/layout';
import PageDivider from '../components/page-divider';
import BlogNavigation from '../components/blog-navigation';
import BlogHeader from '../components/blog-header';
import BlogTags from '../components/blog-tags';

const shortcodes = { Link };

export default function PageTemplate({
  data: {
    previous,
    next,
    site,
    markdownRemark: post,
  },
  children,
}) {
  const published = DateTime.fromISO(post.frontmatter.date).toLocaleString(DateTime.DATE_HUGE);
  const image = getImage(post.frontmatter.image);

  return (
    <Layout section="home">
      <div className="container w-full md:max-w-3xl mx-auto pt-20">
        <div className="w-full px-4 md:px-6 text-xl text-gray-800 leading-normal">
          <BlogHeader title={post.fields.title} published={published} />
          <GatsbyImage image={image} alt={post.frontmatter.imageAlt} />
          <BlogTags tags={post.frontmatter.tags} />
          <article
            className="prose lg:prose-xl prose-code:before:content-none prose-code:overflow-hidden prose-code:after:content-none prose-code:break-word prose-code:whitespace-pre-wrap prose-pre:break-word prose-pre:whitespace-pre-wrap prose-pre:overflow-hidden"
            dangerouslySetInnerHTML={{ __html: post.html }}
            itemProp="articleBody"
          />
          {children}
        </div>
        <BlogTags tags={post.frontmatter.tags} />
        <PageDivider />
        <BlogNavigation />
      </div>
    </Layout>
  );
}

PageTemplate.propTypes = {
  // data: PropTypes.shape({
  //   mdx: PropTypes.shape({
  //     frontmatter: PropTypes.shape({
  //       title: PropTypes.string.isRequired,
  //       tags: PropTypes.arrayOf(PropTypes.string),
  //     }).isRequired,
  //   }).isRequired,
  // }).isRequired,
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
