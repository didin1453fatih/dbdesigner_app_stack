var path = require("path");
const bcrypt = require("bcrypt");
var moment = require("moment");
var uuid = require("uuid/v4");
var ejs = require("ejs");
var fs = require("fs");
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
    query: {},
    body: {
      type: "object",
      description: "this is body to create an article",
      required: [
        "user_name",
        "complete_name",
        "gender",
        "email",
        "password",
        "password_confirm"
      ],
      properties: {
        user_name: {
          type: "string",
          maxLength: 50
        },
        complete_name: {
          type: "string"
        },
        gender: {
          type: "string"
        },
        email: {
          type: "string"
        },
        password: {
          type: "string"
        },
        password_confirm: {
          type: "string"
        }
      }
    }
  },
  outputs: {
    success: {
      ok: {
        message:
          "Account created. Mail server is busy. Check your mail after 10 minute"
      }
    },
    error: {
      err__emailUseInAnotherAccount: {
        code: 121,
        message: "Email used in another account"
      },
      err__passwordConfirmationNotMatch: {
        code: 123,
        message: "Password confirmation not match"
      },
      err__failureSendEmailConfirmation: {
        code: 567,
        message:
          "Something wrong. Mail server is busy. Check your mail after 10 minute"
      },
      err: {
        code: 505,
        message: "Registration Failure"
      }
    }
  },
  action: async (inputs, outputs) => {
    var db = Mukmin.getDataModel("computate_engine");
    //check email password confirmation
    if (inputs.body.password !== inputs.body.password_confirm) {
      return outputs.success.err__passwordConfirmationNotMatch();
    }

    try {
      bcrypt.hash(inputs.body.password, 10, async function(err, hash) {
        if (!err) {
          var tokenEmailVerify = await uuid();
          tokenEmailVerify += await uuid();
          tokenEmailVerify += await uuid();
          var tokenEmailExpireAt = await moment()
            .add(12, "hours")
            .format("YYYY-MM-DD HH:mm:ss");

          var str = await fs.readFileSync(
            path.join(Mukmin.root, "app/views/mails/email-confirm.ejs"),
            "utf8"
          );

          var messageHtml = ejs.render(str, {
            confirmation:
              Mukmin.getConfig("app").url +
              "?action=email-confirmation&token=" +
              tokenEmailVerify
          });

          try {
            var userRespond = await db.user.create({
              user_name: inputs.body.user_name,
              email: inputs.body.email,
              complete_name: inputs.body.complete_name,
              verified: false,
              status: 0,
              password: hash,
              gender: inputs.body.gender,
              token_email_verify: tokenEmailVerify,
              token_email_verify_expired_at: tokenEmailExpireAt
            });
          } catch (error) {
            if (error.parent.code === "ER_DUP_ENTRY") {
              return outputs.error.err__emailUseInAnotherAccount();
            } else {
              return outputs.error.err();
            }
          }

          // setup e-mail data with unicode symbols
          var mailOptions = {
            from: "dbdesigner.id <noreply.dbdesigner.id@gmail.com>", // sender address
            to: inputs.body.email,
            subject: "Email Confirmation [dbdesigner.id]", // Subject line
            html: messageHtml
          };
          // send mail with defined transport object
          await smtpTransport.sendMail(mailOptions, (error, response) => {});
          inputs.req.session.userId = userRespond.id;
          inputs.req.session.save(err => {
            if (!err) {
              return outputs.success.ok(userRespond);
            } else {
              return outputs.error.err__failureSendEmailConfirmation(
                userRespond
              );
            }
          });
        } else {
          return outputs.error.err();
        }
      });
    } catch (error) {
      return outputs.error.err();
    }
  }
};
