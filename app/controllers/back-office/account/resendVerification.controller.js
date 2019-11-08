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
  inputs: {},
  outputs: {
    success: {
      ok: {
        message:
          "Check your mail inbox. Sorry Mail server is busy. Check your mail after 10 minute"
      },
      render__formForgetPassword: {
        path: "front-office/registration/form-forget-password"
      }
    },
    error: {
      err__accountWasVerified: {
        message: "Your account was verified"
      },
      err: {
        message: "Resend failure contact admin"
      }
    }
  },
  action: async (inputs, outputs) => {
    var db = Mukmin.getDataModel("computate_engine");
    if (inputs.req.me.verified === false) {
      var thisTime = moment();
      var expireTime = moment(inputs.req.me.token_email_verify_expired_at);
      var tokenEmailVerify = "";
      if (thisTime.isSameOrBefore(expireTime)) {
        tokenEmailVerify = inputs.req.me.token_email_verify;
      } else {
        tokenEmailVerify = await uuid();
        tokenEmailVerify += await uuid();
        tokenEmailVerify += await uuid();
        var tokenEmailExpireAt = await moment()
          .add(12, "hours")
          .format("YYYY-MM-DD HH:mm:ss");

        try {
          await db.user.update(
            {
              token_email_verify: tokenEmailVerify,
              token_email_verify_expired_at: tokenEmailExpireAt
            },
            {
              where: {
                id: inputs.req.me.id
              }
            }
          );
        } catch (error) {
          console.log('Error update '+error.message)
          return outputs.error.err();
        }
      }
      var str = await fs.readFileSync(
        Mukmin.getPath("app/views/mails/email-confirm.ejs"),
        "utf8"
      );

      var messageHtml = ejs.render(str, {
        confirmation:
          Mukmin.getConfig("app").url +
          "/email_confirmation?token=" +
          tokenEmailVerify
      });
      // setup e-mail data with unicode symbols
      var mailOptions = {
        from: "dbdesigner.id <noreply.dbdesigner.id@gmail.com>", // sender address
        to: inputs.req.me.email,
        subject: "Email Confirmation [dbdesigner.id]", // Subject line
        html: messageHtml
      };
      // send mail with defined transport object
      await smtpTransport.sendMail(mailOptions, (error, response) => {
        if (error) {
          console.log('Error send mail '+error.message)
          return outputs.error.err();
        } else {
          return outputs.success.ok();
        }
      });
    } else {
      return outputs.error.err__accountWasVerified();
    }
  }
};
