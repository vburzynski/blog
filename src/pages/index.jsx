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
        <div className="flex flex-col w-full xl:w-2/5 justify-center lg:items-start overflow-y-hidden">
          <h1 className="my-4 text-3xl md:text-5xl text-primary-200 font-bold leading-tight text-center md:text-left slide-in-bottom-h1">Main Hero Message to sell your app</h1>
          <p className="leading-normal text-secondary text-base md:text-2xl mb-8 text-center md:text-left slide-in-bottom-subtitle">Sub-hero message, not too long and not too short. Make it just right!</p>
        </div>
        <div className="md:mx-auto w-full md:w-3/4 rounded-lg shadow-2xl shadow-primary/50 bg-canvas p-4 space-y-3">
          <h1 className="text-xl font-bold">Experience</h1>
          <div className="border-b-2 border-primary opacity-25" />
          {workExperience.map(({ title, start, end }) => (
            <div className="text-center sm:text-left sm:flex sm:justify-between">
              <div className="text-lg font-bold">{ title }</div>
              <div className="text-sm font-bold text-primary-600">{`${start} to ${end}`}</div>
            </div>
          ))}
        </div>
        <div className="md:mx-auto w-full md:w-3/4 rounded-lg shadow-2xl shadow-primary/50 bg-canvas p-4 space-y-3">
          <h1 className="text-xl font-bold">Education</h1>
          <div className="border-b-2 border-primary opacity-25" />
          <div>
            <div className="text-center sm:text-left sm:flex sm:justify-between">
              <div className="text-lg font-bold">University of Illinois</div>
              <div className="text-sm font-bold text-primary-600">Urbana-Champaign, IL</div>
            </div>
            <p>Bachelor of Arts in Liberal Arts and Sciences</p>
            <p>Rhetoric and Computer Science</p>
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
