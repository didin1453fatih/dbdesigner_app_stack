/**
 * Protected still under development
 */
module.exports = {
  inputs: {
    query: {},
    body: {
      additionalProperties: false,
      type: "object",
      description: "this is body to create an article",
      required: ["uuid", "password"],
      properties: {
        uuid: {
          type: "string"
        },
        password: {
          type: ["string", "null"]
        }
      }
    }
  },
  outputs: {
    success: {
      ok: {
        message: "success"
      }
    },
    error: {
      err: {
        message: "Internal error",
        code: 505
      },
      err__notFound: {
        message: "Data not found",
        code: 22
      },
      err__notAuthorized: {
        message: "Design not authorized to you",
        code: 24
      },
      err__needPassword: {
        message: "Input design password",
        code: 23
      },
      err__wrongPassword: {
        message: "Your password is wrong",
        code: 25
      }
    }
  },
  action: async (inputs, outputs) => {
    try {
      var db = Mukmin.getDataModel("computate_engine");
      var projectRespond = await db.project.findOne({
        where: {
          uuid: inputs.body.uuid
        }
      });
      if (projectRespond === null) {
        outputs.error.err__notFound();
      } else {
        if (projectRespond.share_status === 0) {
          /**
           * Private
           * share_status == 0
           */
          if (inputs.req.me == null) {
            return outputs.error.err__notAuthorized();
          }
          if (projectRespond.user_id === inputs.req.me.id) {
            return outputs.success.ok(projectRespond);
          } else {
            return outputs.error.err__notAuthorized();
          }
        } else if (projectRespond.share_status === 2) {
          /**
           * Public Implementation in
           * share_status === 2
           *
           */
          if (projectRespond.share_password === null) {
            return outputs.success.ok(projectRespond);
          } else if (
            projectRespond.share_password !== null &&
            inputs.body.password !== null &&
            projectRespond.share_password === inputs.body.password
          ) {
            return outputs.success.ok(projectRespond);
          } else if (
            projectRespond.share_password !== null &&
            inputs.body.password !== null &&
            projectRespond.share_password !== inputs.body.password
          ) {
            return outputs.error.err__wrongPassword(projectRespond.uuid);
          } else if (
            projectRespond.share_password !== null &&
            inputs.body.password === null
          ) {
            return outputs.error.err__needPassword({
              uuid: projectRespond.uuid,
              title: projectRespond.title
            });
          }
        } else if (projectRespond.share_status === 1) {
          /**
           * Protected not yet implementation
           * share_status === 1
           */
          outputs.error.err("Protected in development");
        } else {
          outputs.error.err();
        }
      }
    } catch (error) {
      outputs.error.err();
    }
  }
};
