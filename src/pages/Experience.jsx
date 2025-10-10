import React from "react";

// This wrapper component applies the glow/slide-in effects
const AnimatedCardWrapper = ({ children, index, className = "" }) => {
  return (
    <div
      // Apply slide-in animation and delay based on index
      className={`relative pl-12 pb-12 opacity-0 animate-[slideIn_0.6s_ease-out_forwards] ${className}`}
      style={{ animationDelay: `${index * 0.15 + 0.1}s` }}
    >
      {/* Timeline dot */}
      <div className="absolute top-4 left-[18px] w-4 h-4 rounded-full bg-github-bg dark:bg-github-card border-2 border-github-accent shadow-md transform -translate-x-1/2 -translate-y-1/2 z-10"></div>

      {/* Glow glass card */}
      <div className="card-wrapper hover:scale-[1.01] hover:shadow-2xl transition-transform duration-500">
        <div className="card-inner relative z-10 p-6 md:p-7">
          {children}
        </div>
      </div>
    </div>
  );
};

// Component receives the 'experience' prop, consistent with PROFILE_DATA structure.
const Experience = ({ experience }) => {
  
  // CRITICAL FIX: Robustly check if 'experience' is an array. 
  // This prevents rendering issues if the prop is initially null or undefined.
  const timelineData = Array.isArray(experience) ? experience : [];

  return (
    <div className="relative px-4 md:px-8 py-12 md:py-16 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold text-github-text mb-10 border-b border-github-border dark:border-github-border pb-3 tracking-tight">
        Professional Timeline
        <span className="text-github-accent text-base ml-2">
          ({timelineData.length})
        </span>
      </h2>

      <div className="relative">
        {/* Vertical line */}
        <div className="absolute top-0 left-[18px] w-[2px] h-full bg-gray-300/40 dark:bg-gray-700/40 transform -translate-x-1/2"></div>

        {timelineData.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No timeline data available. Please check the data source.
          </div>
        ) : (
          timelineData.map((item, index) => (
            <AnimatedCardWrapper key={index} index={index}>
              {/* These keys are directly mapped from your PROFILE_DATA.experience array */}
              <p className="text-gray-500 dark:text-gray-400 text-sm italic mb-1">
                {item.dates || "Date Range Missing"}
              </p>
              <h3 className="text-lg font-bold text-github-text leading-snug">
                {item.title || "Untitled Role"}
              </h3>
              <p className="text-github-accent font-medium mt-1">
                {item.company || "Company Missing"}
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-3">
                {item.desc || "Description Missing"}
              </p>
            </AnimatedCardWrapper>
          ))
        )}
      </div>

      <div className="text-center md:text-left mt-12">
        <a
          href="#"
          className="text-github-accent hover:underline text-sm font-medium tracking-wide"
        >
          View full timeline →
        </a>
      </div>
    </div>
  );
};

export default Experience;
