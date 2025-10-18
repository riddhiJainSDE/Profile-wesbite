const BASE_URL = "https://profile-wesbite.onrender.com";

export const fetchCodeforcesRatings = async (handle) => {
  try {
    // Updated to use the deployed base URL
    const res = await fetch(`${BASE_URL}/api/codeforces/${handle}`);
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
    // This URL remains the same as it uses a different third-party proxy
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
    // Updated to use the deployed base URL for the POST endpoint
    const res = await fetch(`${BASE_URL}/api/leetcode`, {
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
