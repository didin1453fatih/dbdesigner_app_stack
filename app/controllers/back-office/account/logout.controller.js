module.exports = {
  inputs: {
    query: {},
    body: {}
  },
  outputs: {
    success: {
      ok: {
        message: "success"
      }
    },
    error: {
      err__failure: {
        message: "Logout problem"
      }
    }
  },
  action: async (inputs, outputs) => {
    inputs.req.session.destroy(function(err) {
      // cannot access session here
      if (!err) {
        outputs.success.ok();
      } else {
        return outputs.error.err__failure();
      }
    });
  }
};
