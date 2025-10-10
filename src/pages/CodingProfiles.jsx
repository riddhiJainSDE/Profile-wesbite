import React from 'react';
import CodeforcesGraph from '../components/CodeforcesGraph';
import LeetCodeGraph from '../components/LeetcodeGraph';
import CodeChefGraph from '../components/CodeChefGraph';
import LazyAnimate from '../components/LazyAnimate';
// NOTE: This component is assumed to be running in an environment 
// where the CSS with the .card-wrapper and .dark styles is loaded.

const CodingProfiles = () => {
  // Your profile handles
  const codeforcesHandle = 'rid.dhi_1509';
  const leetcodeUsername = 'jainriddhi78';
  const codechefHandle = 'nice_scene_20';

  return (
    // Assuming the parent container or body has the 'dark' class applied 
    // for dark mode styling if needed.
    <div className="p-4 md:p-8 space-y-10 dark"> 
      <h2 className="text-3xl font-extrabold text-github-text mb-6 border-b border-github-border pb-3">
        Competitive Programming Dashboard(Live data fetched)
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
        {/* Codeforces Graph - Full History */}
         <LazyAnimate>
        <CodeforcesGraph handle={codeforcesHandle} />
         </LazyAnimate>
        {/* LeetCode Graph - Solved Problems Breakdown */}
         <LazyAnimate>
        <LeetCodeGraph username={leetcodeUsername} />
        </LazyAnimate>
        {/* CodeChef Graph - Rating Overview */}
        <LazyAnimate>
        <CodeChefGraph handle={codechefHandle} />
        </LazyAnimate>
      </div>

      <div className="mt-12 p-4 border-t border-github-border text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Data fetched live from external APIs and visualized using Recharts. Handles: 
          <span className="font-mono text-github-accent ml-2">{codeforcesHandle}</span> (CF),
          <span className="font-mono text-github-accent ml-2">{leetcodeUsername}</span> (LC),
          <span className="font-mono text-github-accent ml-2">{codechefHandle}</span> (CC).
        </p>
      </div>
    </div>
  );
};

export default CodingProfiles;
