import { GatsbyNode, Node } from "gatsby";

const path = require('path');
const kebabCase = require('lodash/kebabCase');
const blogPostTemplate = path.resolve('./src/templates/blog-post.tsx');

type GatsbyMarkdownRemarkFrontmatter = {
  readonly title: String;
};

type GatsbyMarkdownRemarkNode = Node & {
  frontmatter: GatsbyMarkdownRemarkFrontmatter
};

export const onCreateNode: GatsbyNode['onCreateNode'] = ({ node, actions, getNode }) => {
  const { createNodeField } = actions;

  if (node.parent && node.internal.type === 'MarkdownRemark') {
    const fileNode = getNode(node.parent);
    const kebabFilename = kebabCase(fileNode?.name);

    createNodeField({
      node,
      name: 'slug',
      value: kebabFilename,
    });

    createNodeField({
      node,
      name: 'title',
      value: (node as GatsbyMarkdownRemarkNode).frontmatter.title || fileNode?.name || 'Untitled',
    });
  }
};

export const createPages: GatsbyNode['createPages'] = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions;

  const result = await graphql<Queries.GatsbyCreatePagesQuery>(`#graphql
    query GatsbyCreatePages {
      allMarkdownRemark(sort: {frontmatter: {date: ASC}}, limit: 1000) {
        nodes {
          id
          fields {
            title
            slug
          }
          internal {
            type
            contentFilePath
          }
        }
      }
    }
  `);

  if (result.errors) {
    reporter.panicOnBuild('Error loading MDX result', result.errors);
  }

  const posts = result.data?.allMarkdownRemark.nodes || [];

  posts.forEach((node, index) => {
    const previousPostId = index === 0 ? null : posts[index - 1].id;
    const nextPostId = index === posts.length - 1 ? null : posts[index + 1].id;

    createPage({
      path: `/blog/${node.fields?.slug}`,
      component: blogPostTemplate,
      context: {
        id: node.id,
        previousPostId,
        nextPostId,
      },
    });
  });
};
