module.exports = {
  inputs: {
    query: {
      additionalProperties: false,
      type: "object",
      description: "this is body to create an article",
      required: [],
      properties: {
        uuid: {
          type: "string",
          maxLength: 250
        }
      }
    },
    body: {}
  },
  outputs: {
    success: {
      redirect__toApp: {
        location: "/app/#/?uuid="
      }
    }
  },
  action: async (inputs, outputs) => {
    if (inputs.query.uuid !== undefined) {
      return outputs.success.redirect__toApp(inputs.query.uuid);
    } else {
      return outputs.success.redirect__toApp("uuid not found");
    }
  }
};
