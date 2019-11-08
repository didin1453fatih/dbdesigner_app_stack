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
    uuid: {
      type: Sequelize.STRING
    },
    title: {
      type: Sequelize.STRING
    },
    description: {
      type: Sequelize.STRING
    },
    likes: {
      type: Sequelize.INTEGER
    },
    // version use sermver x.y.z
    version:{
      type: Sequelize.STRING
    },
    viewers: {
      type: Sequelize.INTEGER
    },
    // 0 is private
    // 1 is protected
    // 2 is public
    share_status: {
      type: Sequelize.INTEGER
    },
    share_password: {
      type: Sequelize.STRING
    },
    share_link:{
      type: Sequelize.STRING
    },
    data_design: {
      type: Sequelize.STRING
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
