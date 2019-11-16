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
      ok__changePasswordSuccess:{
        message: `change password success. Please login to access your dashboard`
      }
    },
    error: {
      err__passwordNotMatch: {
        message: "password not match"
      },
      err__internalSystemError: {
        message: `failure, contact admin code 89`
      },
      err__tokenExpires: {
        message: `your token is expire, Please got forget password`
      },
      err__tokenNotMatch: {
        message: "token not match"
      }
    }
  },
  action: async (inputs, outputs) => {
    var db = Mukmin.getDataModel("computate_engine");
    if (inputs.body.password !== inputs.body.password_verify) {
      return outputs.error.err__passwordNotMatch({
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
              return outputs.success.ok__changePasswordSuccess();
            } catch (error) {
              console.log("error reset password " + error.message);
              return outputs.error.err__internalSystemError({
                token: inputs.body.token
              });
            }
          } else {
            return outputs.error.err__internalSystemError({
              token: inputs.body.token
            });
          }
        });
      } else {
        return outputs.error.err__tokenExpires({
          token: inputs.body.token
        });
      }
    } else {
      return outputs.error.err__tokenNotMatch({
        token: inputs.body.token
      });
    }
  }
};
