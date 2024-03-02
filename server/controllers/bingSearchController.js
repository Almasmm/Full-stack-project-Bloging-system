const axios = require("axios");

const API_KEY_1 = process.env.BING_SEARCH_API_KEY_1;
const API_KEY_2 = process.env.BING_SEARCH_API_KEY_2;

exports.searchNews = async (req, res) => {
  const { query } = req.query;

  try {
    const apiKey = Math.random() < 0.5 ? API_KEY_1 : API_KEY_2;

    const response = await axios.get(
      "https://api.bing.microsoft.com/v7.0/news/search",
      {
        headers: {
          "Ocp-Apim-Subscription-Key": apiKey,
        },
        params: {
          q: query,
          count: 10,
          mkt: "en-US",
        },
      }
    );

    const newsResults = response.data.value;

    res.render("bingSearch", { query, newsResults });
  } catch (error) {
    console.error("Error searching news:", error);
    res.status(500).send("Error searching news");
  }
};
