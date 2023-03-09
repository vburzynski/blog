import React from 'react';

const workExperience = [
  {
    id: 0,
    title: 'Senior Software Engineer',
    start: '2016',
    end: 'current',
  },
  {
    id: 1,
    title: 'Software Engineer and Courseware Developer',
    start: '2010',
    end: '2016',
  },
  {
    id: 2,
    title: 'Electronic Support Representative',
    start: '2009',
    end: '2010',
  },
  {
    id: 3,
    title: 'Knowledge Writer and IT Consultant',
    start: '2006',
    end: '2009',
  },
];

function ExperienceCard() {
  return (
    <div className="w-full lg:mx-auto lg:w-3/4">
      <div className="p-4 space-y-3 rounded-lg shadow-2xl shadow-primary/50 bg-canvas">
        <h1 className="text-xl font-bold text-center sm:text-left">Experience</h1>
        <div className="border-b-2 opacity-25 border-primary" />
        {workExperience.map(({ id, title, start, end }) => (
          <div key={id} className="text-center sm:text-left sm:flex sm:justify-between">
            <div className="text-lg font-medium">{ title }</div>
            <div className="text-sm font-medium text-primary-600">{`${start} to ${end}`}</div>
          </div>
        ))}
        <h1 className="text-xl font-bold text-center sm:text-left">Education</h1>
        <div className="border-b-2 opacity-25 border-primary" />
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
  );
};

export default ExperienceCard;
