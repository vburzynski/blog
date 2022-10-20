import { oneLine } from 'common-tags';
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
      <div className="container w-full lg:max-w-4xl mx-auto space-y-4">
        <Profile />
        <div className="lg:mx-auto w-full lg:w-3/4 px-4">
          <div className="rounded-lg shadow-2xl shadow-primary/50 bg-canvas space-y-3 p-4">
            <h1 className="text-center sm:text-left text-xl font-bold">Experience</h1>
            <div className="border-b-2 border-primary opacity-25" />
            {workExperience.map(({ title, start, end }) => (
              <div className="text-center sm:text-left sm:flex sm:justify-between">
                <div className="text-lg font-medium">{ title }</div>
                <div className="text-sm font-medium text-primary-600">{`${start} to ${end}`}</div>
              </div>
            ))}
            <h1 className="text-center sm:text-left text-xl font-bold">Education</h1>
            <div className="border-b-2 border-primary opacity-25" />
            <div>
              <div className="text-center sm:text-left sm:flex sm:justify-between">
                <div className="text-lg font-medium">
                  University of Illinois
                  <div className="text-xs">Bachelor of Arts in Liberal Arts and Sciences</div>
                  <div className="text-xs">Studied Rhetoric and Computer Science</div>
                </div>
                <div className="text-sm font-medium text-primary-600">Urbana-Champaign, IL</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default IndexPage;

export function Head() {
  return <title>Home Page</title>;
}
