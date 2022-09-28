import React from 'react';
import Layout from '../components/layout';
import Profile from '../components/profile';

const workExperience = [
  {
    title: 'Senior Software Engineer',
    start: '2016',
    end: 'current',
  },
  {
    title: 'Software Engineer and Courseware Developer',
    start: '2010',
    end: '2016',
  },
  {
    title: 'Electronic Support Representative',
    start: '2009',
    end: '2010',
  },
  {
    title: 'Knowledge Writer and IT Consultant',
    start: '2006',
    end: '2009',
  },
];

function IndexPage() {
  return (
    <Layout section="home">
      <div className="container w-full md:max-w-4xl mx-auto mt-20 mb-6 rounded-md p-4 space-y-4">
        <Profile />
        <div className="md:mx-auto w-full md:w-3/4 rounded-lg shadow-2xl bg-canvas p-4 space-y-3 border-2 border-shadow">
          <h1 className="text-xl font-bold">Experience</h1>
          <div className="border-b-2 border-primary opacity-25" />
          {workExperience.map(({ title, start, end }) => (
            <div className="text-center sm:text-left sm:flex sm:justify-between">
              <div className="text-lg font-bold">{ title }</div>
              <div className="text-sm font-bold text-primary-600">{`${start} to ${end}`}</div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}

export default IndexPage;

export function Head() {
  return <title>Home Page</title>;
}
