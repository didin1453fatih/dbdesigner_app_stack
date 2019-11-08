// const Sequelize = require("sequelize");
module.exports = {
    datastore: "default",
    options: {
      createdAt: "created",
      updatedAt: "updated",
      timestamps: true,
      paranoid: false,
      freezeTableName: true
    },
    columns: {
      value: {
        type: Sequelize.STRING,
        allowNull: false
      },
      article_id: {
        type: Sequelize.STRING,
        allowNull: true
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      comment_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      }
    },
    associations: [
      {
        type: "belongsTo",
        model: "user",
        options: {
          foreignKey: "user_id",
          targetKey: "id"
        }
      },
      {
        type: "hasMany",
        model: "comment",
        options: {
          foreignKey: "comment_id",
          sourceKey: "id"
        }
      }
    ]
  };
  