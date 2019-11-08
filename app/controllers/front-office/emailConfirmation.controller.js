var moment = require("moment");
module.exports = {
  inputs: {
    query: {
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
      redirect__re_login: {
        location: "/app/#?src=mail_confirmation&action=re_login"
      },
      redirect__home: {
        location: "/app/#?src=mail_confirmation&action=open_project"
      }
    },
    error: {
      redirect__error_email_confirmation_expired: {
        location:
          "/app/#?src=mail_confirmation&action=error_email_confirmation_expired"
      },
      redirect__token_not_valid: {
        location: "/app/#?src=mail_confirmation&action=token_not_valid"
      }
    }
  },
  action: async (inputs, outputs) => {
    var db = Mukmin.getDataModel("computate_engine");
    var userRespond = await db.user.findOne({
      where: { token_email_verify: inputs.query.token }
    });
    if (userRespond !== null && userRespond !== undefined) {
      if (userRespond.verified === true) {
        inputs.req.session.destroy(function(err) {
          return outputs.success.redirect__re_login(
            "&message=You was verified. Please Login again"
          );
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
            return outputs.success.redirect__home(
              "&message=Email confirmation is success"
            );
          } else {
            return outputs.success.redirect__re_login(
              "&message=Email confirmation is success. Lets Login"
            );
          }
        });
      } else {
        inputs.req.session.destroy(function(err) {
          return outputs.error.redirect__error_email_confirmation_expired(
            "&message=Your token is expired please resend to your mail"
          );
        });
      }
    } else {
      inputs.req.session.destroy(function(err) {
        return outputs.error.redirect__token_not_valid(
          "&message=Token not valid please login"
        );
      });
    }
  }
};
