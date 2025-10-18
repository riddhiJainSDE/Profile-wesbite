// src/services/api.js

export const fetchCodeforcesRatings = async (handle) => {
  try {
    const res = await fetch(`http://localhost:5000/api/codeforces/${handle}`);
    if (!res.ok) throw new Error("Failed to fetch Codeforces data");
    const data = await res.json();
    return data.status === "OK" ? data.result : [];
  } catch (err) {
    console.error("Error fetching Codeforces:", err.message);
    return [];
  }
};

export const fetchCodeChefData = async (handle) => {
  try {
    const res = await fetch(`https://competeapi.vercel.app/user/codechef/${handle}`);
    if (!res.ok) throw new Error("Failed to fetch CodeChef data");
    return await res.json();
  } catch (err) {
    console.error("Error fetching CodeChef:", err.message);
    return null;
  }
};

export const fetchLeetCodeStats = async (username) => {
  try {
    const res = await fetch("http://localhost:5000/api/leetcode", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    });
    if (!res.ok) throw new Error("Failed to fetch LeetCode data");
    return await res.json();
  } catch (err) {
    console.error("Error fetching LeetCode:", err.message);
    return null;
  }
};
