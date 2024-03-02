const axios = require("axios");
require("dotenv").config();

exports.getLatestPhotos = async (req, res) => {
  try {
    const response = await axios.get("https://api.unsplash.com/photos", {
      params: {
        client_id: process.env.UNSPLASH_ACCESS_KEY,
        per_page: 10,
      },
    });

    const photos = response.data;

    res.render("wasap", { images: photos });
  } catch (error) {
    console.error("Error fetching photos from Unsplash:", error);
    res.status(500).send("Error fetching photos from Unsplash");
  }
};
