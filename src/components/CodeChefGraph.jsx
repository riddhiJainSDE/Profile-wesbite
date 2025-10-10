import React, { useState, useEffect } from 'react';
import {
  RadialBarChart, RadialBar, Legend, Tooltip, ResponsiveContainer
} from 'recharts';
import { fetchCodeChefData } from '../services/api';

const CodeChefGraph = ({ handle }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const getRatingColor = (rating) => {
    if (rating >= 2200) return '#FF0000'; // Red
    if (rating >= 1800) return '#FF7E00'; // Orange
    if (rating >= 1600) return '#663399'; // Violet
    if (rating >= 1400) return '#3366CC'; // Blue
    return '#684200'; // Brown
  };

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      setHasError(false);

      const result = await fetchCodeChefData(handle);
      if (result) {
        setData(result);
      } else {
        setHasError(true);
        setData(null);
      }
      setLoading(false);
    };

    getData();
  }, [handle]);

  if (loading) {
    return <div className="text-center py-8 text-gray-700">Loading CodeChef data...</div>;
  }

  if (hasError || !data || !data.currentRating) {
    return (
      <div className="card-wrapper shadow-xl mb-8">
        <div className="card-inner p-6 text-center text-red-500">
          Error: Could not retrieve CodeChef data. Check the handle or try again later.
        </div>
      </div>
    );
  }

  const { currentRating, highestRating, stars, globalRank, countryRank } = data;
  const ratingColor = getRatingColor(currentRating);

  const chartData = [
    { name: 'Highest Rating', value: highestRating, fill: 'var(--color-github-border)' },
    { name: 'Current Rating', value: currentRating, fill: ratingColor },
  ];

  return (
    <div className="card-wrapper shadow-xl mb-8">
      <div className="card-inner p-6">
        <h3 className="text-xl font-bold mb-2 flex justify-between items-center">
          CodeChef Rating Overview
          <span className="text-sm font-medium" style={{ color: ratingColor }}>
            {stars} ({currentRating})
          </span>
        </h3>
        <p className="text-sm text-gray-500 mb-2">
          Highest achieved rating: {highestRating}
        </p>
        <p className="text-sm text-gray-500 mb-4">
          Global Rank: {globalRank} | Country Rank: {countryRank}
        </p>

        <ResponsiveContainer width="100%" height={300}>
          <RadialBarChart 
            cx="50%" cy="50%" innerRadius="10%" outerRadius="80%" 
            barSize={10} data={chartData} startAngle={90} endAngle={-270}
          >
            <RadialBar 
              minAngle={15} 
              label={{ position: 'insideStart', fill: '#fff' }} 
              background 
              clockWise 
              dataKey="value"
            />
            <Legend 
              iconSize={10} layout="vertical" verticalAlign="middle" align="right" 
              wrapperStyle={{ color: 'var(--color-github-text)' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(var(--color-github-card-rgb), 0.95)', 
                borderColor: 'var(--color-github-border)', 
                borderRadius: '8px' 
              }} 
              labelStyle={{ color: 'var(--color-github-accent)' }}
              itemStyle={{ color: 'var(--color-github-text)' }}
            />
          </RadialBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CodeChefGraph;
