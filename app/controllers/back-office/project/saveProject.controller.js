module.exports = {
  inputs: {
    query: {},
    body: {
      additionalProperties: false,
      type: "object",
      description: "this is body to create an article",
      required: ["data_design", "id"],
      properties: {
        id: {
          type: "number"
        },
        data_design: {
          type: "string"
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
      err__notFound: {
        message: "Project not found"
      }
    }
  },
  action: async (inputs, outputs) => {
    try {
      var db = Mukmin.getDataModel("computate_engine");
      var projectRespond = await db.project.update(
        {
          data_design: inputs.body.data_design
        },
        {
          where: {
            id: inputs.body.id,
            user_id: inputs.req.me.id
          }
        }
      );

      return outputs.success.ok(projectRespond);
    } catch (error) {
      return outputs.error.err__notFound();
    }
  }
};
