import React from 'react';
import Layout from '../components/layout';
import PageDivider from '../components/page-divider';
import BlogNavigation from '../components/blog-navigation';
import BlogTags from '../components/blog-tags';

function IndexPage() {
  return (
    <Layout section="home">
      <div className="container w-full md:max-w-3xl mx-auto pt-20">
        <div className="w-full px-4 md:px-6 text-xl text-gray-800 leading-normal">
          Welcome!
        </div>
      </div>
    </Layout>
  );
}

export default IndexPage;

export function Head() {
  return <title>Home Page</title>;
}
