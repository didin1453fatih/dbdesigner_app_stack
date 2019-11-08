const bcrypt = require("bcrypt");
var moment = require("moment");
var viewResetPassword = "front-office/registration/form-reset-password";
module.exports = {
  inputs: {
    body: {
      additionalProperties: false,
      type: "object",
      description: "this is body to create an article",
      required: ["token", "password", "password_verify"],
      properties: {
        token: {
          type: "string"
        },
        password: {
          type: "string"
        },
        password_verify: {
          type: "string"
        }
      }
    }
  },
  outputs: {
    success: {
      view__changePasswordSuccess: {
        path: viewResetPassword,
        data: {
          success: true,
          message: `change password success. Please login to access your dashboard`
        }
      }
    },
    error: {
      view__passwordNotMatch: {
        path: viewResetPassword,
        data: {
          success: false,
          message: "password not match"
        }
      },
      view__internalSystemError: {
        path: viewResetPassword,
        data: {
          success: false,
          message: `failure, contact admin code 89`
        }
      },
      view__tokenExpires: {
        path: viewResetPassword,
        data: {
          success: false,
          message: `your token is expire, Please got forget password`
        }
      },
      view__tokenNotMatch: {
        path: viewResetPassword,
        data: {
          success: false,
          message: "token not match"
        }
      }
    }
  },
  action: async (inputs, outputs) => {
    var db = Mukmin.getDataModel("computate_engine");
    if (inputs.body.password !== inputs.body.password_verify) {
      return outputs.error.view__passwordNotMatch({
        token: inputs.body.token
      });
    }
    var userRespond = await db.user.findAll({
      where: {
        token_password_reset: inputs.body.token
      }
    });
    if (userRespond.length === 1) {
      // cek id password is not expired
      var thisTime = moment();
      var expireTime = moment(userRespond[0].token_password_reset_expired_at);
      if (thisTime.isSameOrBefore(expireTime)) {
        bcrypt.hash(inputs.body.password, 10, async function(err, hash) {
          if (!err) {
            try {
              await db.user.update(
                {
                  password: hash,
                  token_password_reset: null,
                  token_password_reset_expired_at: null
                },
                {
                  where: {
                    id: userRespond[0].id
                  }
                }
              );
              return outputs.success.view__changePasswordSuccess({
                token: inputs.body.token
              });
            } catch (error) {
              return outputs.error.view__internalSystemError({
                token: inputs.body.token
              });
            }
          } else {
            return outputs.error.view__internalSystemError({
              token: inputs.body.token
            });
          }
        });
      } else {
        return outputs.error.view__tokenExpires({
          token: inputs.body.token
        });
      }
    } else {
      return outputs.error.view__tokenNotMatch({
        token: inputs.body.token
      });
    }
  }
};
