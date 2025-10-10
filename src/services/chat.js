export const getChatReply = async (prompt) => {
  try {
    const response = await fetch("http://localhost:5000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Server error:", errText);
      throw new Error(`Server error: ${errText}`);
    }

    const data = await response.json();
    return data.reply;
  } catch (err) {
    console.error("getChatReply error:", err);
    throw err;
  }
};
