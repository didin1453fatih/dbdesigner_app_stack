module.exports = {
  inputs: {
    query: {},
    body: {
      additionalProperties: false,
      type: "object",
      required: ["id", "status", "password"],
      properties: {
        id: {
          type: "number"
        },
        status: {
          type: "number"
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
      err__dataNotFound: {
        message: "Data id not found"
      }
    }
  },
  /**
   * If status is 0 (private), password is not required.
   * If status is 2 (public), password is optional. You can use null for no password and set if need password
   */
  action: async (inputs, outputs) => {
    var db = Mukmin.getDataModel("computate_engine");
    var sharePassword = null;
    var shareLink = null;
    if (inputs.body.status === 0) {
      sharePassword = null;
    } else if (inputs.body.status === 1) {
    } else if (inputs.body.status === 2) {
      var dataRespond = await db.project.findByPk(inputs.body.id);
      sharePassword = inputs.body.password;
      shareLink =
        Mukmin.getConfig("app").url + "/shared?uuid=" + dataRespond.uuid;
    }

    var projectRespond = await db.project.update(
      {
        share_status: inputs.body.status,
        share_password: sharePassword,
        share_link: shareLink
      },
      {
        where: {
          id: inputs.body.id,
          user_id: inputs.req.me.id
        }
      }
    );
    if (projectRespond[0] == 1) {
      dataRespond = await db.project.findByPk(inputs.body.id);
      return outputs.success.ok({
        id: dataRespond.id,
        uuid: dataRespond.uuid,
        title: dataRespond.title,
        share_status: dataRespond.share_status,
        share_password: dataRespond.share_password,
        share_link: dataRespond.share_link
      });
    } else {
      return outputs.error.data_not_found();
    }
  }
};
