module.exports = {
  inputs: {
    query: {
      additionalProperties: false,
      type: "object",
      description: "this is body to create an article",
      required: ["id"],
      properties: {
        id: {
          type: "number"
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
        message: "Internal error"
      },
      err__notFound: {
        message: "Data not found"
      }
    }
  },
  action: async (inputs, outputs) => {
    var db = Mukmin.getDataModel("computate_engine");
    try {
      var projectRespond = await db.project.findOne({
        where: {
          id: inputs.query.id,
          user_id: inputs.req.me.id
        }
      });
      if (projectRespond === null) {
        return outputs.error.err__notFound();
      } else {
        return outputs.success.ok(projectRespond);
      }
    } catch (error) {
      return outputs.error.err__notFound();
    }
  }
};
