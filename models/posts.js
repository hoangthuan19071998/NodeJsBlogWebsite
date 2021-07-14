"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class posts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // posts.hasMany(models.like, {
      //   foreignKey: "productId",
      //   sourceKey: "id",
      //   as: "comments",
      // });
      posts.belongsTo(models.users, {
        foreignKey: "authorId",
        sourceKey: "id",
        as: "author",
      });
    }
  }
  posts.init(
    {
      title: DataTypes.STRING,
      content: DataTypes.STRING,
      description: DataTypes.STRING,
      image: DataTypes.STRING,
      authorId: DataTypes.NUMBER,
    },
    {
      sequelize,
      modelName: "posts",
    }
  );
  return posts;
};
