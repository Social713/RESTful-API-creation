const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/wikiDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const articleSchema = {
  title: "String",
  content: "String",
};

const Article = mongoose.model("Article", articleSchema);

////////// Request targeting all articles /////////////

app
  .route("/articles")

  .get((req, res) => {
    Article.find((err, article) => {
      !err ? res.send(article) : res.send(err);
    });
  })

  .post((req, res) => {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });
    newArticle.save((err) => {
      !err ? res.send("Successfully added a new article.") : res.send(err);
    });
  })

  .delete((req, res) => {
    Article.deleteMany((err) => {
      !err ? res.send("Successfully deleted all articles.") : res.send(err);
    });
  });

////////// Request targeting a single article /////////////

app
  .route("/articles/:articleTitle")
  .get((req, res) => {
    Article.findOne({ title: req.params.articleTitle }, (err, article) => {
      article ? res.send(article) : res.send(err);
    });
  })
  .post((req, res) => {
    Article.update(
      { title: req.params.articleTitle },
      { title: req.body.title, content: req.body.content },
      { overwrite: true },
      (err, article) => {
        !err ? res.send("Successfully updated the article.") : res.send(err);
      }
    );
  })
  .patch((req, res) => {
    Article.update(
      { title: req.params.articleTitle },
      { $set: req.body },
      (err, article) => {
        !err ? res.send("Successfully updated the article.") : res.send(err);
      }
    );
  })
  .delete((req, res) => {
    Article.deleteOne({ title: req.params.articleTitle }, (err) => {
        !err ? res.send("Successfully deleted the article.") : res.send(err);
    });
});

app.listen(3000, () => {
  console.log("Server up and running!");
});
