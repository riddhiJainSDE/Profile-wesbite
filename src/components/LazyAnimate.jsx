// LazyAnimate.jsx
import React from 'react';
import { useInView } from 'react-intersection-observer';

const LazyAnimate = ({ children, className = '' }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,      // Only animate the first time
    threshold: 0.1,         // 10% of the element visible triggers it
    rootMargin: '0px 0px -50px 0px', // optional: triggers slightly before fully in view
  });

  return (
    <div
      ref={ref}
      className={`${className} transform transition-all duration-700 ease-out ${
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
      style={{ willChange: 'opacity, transform' }}
    >
      {children}
    </div>
  );
};

export default LazyAnimate;
