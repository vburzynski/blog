import React from 'react';
import Layout from '../components/layout';
import Profile from '../components/profile';

function IndexPage() {
  return (
    <Layout section="home">
      <div className="container w-full md:max-w-4xl mx-auto mt-20 mb-6 rounded-md p-4 space-y-4">
        <Profile />
      </div>
    </Layout>
  );
}

export default IndexPage;

export function Head() {
  return <title>Home Page</title>;
}
