import React from 'react';
import { graphql } from 'gatsby';
import Layout from '../components/layout';
import Blog from '../components/blog';

function BlogPage({ data }) {
  const posts = data.allMarkdownRemark.nodes;

  return (
    <Layout section="blog">
      <Blog>
        <div className="container px-5 py-6 space-y-6 mx-auto">
          {posts.map((post) => (
            <Blog.Card post={post} />
          ))}
        </div>
      </Blog>
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
          date
          category
        }
      }
    }
  }
`;
