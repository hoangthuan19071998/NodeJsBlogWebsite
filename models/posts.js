"use strict";
const { Model } = require("sequelize");
const { post } = require("../routes/posts");
module.exports = (sequelize, DataTypes) => {
  class posts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      posts.belongsTo(models.users, {
        foreignKey: "id",
        sourceKey: "authorId",
        as: "author",
      });
      posts.hasMany(models.like, {
        foreignKey: "postid",
        sourceKey: "id",
        as: "like",
      });
    }
  }
  posts.init(
    {
      title: DataTypes.STRING,
      content: DataTypes.STRING,
      description: DataTypes.STRING,
      authorId: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "posts",
    }
  );
  return posts;
};
