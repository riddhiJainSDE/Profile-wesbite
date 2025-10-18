import React, { useState, useEffect, useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { fetchLeetCodeStats } from "../services/api";

const LEETCODE_USERNAME = 'jainriddhi78';
const COLORS = ["#22c55e", "#facc15", "#ef4444"]; // Green, Yellow, Red (Easy, Medium, Hard)

// --- CUSTOM ACTIVITY GRID (Heatmap Implementation) ---
const ActivityGrid = ({ heatmapValues }) => {
  const submissionsMap = useMemo(() => {
    return heatmapValues.reduce((acc, curr) => {
      acc[curr.date] = curr.count;
      return acc;
    }, {});
  }, [heatmapValues]);

  // Calculate the date range for the last 365 days
  const today = new Date();
  const generateDates = useMemo(() => {
    const dates = [];
    let currentDate = new Date(today);
    // Start 364 days ago
    currentDate.setDate(currentDate.getDate() - 364); 

    for (let i = 0; i <= 365; i++) {
      dates.push(new Date(currentDate).toISOString().split('T')[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  }, [today]);

  const getClassForValue = (count) => {
    if (count === 0) return "bg-gray-700/50 dark:bg-gray-800/50"; // No activity
    if (count >= 10) return "bg-green-700";
    if (count >= 5) return "bg-green-600";
    if (count >= 2) return "bg-green-500";
    return "bg-green-400"; // Low activity (1)
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-2 text-white">Daily Submission Activity</h3>
      <div className="p-2 border border-gray-700 rounded-lg overflow-x-auto">
        {/* Activity Squares Grid: flex-col and flex-wrap organizes squares into columns (days) */}
        <div className="flex flex-col flex-wrap h-[100px] min-w-full md:min-w-[700px]">
          {generateDates.map((dateString) => {
            const count = submissionsMap[dateString] || 0;
            return (
              <div
                key={dateString}
                title={`${dateString}: ${count} submissions`}
                className={`w-3 h-3 m-[1px] rounded-sm transition-colors duration-100 ${getClassForValue(count)}`}
              ></div>
            );
          })}
        </div>
        {/* Legend */}
        <div className="flex justify-end text-xs text-gray-500 dark:text-gray-400 mt-2">
          Less
          <div className="w-3 h-3 m-1 rounded-sm bg-gray-700/50 dark:bg-gray-800/50"></div>
          <div className="w-3 h-3 m-1 rounded-sm bg-green-400"></div>
          <div className="w-3 h-3 m-1 rounded-sm bg-green-500"></div>
          <div className="w-3 h-3 m-1 rounded-sm bg-green-600"></div>
          <div className="w-3 h-3 m-1 rounded-sm bg-green-700"></div>
          More
        </div>
      </div>
    </div>
  );
};

// --- MAIN LEETCODE COMPONENT ---

const LeetCodeGraph = ({ username = LEETCODE_USERNAME }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const URL = "https://leetcode.com/u/";

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchLeetCodeStats(username);
        if (!data) setError("Could not fetch LeetCode data.");
        else setStats(data);
      } catch {
        setError("Error fetching LeetCode data.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [username]);

  // --- HOOKS AND DATA PROCESSING (MUST BE UNCONDITIONAL) ---
  const easySolved = stats?.easySolved || 0;
  const mediumSolved = stats?.mediumSolved || 0;
  const hardSolved = stats?.hardSolved || 0;
  const totalSolved = easySolved + mediumSolved + hardSolved;

  const pieData = useMemo(() => {
    return [
      { name: "Easy", value: easySolved, count: easySolved, fill: COLORS[0] },
      { name: "Medium", value: mediumSolved, count: mediumSolved, fill: COLORS[1] },
      { name: "Hard", value: hardSolved, count: hardSolved, fill: COLORS[2] },
    ].filter(d => d.value > 0);
  }, [easySolved, mediumSolved, hardSolved]);

  const heatmapValues = useMemo(() => {
    if (!stats || !stats.submissionCalendar) return [];
    return Object.entries(stats.submissionCalendar || {}).map(([timestamp, count]) => ({
      date: new Date(Number(timestamp) * 1000).toISOString().split("T")[0],
      count,
    }));
  }, [stats]);
  // -----------------------------------------------------------

  if (loading) return <div className="p-4 text-gray-400">Loading LeetCode...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-6 border border-gray-700 rounded shadow-lg bg-gray-900 text-gray-200">
      
      {/* Title container uses flex to align title and button horizontally */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-white">LeetCode Progress (Total Solved: {totalSolved})</h3>
        <a
          href={`${URL}${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1 text-sm font-semibold rounded-full 
            bg-blue-600 hover:bg-blue-700 text-white transition duration-200 
            dark:bg-github-accent dark:hover:bg-blue-600"
        >
          Visit Profile
        </a>
      </div>

      

      {/* 2. Problems Solved Pie Chart */}
      {pieData.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-2 text-white">Problems Solved by Difficulty</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie 
                data={pieData} 
                dataKey="value" 
                nameKey="name" 
                innerRadius={40} 
                outerRadius={100} 
                paddingAngle={3}
                label={({ cx, cy, midAngle, innerRadius, outerRadius, value, index }) => {
                  const radius = outerRadius * 1.1; 
                  const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                  const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                  
                  if (totalSolved > 0) {
                    return (
                      <text 
                        x={x} 
                        y={y} 
                        fill={pieData[index].fill}
                        textAnchor={x > cx ? 'start' : 'end'} 
                        dominantBaseline="central"
                        fontWeight="bold"
                      >
                        {pieData[index].count}
                      </text>
                    );
                  }
                  return null;
                }}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value, name) => [`${value} solved`, `${name}`]} 
              contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #4B5563', color: '#E5E7EB' }} 
              itemStyle={{ color: '#E5E7EB' }}
              labelStyle={{ color: '#E5E7EB' }}
            />
           </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default LeetCodeGraph;
