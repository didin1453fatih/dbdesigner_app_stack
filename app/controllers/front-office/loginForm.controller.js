var bcrypt = require("bcrypt");
module.exports = {
  inputs: {
    query: {},
    body: {
      additionalProperties: false,
      type: "object",
      description: "this is body to create an article",
      required: ["email", "password"],
      properties: {
        email: {
          type: "string",
          maxLength: 50
        },
        password: {
          type: "string",
          maxLength: 50
        }
      }
    }
  },
  outputs: {
    success: {
      redirect: {
        description: "this is",
        location: "/app"
      }
    },
    error: {
      render: {
        path: "front-office/registration/form-login"
      }
    }
  },
  action: async (inputs, outputs) => {
    var bodyPass = inputs.body.password;
    var db = Mukmin.getDataModel("computate_engine");
    var userRespond = await db.user.findOne({
      where: {
        email: inputs.body.email
      }
    });

    console.log("this session code " + JSON.stringify(userRespond));
    if (userRespond!==null) {
      bcrypt.compare(bodyPass, userRespond.password, (err, res) => {
        if (!err && res === true) {
          inputs.req.session.userId = userRespond.id;
          inputs.req.session.save(err => {
            if (!err) {
              return outputs.success.redirect();
            } else {
              return outputs.error.render({
                success: false,
                messages: "Combination not match"
              });
            }
          });
        } else {
          return outputs.error.render({
            success: false,
            messages: "Combination not match"
          });
        }
      });
    } else {
      return outputs.error.render({
        success: false,
        messages: "Combination not match"
      });
    }
  }
};
