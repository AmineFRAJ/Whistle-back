const axios = require("axios");
let cachedMatches = null;
let lastFetchTime = 0;
exports.getMatches = async (req, res) => {
  try {
    const response = await axios.get(
      "https://api.football-data.org/v4/matches",
      {
        headers: {
          "X-Auth-Token": process.env.REACT_APP_API_TOKEN,
          "Content-Type": "application/json",
        },
      }
    );
    console.log(process.env.REACT_APP_API_TOKEN, response.data);
    res.json({ matches: response.data.matches });
  } catch (error) {
    console.error("API error:", error.message);
    res.status(500).json({ error: "Failed to fetch matches" });
  }
};

exports.getMatchesFinished = async (req, res) => {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  const formatted = date.toISOString().split("T")[0];

  try {
    const response = await axios.get(
      `https://api.football-data.org/v4/matches?date=${formatted}`,
      {
        headers: {
          "X-Auth-Token": process.env.REACT_APP_API_TOKEN,
          "Content-Type": "application/json",
        },
      }
    );
    res.json({ matches: response.data.matches });
  } catch (error) {
    console.error("API error:", error.message);
    res.status(500).json({ error: "Failed to fetch finished matches" });
  }
};

exports.filterLeagueMatches = async (req, res) => {
  const { name } = req.params;
  const now = Date.now();

  // Cache for 60 seconds
  if (cachedMatches && now - lastFetchTime < 60_000) {
    console.log("✅ Returning cached matches");
    const filtered = cachedMatches.filter(
      (match) =>
        match.competition &&
        match.competition.name &&
        match.competition.name.toLowerCase() === name.toLowerCase()
    );
    return res.json({ matches: filtered });
  }

  try {
    const response = await axios.get(
      "https://api.football-data.org/v4/matches",
      {
        headers: {
          "X-Auth-Token": process.env.REACT_APP_API_TOKEN,
          "Content-Type": "application/json",
        },
      }
    );

    cachedMatches = response.data.matches || [];
    lastFetchTime = now;

    const filtered = cachedMatches.filter(
      (match) =>
        match.competition &&
        match.competition.name &&
        match.competition.name.toLowerCase() === name.toLowerCase()
    );

    res.json({ matches: filtered });
  } catch (error) {
    console.error("❌ API error:", error.message);
    res.status(500).json({ error: "Too many requests. Please wait." });
  }
};
// NEWS API
exports.getNews = async (req, res) => {
  try {
    const response = await axios.get(
      'https://newsapi.org/v2/everything?q=soccer&pageSize=5',
      {
        headers: {
         'X-Api-Key': process.env.REACT_APP_API_TOKEN_NEWS,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log('✅ News articles count:', response.data.articles?.length);

    res.json({ articles: response.data.articles });
  } catch (error) {
    console.error('🛑 News API error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
};