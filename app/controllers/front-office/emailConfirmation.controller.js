var moment = require("moment");
module.exports = {
  inputs: {
    body: {
      additionalProperties: false,
      type: "object",
      description: "this is body to create an article",
      required: ["token"],
      properties: {
        token: {
          type: "string"
        }
      }
    }
  },
  outputs: {
    success: {
      ok__verified_re_login: {
        message: "You was verified. Please Login again"
      },
      ok__re_login: {
        message: "Email confirmation is success. Lets Login"
      },
      ok__home: {
        message: "Email confirmation is success"
      }
    },
    error: {
      err__error_email_confirmation_expired: {
        message: "Your token is expired please resend to your mail"
      },
      err__token_not_valid: {
        message: "Token not valid please login"
      }
    }
  },
  action: async (inputs, outputs) => {
    var db = Mukmin.getDataModel("computate_engine");
    var userRespond = await db.user.findOne({
      where: { token_email_verify: inputs.body.token }
    });
    if (userRespond !== null && userRespond !== undefined) {
      if (userRespond.verified === true) {
        inputs.req.session.destroy(function(err) {
          return outputs.success.ok__verified_re_login({
            action: "re-login"
          });
        });
      }

      var thisTime = moment();
      var expireTime = moment(userRespond.token_email_verify_expired_at);
      if (thisTime.isSameOrBefore(expireTime)) {
        await db.user.update(
          {
            verified: true,
            status: 1,
            // token_email_verify: null,
            token_email_verify_expired_at: null
          },
          {
            where: {
              id: userRespond.id
            }
          }
        );
        inputs.req.session.userId = userRespond.id;
        inputs.req.session.save(err => {
          if (!err) {
            return outputs.success.ok__home({
              action: "open-project"
            });
          } else {
            return outputs.success.ok__re_login({
              action: "re-login"
            });
          }
        });
      } else {
        inputs.req.session.destroy(function(err) {
          return outputs.error.err__error_email_confirmation_expired({
            action: "nothing"
          });
        });
      }
    } else {
      inputs.req.session.destroy(function(err) {
        return outputs.error.err__token_not_valid({
          action: "nothing"
        });
      });
    }
  }
};
