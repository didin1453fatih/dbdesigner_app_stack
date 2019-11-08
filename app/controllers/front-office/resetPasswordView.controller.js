var moment = require("moment");
module.exports = {
  inputs: {
    query: {
      additionalProperties: false,
      type: "object",
      description: "this is body to create an article",
      required: ["token"],
      properties: {
        token: {
          type: "string"
        }
      }
    }
  },
  outputs: {
    success: {
      render: {
        path: "front-office/registration/form-reset-password"
      }
    }
  },
  action: async (inputs, outputs) => {
    return outputs.success.render({ token: inputs.query.token });
  }
};
