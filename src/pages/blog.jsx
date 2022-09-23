import React from 'react';
import { graphql } from 'gatsby';
import { DateTime } from 'luxon';
import Layout from '../components/layout';

function BlogPage({ data }) {
  const posts = data.allMarkdownRemark.nodes;

  return (
    <Layout section="blog">
      <div className="container w-full md:max-w-3xl mx-auto pt-20">
        <div className="w-full px-4 md:px-6 text-xl text-gray-800 leading-normal">
          {
            posts.map((post) => (
              <article key={post.id}>
                <a href={`/blog/${post.fields.slug}`}>{post.fields.title}</a>
                <p>{DateTime.fromISO(post.frontmatter.date).toLocaleString(DateTime.DATE_HUGE)}</p>
              </article>
            ))
          }
        </div>
      </div>
    </Layout>
  );
}

export default BlogPage;

export function Head() {
  return <title>Home Page</title>;
}

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      nodes {
        id
        excerpt
        fields {
          title
          slug
        }
        frontmatter {
          date(formatString: "MMMM DD, YYYY")
        }
      }
    }
  }
`;
