var uuid = require("uuid/v4");
var ejs = require("ejs");
var fs = require("fs");
var moment = require("moment");
var nodemailer = require("nodemailer");
// create reusable transport method (opens pool of SMTP connections)
var smtpTransport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_CONFRIMATION,
    pass: process.env.EMAIL_PASSWORD
  },
  tls: {
    rejectUnauthorized: false
  }
});

module.exports = {
  inputs: {
    body: {
      additionalProperties: false,
      type: "object",
      description: "this is body to create an article",
      required: ["email"],
      properties: {
        email: {
          type: "string"
        }
      }
    }
  },
  outputs: {
    success: {
      ok: {
        message: "Cek mail to reset your password"
      }
    },
    error: {
      err__forgetFailure: {
        message: "Forget password failure"
      },
      err__internalServerError: {
        message: "Internal Server Error"
      },
      err__emailNotFound: {
        message: "Email Not Found"
      }
    }
  },
  action: async (inputs, outputs) => {
    var db = Mukmin.getDataModel("computate_engine");
    var userRespond = await db.user.findAll({
      where: { email: inputs.body.email }
    });
    if (userRespond.length === 1) {
      var tokenPasswordReset = await uuid();
      tokenPasswordReset += await uuid();
      tokenPasswordReset += await uuid();
      var tokenPasswordExpireAt = await moment()
        .add(12, "hours")
        .format("YYYY-MM-DD HH:mm:ss");

      try {
        await db.user.update(
          {
            token_password_reset: tokenPasswordReset,
            token_password_reset_expired_at: tokenPasswordExpireAt
          },
          {
            where: {
              id: userRespond[0].id
            }
          }
        );
      } catch (error) {
        return outputs.error.err__forgetFailure();
      }

      var str = await fs.readFileSync(
        Mukmin.getPath("app/views/mails/forget-password.ejs"),
        "utf8"
      );

      var messageHtml = ejs.render(str, {
        confirmation:
          Mukmin.getConfig("app").url +
          "?action=reset-password&token=" +
          tokenPasswordReset
      });

      // setup e-mail data with unicode symbols
      var mailOptions = {
        from: "dbdesigner.id <noreply.dbdesigner.id@gmail.com>", // sender address
        to: inputs.body.email,
        subject: "Forget Password [dbdesigner.id]", // Subject line
        html: messageHtml
      };
      // send mail with defined transport object
      await smtpTransport.sendMail(mailOptions, (error, response) => {
        if (error) {
          console.log(error);
          return outputs.error.err__internalServerError({
            message: "Internal Server Error",
            success: false
          });
        } else {
          console.log("Message sent: " + response.message);
          return outputs.success.ok();
        }
      });
    } else {
      return outputs.error.err__emailNotFound();
    }
  }
};
