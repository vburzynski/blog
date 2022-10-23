import React from 'react';
import { graphql } from 'gatsby';
import Layout from '../components/layout';
import Blog from '../components/blog';

function BlogPage({ data }) {
  const posts = data.allMarkdownRemark.nodes;

  return (
    <Layout section="blog">
      <div className="container w-full lg:max-w-4xl mx-auto p-4 space-y-4">
        <Blog>
          {posts.map((post) => (
            <Blog.Card post={post} />
          ))}
        </Blog>
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
          date
          category
          summary
        }
      }
    }
  }
`;
