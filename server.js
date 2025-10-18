import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { GoogleGenAI } from "@google/genai";
import { PROFILE_DATA } from "./src/data/profileData.js";

dotenv.config();

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "https://profile-wesbite.vercel.app/",
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
${PROFILE_DATA.projects.map((p) => `  - ${p.name}: ${p.desc}`).join("\n")}

Experience:
${PROFILE_DATA.experience
  .map((e) => `  - ${e.title} at ${e.company} (${e.dates}): ${e.desc}`)
  .join("\n")}

Coding Profiles:
${PROFILE_DATA.codingProfiles
  .map((c) => `  - ${c.name}: ${c.rank}, ${c.link}`)
  .join("\n")}
`;

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
    console.log("Full Gemini response:", JSON.stringify(response, null, 2));
    // Extract reply safely
   let reply = "No response from AI";
const firstCandidate = response?.candidates?.[0];
if (firstCandidate && firstCandidate.content) {
  if (Array.isArray(firstCandidate.content.parts)) {
    reply = firstCandidate.content.parts.map((p) => p.text || "").join(" ");
  } else if (typeof firstCandidate.content === "string") {
    reply = firstCandidate.content;
  } else if (firstCandidate.content.text) {
    reply = firstCandidate.content.text;
  }
}


    console.log("Gemini reply:", reply);
    res.json({ reply });
  } catch (err) {
    console.error("Server error calling Gemini API:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

app.post("/api/leetcode", async (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ error: "Username required" });

  try {
    const response = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: "https://leetcode.com",
        Referer: "https://leetcode.com/",
      },
      body: JSON.stringify({
        query: `
          query getUserProfile($username: String!) {
            matchedUser(username: $username) {
              username
              submitStatsGlobal {
                acSubmissionNum {
                  difficulty
                  count
                }
              }
              profile {
                ranking
                reputation
              }
            }
          }
        `,
        variables: { username },
      }),
    });

    const data = await response.json();
    if (!data.data?.matchedUser) throw new Error("Invalid username");

    const user = data.data.matchedUser;
    res.json({
      username: user.username,
      easySolved: user.submitStatsGlobal.acSubmissionNum.find(d => d.difficulty === "Easy")?.count || 0,
      mediumSolved: user.submitStatsGlobal.acSubmissionNum.find(d => d.difficulty === "Medium")?.count || 0,
      hardSolved: user.submitStatsGlobal.acSubmissionNum.find(d => d.difficulty === "Hard")?.count || 0,
      totalSolved: user.submitStatsGlobal.acSubmissionNum.find(d => d.difficulty === "All")?.count || 0,
      ranking: user.profile.ranking,
      reputation: user.profile.reputation,
    });
  } catch (error) {
    console.error("Error fetching LeetCode via proxy:", error.message);
    res.status(500).json({ error: error.message });
  }
});
// server.js (add below existing app.use(...) lines)

// Codeforces proxy endpoint
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

// LeetCode proxy endpoint
app.post("/api/leetcode", async (req, res) => {
  try {
    const { username } = req.body;
    const query = {
      query: `
        query getUserProfile($username: String!) {
          matchedUser(username: $username) {
            username
            submitStatsGlobal {
              acSubmissionNum {
                difficulty
                count
              }
            }
            profile {
              ranking
              reputation
            }
          }
          allQuestionsCount {
            difficulty
            count
          }
        }
      `,
      variables: { username }
    };

    const response = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(query),
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Error fetching LeetCode:", err.message);
    res.status(500).json({ error: "Failed to fetch LeetCode data" });
  }
});
