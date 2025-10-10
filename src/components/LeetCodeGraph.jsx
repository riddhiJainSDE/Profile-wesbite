// src/components/LeetCodeGraph.jsx
import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { fetchLeetCodeStats } from "../services/api";

const COLORS = ["#00B8A3", "#FFC017", "#EF4743"]; // Easy, Medium, Hard

const LeetCodeGraph = ({ username }) => {
  const [stats, setStats] = useState(null);
  const [contestData, setContestData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const getStats = async () => {
      setLoading(true);
      setHasError(false);

      try {
        const data = await fetchLeetCodeStats(username);

        if (!data || data.totalSolved === 0) {
          setHasError(true);
          setLoading(false);
          return;
        }

        setStats(data);

        // Contest data (rating history)
        if (data.contests && Array.isArray(data.contests)) {
          const formattedContestData = data.contests.map((c) => ({
            contest: c.contestName,
            rating: c.rating,
          }));
          setContestData(formattedContestData);
        }
      } catch (error) {
        console.error("Error fetching LeetCode stats:", error);
        setHasError(true);
      }

      setLoading(false);
    };

    getStats();
  }, [username]);

  if (loading) {
    return (
      <div className="text-center py-8 text-gray-700">
        Loading LeetCode stats...
      </div>
    );
  }

  if (hasError || !stats) {
    return (
      <div className="card-wrapper shadow-xl mb-8">
        <div className="card-inner p-6 text-center text-red-500">
          Error: Could not retrieve LeetCode stats. Check username or API
          availability.
        </div>
      </div>
    );
  }

  const { easySolved, mediumSolved, hardSolved, submissionCalendar } = stats;

  const pieData = [
    { name: "Easy", value: easySolved },
    { name: "Medium", value: mediumSolved },
    { name: "Hard", value: hardSolved },
  ];

  const heatmapValues = Object.entries(submissionCalendar || {}).map(
    ([timestamp, count]) => ({
      date: new Date(parseInt(timestamp, 10) * 1000)
        .toISOString()
        .split("T")[0],
      count,
    })
  );

  return (
    <div className="card-wrapper shadow-2xl rounded-2xl overflow-hidden mb-8 bg-white border border-gray-200">
      <div className="card-inner p-6 space-y-8">
        <h2 className="text-2xl font-bold mb-4 text-center">LeetCode Stats</h2>

        {/* 1️⃣ Pie chart */}
        <div>
          <h3 className="text-xl font-semibold mb-2">Problems Solved by Difficulty</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name) => [`${value}`, `${name} Solved`]} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* 2️⃣ Heatmap */}
        <div>
          <h3 className="text-xl font-semibold mb-2">Daily Problem Solving Activity</h3>
          <CalendarHeatmap
            startDate={new Date(
              new Date().setFullYear(new Date().getFullYear() - 1)
            )}
            endDate={new Date()}
            values={heatmapValues}
            classForValue={(value) => {
              if (!value) return "color-empty";
              if (value.count >= 10) return "color-github-4";
              if (value.count >= 5) return "color-github-3";
              if (value.count >= 2) return "color-github-2";
              return "color-github-1";
            }}
            tooltipDataAttrs={(value) => ({
              "data-tip": `${value.date}: ${value.count || 0} solved`,
            })}
            showWeekdayLabels
          />
        </div>

        {/* 3️⃣ Contest rating history */}
        {contestData.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold mb-2">Contest Rating History</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={contestData}
                margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="contest" stroke="var(--color-github-text)" />
                <YAxis stroke="var(--color-github-text)" domain={["auto", "auto"]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="rating"
                  stroke="#8884d8"
                  strokeWidth={2}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeetCodeGraph;
