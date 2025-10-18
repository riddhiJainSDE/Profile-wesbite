// src/pages/CodingProfiles.jsx
import React from "react";
import LazyAnimate from "../components/LazyAnimate";
import CodeforcesGraph from "../components/CodeforcesGraph";
import CodeChefGraph from "../components/CodeChefGraph";
import LeetCodeGraph from "../components/LeetCodeGraph";

const CodingProfiles = () => {
  const codeforcesHandle = "rid.dhi_1509";
  const codechefHandle = "nice_scene_20";
  const leetcodeUsername = "jainriddhi78";

  return (
    <div className="p-4 md:p-8 space-y-10 dark">
      <h2 className="text-3xl font-extrabold text-github-text mb-6 border-b border-github-border pb-3">
        Competitive Programming Dashboard (Live Data)
      </h2>

      <div className="grid grid-cols-1 gap-8">
        <LazyAnimate>
          <CodeforcesGraph handle={codeforcesHandle} />
        </LazyAnimate>

        <LazyAnimate>
          <CodeChefGraph handle={codechefHandle} />
        </LazyAnimate>

      </div>

      <div className="mt-12 p-4 border-t border-github-border text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Data fetched live from APIs (Codeforces, CodeChef, LeetCode). Handles:
          <span className="font-mono text-github-accent ml-2">{codeforcesHandle}</span> (CF),
          <span className="font-mono text-github-accent ml-2">{codechefHandle}</span> (CC),
          <span className="font-mono text-github-accent ml-2">{leetcodeUsername}</span> (LC)
        </p>
      </div>
    </div>
  );
};

export default CodingProfiles;
