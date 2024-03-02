const express = require("express");
const router = express.Router();
const Post = require("../models/post");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const jwSecret = process.env.JWT_SECRET;
const NewsAPI = require("newsapi");
const axios = require("axios");
const parser = require("fast-xml-parser");

const newsAPIController = require("../controllers/newsAPIController");
const unsplashController = require("../controllers/unsplashController");
const bingSearchController = require("../controllers/bingSearchController");

const newsApiKey = process.env.NEWS_API_KEY;
const newsapi = new NewsAPI(newsApiKey);

const ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;
const API_URL = `https://api.unsplash.com/photos/random?client_id=${ACCESS_KEY}&count=10`;

const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.redirect("/?alert=signin");
  }

  try {
    const decoded = jwt.verify(token, jwSecret);
    req.userId = decoded.userId;

    next();
  } catch (error) {
    return res.redirect("/?alert=signin");
  }
};

router.get("", async (req, res) => {
  try {
    const locals = {
      title: "Main page",
      description: "Here goes main page",
    };

    let pp = 5;
    let page = req.query.page || 1;

    const data = await Post.aggregate([{ $sort: { createdAt: 1 } }])
      .skip(pp * page - pp)
      .limit(pp)
      .exec();

    const count = await Post.countDocuments();
    const np = parseInt(page) + 1;
    const hasNextP = np <= Math.ceil(count / pp);

    res.render("index", {
      locals,
      data,
      current: page,
      np: hasNextP ? np : null,
    });
  } catch (error) {
    console.log(error);
  }
});

router.get("/newsapi", authMiddleware, newsAPIController.newsAPIPage);

router.get("/wasap", authMiddleware, unsplashController.getLatestPhotos);

router.get("/bingSearch", authMiddleware, bingSearchController.searchNews);

router.get("/contacts", (req, res) => {
  res.render("contacts");
});

router.get;

router.get("/post/:id", authMiddleware, async (req, res) => {
  let slug = req.params.id;
  const data = await Post.findById({ _id: slug });

  try {
    const locals = {
      title: data.name,
      description: data.description,
    };

    res.render("post", { locals, data });
  } catch (error) {
    console.log(error);
  }
});

router.post("/send-message", (req, res) => {
  try {
    const { name, email, description } = req.body;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: email,
      to: process.env.EMAIL_USER,
      subject: `Message from ${email}`,
      text: description,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        res.status(500).json("Something went wrong!");
      } else {
        console.log("Message sent: %s", info.messageId);
        res.redirect("/contacts");
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error sending message");
  }
});

module.exports = router;
