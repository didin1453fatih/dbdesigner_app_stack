// const Sequelize = require("sequelize");
module.exports = {
  options: {
    createdAt: "created",
    updatedAt: "updated",
    timestamps: true,
    paranoid: false,
    freezeTableName: true
  },
  columns: {
    user_name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false
    },
    complete_name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    verified: {
      type: Sequelize.BOOLEAN,
      allowNull: false
    },
    status: {
      type: Sequelize.STRING,
      allowNull: false
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    },
    token_email_verify: {
      type: Sequelize.STRING,
      allowNull: true
    },
    token_email_verify_expired_at: {
      type: Sequelize.STRING,
      allowNull: true
    },
    token_password_reset: {
      type: Sequelize.STRING,
      allowNull: true
    },
    token_password_reset_expired_at: {
      type: Sequelize.STRING,
      allowNull: true
    },
    gender: {
      type: Sequelize.STRING,
      allowNull: false
    },
    facebook_account: {
      type: Sequelize.STRING,
      allowNull: true
    },
    github_account: {
      type: Sequelize.STRING,
      allowNull: true
    },
    twitter_account: {
      type: Sequelize.STRING,
      allowNull: true
    }
  },
  associations: [
    {
      type: "hasMany",
      model: "project",
      options: {
        foreignKey: "user_id",
        sourceKey: "id"
      }
    }
  ]
};
