const post = require("../models").posts;

module.exports = {
  create(req, res) {
    return post
      .create({
        title: req.body.title,
        category: req.body.category,
        text: req.body.text,
        isPublic: req.body.isPublic,
        authorId: req.body.authorId,
      })
      .then((post) => res.status(201).send(post))
      .catch((error) => res.status(400).send(error));
  },
};
