import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';
import { fetchCodeforcesRatings } from '../services/api';

const CodeforcesGraph = ({ handle }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to determine the color of the line based on current rating
  const getRatingColor = (rating) => {
    if (rating >= 2100) return '#FF0000'; // Red (Grandmaster+)
    if (rating >= 1900) return '#FF8C00'; // Orange (Master)
    if (rating >= 1600) return '#AA00AA'; // Purple (Expert)
    if (rating >= 1400) return '#0000FF'; // Blue (Specialist)
    if (rating >= 1200) return '#03A89E'; // Cyan (Pupil)
    return '#808080'; // Gray (Newbie)
  };

  useEffect(() => {
    const getRatings = async () => {
      setLoading(true);
      const result = await fetchCodeforcesRatings(handle);
      if (result && result.length > 0) {
        // Format the data for the chart
        const formattedData = result.map(item => ({
          // Convert UNIX timestamp to a readable date string
          date: new Date(item.ratingUpdateTimeSeconds * 1000).toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
          rating: item.newRating
        }));
        setData(formattedData);
      }
      setLoading(false);
    };

    getRatings();
  }, [handle]);

  if (loading) {
    return <div className="text-center py-8 text-github-text">Loading Codeforces rating history...</div>;
  }
  
  const currentRating = data.length > 0 ? data[data.length - 1].rating : 0;
  const ratingColor = getRatingColor(currentRating);

  return (
    <div className="card-wrapper shadow-xl transition-shadow duration-300 hover:shadow-2xl mb-8">
      <div className="card-inner p-6">
        <h3 className="text-xl font-bold text-github-text mb-2 flex items-center justify-between">
          Codeforces Rating History
          <span className="text-sm font-medium" style={{ color: ratingColor }}>
            Current: {currentRating}
          </span>
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Tracking contest performance over time.</p>
        
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={getRatingColor(1400)} opacity={0.3} />
            <XAxis dataKey="date" stroke="var(--color-github-text)" tick={{ fontSize: 10 }} />
            <YAxis stroke="var(--color-github-text)" domain={['auto', 'auto']} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(var(--color-github-card-rgb), 0.95)', 
                borderColor: 'var(--color-github-border)', 
                borderRadius: '8px' 
              }} 
              labelStyle={{ color: 'var(--color-github-accent)' }}
              itemStyle={{ color: 'var(--color-github-text)' }}
            />
            <Line 
              type="monotone" 
              dataKey="rating" 
              stroke={ratingColor} 
              strokeWidth={3} 
              dot={false} 
              activeDot={{ r: 6, fill: ratingColor, stroke: 'var(--color-github-card)', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CodeforcesGraph;
