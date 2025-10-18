import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { fetchCodeforcesRatings } from "../services/api";

const CodeforcesGraph = ({ handle }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const URL = "https://codeforces.com/profile/";

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
    const load = async () => {
      setLoading(true);
      const ratings = await fetchCodeforcesRatings(handle);
      if (ratings && ratings.length) {
        setData(
          ratings.map((r) => ({
            contest: r.contestName,
            // Using short month and 2-digit year for better fit
            date: new Date(r.ratingUpdateTimeSeconds * 1000).toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
            rating: r.newRating,
          }))
        );
      }
      setLoading(false);
    };
    load();
  }, [handle]);

  if (loading) return <div className="p-4 text-gray-400">Loading Codeforces...</div>;
  if (!data.length) return <div className="p-4 text-gray-400">No contests found.</div>;

  const currentRating = data[data.length - 1].rating;
  const ratingColor = getRatingColor(currentRating);

  return (
    <div className="p-6 border border-gray-700 rounded shadow-lg bg-gray-900 text-gray-200">
      {/* Title container uses flex to align title and button horizontally */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-white flex items-baseline">
          Codeforces Rating History 
          <span className="text-base font-normal ml-2 text-gray-400">(Current: <span style={{ color: ratingColor }}>{currentRating}</span>)</span>
        </h3>
        <a
          href={`${URL}${handle}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1 text-sm font-semibold rounded-full 
            bg-blue-600 hover:bg-blue-700 text-white transition duration-200 
            dark:bg-github-accent dark:hover:bg-blue-600"
        >
          Visit Profile
        </a>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" /> 
          <XAxis 
            dataKey="date" 
            stroke="#9CA3AF" 
            tick={{ fontSize: 10 }} 
            interval="preserveStartEnd" 
            ticks={data.map(d => d.date).filter((_, i) => i % 5 === 0)} 
          /> 
          <YAxis stroke="#9CA3AF" />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #4B5563', color: '#E5E7EB' }} 
          />
          <Line type="monotone" dataKey="rating" stroke={ratingColor} strokeWidth={3} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CodeforcesGraph;
