module.exports = {
  inputs: {
    query: {},
    body: {
      additionalProperties: false,
      type: "object",
      description: "this is body to create an article",
      required: ["title", "description", "id"],
      properties: {
        id: {
          type: "number"
        },
        title: {
          type: "string",
          maxLength: 50
        },
        description: {
          type: "string",
          maxLength: 50
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
      err__failure: {
        message: "category id not found"
      }
    }
  },
  action: async (inputs, outputs) => {
    try {
      var db = Mukmin.getDataModel("computate_engine");
      var articleRespond = await db.project.update(
        {
          description: inputs.body.description,
          title: inputs.body.title
        },
        {
          where: {
            id: inputs.body.id,
            user_id: inputs.req.me.id
          }
        }
      );
      return outputs.success.ok(articleRespond);
    } catch (error) {
      return outputs.error.err__failure();
    }
  }
};
