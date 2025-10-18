import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { GoogleGenAI } from "@google/genai";
import { PROFILE_DATA } from "./src/data/profileData.js"; // Assuming this path is correct

dotenv.config();

const app = express();
app.use(express.json());

// Set CORS to allow requests from the frontend deployment
app.use(
  cors({
    origin: "https://profile-wesbite.vercel.app", // Removed trailing slash for exact match
  })
);

const PORT = process.env.PORT || 5000;

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  console.error("GEMINI_API_KEY is missing in .env file");
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

// Convert PROFILE_DATA into readable grounding text
const groundingText = `
Name: ${PROFILE_DATA.user.name}
Bio: ${PROFILE_DATA.user.bio}
Location: ${PROFILE_DATA.user.location}
Email: ${PROFILE_DATA.user.email}

Skills:
  - Languages: ${PROFILE_DATA.skills.languages
    .map((s) => `${s.name} (${s.description})`)
    .join(", ")}
  - Frontend: ${PROFILE_DATA.skills.frontend.map((s) => s.name).join(", ")}
  - Backend: ${PROFILE_DATA.skills.backend.map((s) => s.name).join(", ")}
  - ML/AI: ${PROFILE_DATA.skills.ml_ai.map((s) => s.name).join(", ")}
  - Tools/DevOps: ${PROFILE_DATA.skills.tools_devops.map((s) => s.name).join(", ")}

Projects:
${PROFILE_DATA.projects.map((p) => `  - ${p.name}: ${p.desc}`).join("\n")}

Experience:
${PROFILE_DATA.experience
    .map((e) => `  - ${e.title} at ${e.company} (${e.dates}): ${e.desc}`)
    .join("\n")}

Coding Profiles:
${PROFILE_DATA.codingProfiles
    .map((c) => `  - ${c.name}: ${c.rank}, ${c.link}`)
    .join("\n")}
`;

// =======================================================
// === 1. Gemini Chat Endpoint ===========================
// =======================================================

app.post("/api/chat", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || prompt.trim() === "") {
      return res.status(400).json({ error: "Prompt is required" });
    }

    console.log("Received prompt:", prompt);

    const geminiPrompt = `
You are Riddhi's AI assistant. Answer user questions using ONLY the profile data below.
Do NOT make up information. Be friendly and informative.

Profile Data:
${groundingText}

User Question: ${prompt}

Answer concisely.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ text: geminiPrompt }],
      temperature: 0.7,
      candidateCount: 1,
      maxOutputTokens: 500,
    });
    
    // Extract reply safely
    let reply = "No response from AI";
    const firstCandidate = response?.candidates?.[0];
    if (firstCandidate && firstCandidate.content) {
      reply = firstCandidate.content.parts?.map((p) => p.text || "").join(" ") || firstCandidate.content.text || reply;
    }

    console.log("Gemini reply:", reply);
    res.json({ reply });
  } catch (err) {
    console.error("Server error calling Gemini API:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// =======================================================
// === 2. Codeforces Proxy Endpoint ======================
// =======================================================

app.get("/api/codeforces/:handle", async (req, res) => {
  try {
    const handle = req.params.handle;
    const response = await fetch(`https://codeforces.com/api/user.rating?handle=${handle}`);
    const data = await response.json();
    res.json(data); // Forward the Codeforces API response
  } catch (err) {
    console.error("Error fetching Codeforces:", err.message);
    res.status(500).json({ error: "Failed to fetch Codeforces data" });
  }
});


// =======================================================
// === 3. LeetCode Proxy Endpoint (Consolidated & Fixed) =
// =======================================================

app.post("/api/leetcode", async (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ error: "Username required" });

  try {
    const LEETCODE_QUERY = `
      query userStats($username: String!) {
        matchedUser(username: $username) {
          username
          submitStatsGlobal {
            acSubmissionNum {
              difficulty
              count
            }
          }
          userContestRanking {
            rating
            globalRanking
            attendedContestsCount
          }
          submissionCalendar
        }
      }
    `;

    const response = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: LEETCODE_QUERY,
        variables: { username },
      }),
    });

    const data = await response.json();
    const user = data.data?.matchedUser;

    if (!user) throw new Error("Invalid username or no data returned");
    
    // Process and simplify the data structure for the frontend
    const totalSolvedStats = user.submitStatsGlobal.acSubmissionNum;

    res.json({
      username: user.username,
      easySolved: totalSolvedStats.find(d => d.difficulty === "Easy")?.count || 0,
      mediumSolved: totalSolvedStats.find(d => d.difficulty === "Medium")?.count || 0,
      hardSolved: totalSolvedStats.find(d => d.difficulty === "Hard")?.count || 0,
      // Total solved count (may not be provided directly, but we don't need it if we sum E/M/H on frontend)
      totalSolved: totalSolvedStats.find(d => d.difficulty === "All")?.count || 0, 
      
      // Send raw contest and calendar data for component processing
      contestRanking: user.userContestRanking,
      submissionCalendar: user.submissionCalendar,
    });
    
  } catch (error) {
    console.error("Error fetching LeetCode via proxy:", error.message);
    res.status(500).json({ error: error.message || "Failed to fetch LeetCode data" });
  }
});


app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});