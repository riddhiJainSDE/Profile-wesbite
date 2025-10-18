import React, { useState, useEffect } from "react";
import { fetchCodeChefData } from "../services/api";

const CodeChefGraph= ({ handle }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const URL = "https://www.codechef.com/users/";

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const stats = await fetchCodeChefData(handle);
        if (!stats) setError("Could not fetch CodeChef data.");
        else setData(stats);
      } catch {
        setError("Error fetching CodeChef data.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [handle]);

  if (loading) return <div className="p-4 text-gray-400">Loading CodeChef...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  // Map the data keys to match the image structure
  const currentRating = data.rating_number || data.currentRating;
  const maxRating = data.max_rank || data.highestRating;
  const starRating = data.rating || data.stars; 
  const globalRank = data.global_rank || data.globalRank;
  const countryRank = data.country_rank || data.countryRank;
  const username = data.username || handle;

  return (
    <div className="p-6 border border-gray-700 rounded shadow-lg bg-gray-900 text-gray-200">
      {/* Title container uses flex to align title and button horizontally */}
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-white">CodeChef Profile</h3>
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

      <table className="w-full border-collapse text-left text-gray-200">
        <tbody>
          <tr className="hover:bg-gray-800 transition duration-150">
            <td className="p-2 font-semibold border-b border-gray-700">Username</td>
            <td className="p-2 border-b border-gray-700">{username}</td>
          </tr>
          <tr className="hover:bg-gray-800 transition duration-150">
            <td className="p-2 font-semibold border-b border-gray-700">Current Rating</td>
            <td className="p-2 border-b border-gray-700">{currentRating} ({starRating})</td>
          </tr>
          <tr className="hover:bg-gray-800 transition duration-150">
            <td className="p-2 font-semibold border-b border-gray-700">Highest Rating</td>
            <td className="p-2 border-b border-gray-700">{maxRating}</td>
          </tr>
          <tr className="hover:bg-gray-800 transition duration-150">
            <td className="p-2 font-semibold border-b border-gray-700">Global Rank</td>
            <td className="p-2 border-b border-gray-700">{globalRank}</td>
          </tr>
          <tr className="hover:bg-gray-800 transition duration-150">
            <td className="p-2 font-semibold">Country Rank</td>
            <td className="p-2">{countryRank}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default CodeChefGraph;
