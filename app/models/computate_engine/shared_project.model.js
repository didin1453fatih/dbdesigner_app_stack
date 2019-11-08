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
    project_id: {
      type: Sequelize.INTEGER
    },
    user_id: {
      type: Sequelize.INTEGER
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
        foreignKey: "article_id",
        sourceKey: "id"
      }
    }
  ]
};
