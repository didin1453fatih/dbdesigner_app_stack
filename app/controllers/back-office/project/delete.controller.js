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
        message: "internal error"
      },
      err__dataNotFound: {
        message: "Data not found"
      }
    }
  },
  action: async (inputs, outputs) => {
    try {
      var db = Mukmin.getDataModel("computate_engine");
      var deleteRespond = await db.project.destroy({
        where: {
          id: inputs.query.id,
          user_id: inputs.req.me.id
        }
      });

      if (deleteRespond === 0) {
        outputs.error.err__dataNotFound();
      } else {
        outputs.success.ok(deleteRespond);
      }
    } catch (error) {
      outputs.error.err();
    }
  }
};
