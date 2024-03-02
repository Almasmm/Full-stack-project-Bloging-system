const express = require("express");
const router = express.Router();
const Post = require("../models/post");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const adLay = "../views/layouts/admin.ejs";
const jwSecret = process.env.JWT_SECRET;

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.redirect("/");
  }

  try {
    const decoded = jwt.verify(token, jwSecret);
    req.userId = decoded.userId;
    req.isAdmin = true;
    if (!req.isAdmin) {
      return res.redirect("/");
    }
    next();
  } catch (error) {
    return res.redirect("/");
  }
};

router.get("/admin", async (req, res) => {
  try {
    const locals = {
      title: "Admin",
      description: "Here admin page goes!",
    };

    res.render("admin/index", { locals, layout: adLay });
  } catch (error) {
    console.log(error);
  }
});

router.post("/admin", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPass = await bcrypt.compare(password, user.password);

    if (!isPass) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, jwSecret);
    res.cookie("token", token, { httpOnly: true });

    if (email === "muratalmas05.kz@gmail.com" && password === "1234") {
      return res.redirect("/dashboard");
    } else {
      return res.redirect("/");
    }
  } catch (error) {
    console.log(error);
  }
});

router.get("/dashboard", authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: "Dashboard",
      description: "here admin dashbord goes!",
    };

    const data = await Post.find();
    res.render("admin/dashboard", {
      locals,
      data,
      layout: adLay,
    });
  } catch (error) {
    console.log(error);
  }
});

router.get("/add-post", authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: "Add post",
      description: "here adding post goes!",
    };

    if (!req.isAdmin) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const data = await Post.find();
    res.render("admin/add-post", {
      locals,
      layout: adLay,
    });
  } catch (error) {
    console.log(error);
  }
});

router.post("/add-post", authMiddleware, async (req, res) => {
  try {
    try {
      const newData = new Post({
        name: req.body.name,
        description: req.body.description,
      });

      if (!req.isAdmin) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      await Post.create(newData);

      res.redirect("/dashboard");
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log(error);
  }
});

router.get("/edit-post/:id", authMiddleware, async (req, res) => {
  try {
    const data = await Post.findOne({ _id: req.params.id });

    const locals = {
      title: "Edit post",
      description: "here editing post goes!",
    };

    if (!req.isAdmin) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    res.render("admin/edit-post", {
      locals,
      data,
      layout: adLay,
    });
  } catch (error) {
    console.log(error);
  }
});

router.put("/edit-post/:id", authMiddleware, async (req, res) => {
  try {
    if (!req.isAdmin) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await Post.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
      description: req.body.description,
      updatedAt: Date.now(),
    });

    res.redirect(`/edit-post/${req.params.id}`);
  } catch (error) {
    console.log(error);
  }
});

router.delete("/delete-post/:id", authMiddleware, async (req, res) => {
  try {
    if (!req.isAdmin) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await Post.deleteOne({ _id: req.params.id });
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie("token");
  console.log("Logout succesfully!");
  res.redirect("/");
});

router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);

  try {
    const user = await User.create({ email, password: hashed });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Welcome to Our Blog!",
      text: "Thank you for registering with us!",
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        res.status(500).json("Something went wrong!");
      } else {
        console.log("Message sent: %s", info.messageId);
      }
    });

    res.redirect("/");
  } catch (error) {
    if (error.code === 11000) {
      res.status(409).json({ message: "User already exists!" });
    }
  }
});

module.exports = router;
