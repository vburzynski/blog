import React from 'react';
import { graphql } from 'gatsby';
import { DateTime } from 'luxon';
import Layout from '../components/layout';

function BlogPage({ data }) {
  const posts = data.allMarkdownRemark.nodes;

  return (
    <Layout section="blog">
      <div className="bg-canvas container w-full md:max-w-4xl mx-auto mt-20 mb-6 rounded-md p-4 space-y-4">
        <section className="text-gray-600 body-font overflow-hidden">
          <div className="container px-5 py-6 space-y-6 mx-auto">
            {posts.map((post) => (
              <div className="flex flex-wrap md:flex-nowrap">
                <div className="md:w-32 md:mb-0 mb-6 flex-shrink-0 flex flex-col text-sm">
                  <span className="font-semibold title-font text-gray-700">
                    {post.frontmatter.category}
                  </span>
                  <span className="mt-1 text-gray-500 text-xs">
                    {DateTime.fromISO(post.frontmatter.date).toLocaleString(DateTime.DATE_MED)}
                  </span>
                </div>
                <div className="md:flex-grow">
                  <h2 className="text-2xl font-medium text-gray-900 title-font mb-2">
                    {post.fields.title}
                  </h2>
                  <p className="leading-relaxed">
                    {post.excerpt}
                  </p>
                  <a
                    className="text-pink-500 inline-flex items-center mt-4"
                    href={`/blog/${post.fields.slug}`}
                  >
                    Read More
                    <svg className="w-4 h-4 ml-2" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14" />
                      <path d="M12 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
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
        }
      }
    }
  }
`;
