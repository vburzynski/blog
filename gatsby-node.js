const path = require('path');
const kebabCase = require('lodash/kebabCase');

const postTemplate = path.resolve('./src/templates/posts.jsx');

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions;

  if (node.internal.type === 'Mdx') {
    const fileNode = getNode(node.parent);
    const kebabFilename = kebabCase(fileNode.name);

    createNodeField({
      node,
      name: 'slug',
      value: node.frontmatter.slug || kebabFilename,
    });

    createNodeField({
      node,
      name: 'title',
      value: node.frontmatter.title || fileNode.name,
    });
  }
};

exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions;

  const result = await graphql(`
    query {
      allMdx {
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

  result.data.allMdx.nodes.forEach((node) => {
    console.log(node.internal.type);
    console.log(JSON.stringify(node, null, 2));
    createPage({
      // As mentioned above you could also query something else like frontmatter.title above and
      // use a helper function like slugify to create a slug
      path: node.fields.slug,
      // path to the MDX content file so webpack can pick it up and transform it into JSX
      // component: node.internal.contentFilePath,
      component: `${postTemplate}?__contentFilePath=${node.internal.contentFilePath}`,
      // You can use the values in this context in
      // our page layout component
      context: { id: node.id },
    });
  });
};

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;
  const typeDefs = `
    type Mdx implements Node @dontInfer {
      frontmatter: Frontmatter
      fields: Fields
    }
    type Frontmatter {
      title: String
      date: Date
      tags: [String]
      category: String
      publish: Boolean
      featured: Boolean
      socialImage: File @fileByRelativePath
      stage: String
      slug: String
    }
    type Fields {
      title: String!
      slug: String!
      date: Date!
      tagSlugs: [String]
      categorySlug: String
      category: String
      stage: String
    }
  `;

  createTypes(typeDefs);
};
