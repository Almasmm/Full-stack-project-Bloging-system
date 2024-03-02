const NewsAPI = require("newsapi");
const newsApiKey = process.env.NEWS_API_KEY; // Fetching API key from .env file
const newsapi = new NewsAPI(newsApiKey);

exports.newsAPIPage = async (req, res) => {
  try {
    const newsData = await newsapi.v2.topHeadlines({
      language: "en",
      country: "us",
    });

    const newsArticles = newsData.articles || [];

    res.render("newsapi", { title: "NewsAPI Page", newsArticles });
  } catch (error) {
    console.error("Error fetching news data:", error);
    res.status(500).send("Error fetching news data");
  }
};
