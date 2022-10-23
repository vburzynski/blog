import React from 'react';
import Layout from '../components/layout';
import { ProfileCard, ExperienceCard } from '../components/cards';

function IndexPage() {
  return (
    <Layout section="home">
      <div className="container w-full lg:max-w-4xl mx-auto p-4 space-y-4">
        <ProfileCard />
        <ExperienceCard />
      </div>
    </Layout>
  );
}

export default IndexPage;

export function Head() {
  return <title>Home Page</title>;
}
