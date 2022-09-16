import React from 'react';
import { graphql } from 'gatsby';
import { DateTime } from 'luxon';
import Layout from '../components/layout';

function BlogPage({ data }) {
  return (
    <Layout section="blog">
      <div className="container w-full md:max-w-3xl mx-auto pt-20">
        <div className="w-full px-4 md:px-6 text-xl text-gray-800 leading-normal">
          {
            data.allMdx.nodes.map((node) => (
              <article key={node.id}>
                <a href={`/blog/${node.fields.slug}`}>{node.fields.title}</a>
                <p>{DateTime.fromISO(node.frontmatter.date).toLocaleString(DateTime.DATE_HUGE)}</p>
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

export const query = graphql`
  query {
    allMdx {
      nodes {
        fields {
          title
          slug
        }
        frontmatter {
          date
        }
        id
        excerpt
      }
    }
  }
`;
