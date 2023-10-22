import React from 'react';
import { graphql } from 'gatsby';
import Layout from '../components/layout';
import Blog from '../components/blog';

function BlogPage({ data }) {
  const posts = data.allMarkdownRemark.nodes;

  return (
    <Layout section="blog">
      <div className="container w-full p-4 mx-auto space-y-4 lg:max-w-4xl">
        <Blog>
          {posts.map((post) => (
            <Blog.Card post={post} key={post.id} />
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
  query BlogPage {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(sort: {frontmatter: {date: DESC}}) {
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
