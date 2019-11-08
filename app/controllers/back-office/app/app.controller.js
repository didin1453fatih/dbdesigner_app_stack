module.exports = {
  inputs: {},
  outputs: {
    success: {
      render: {
        path: "back-office/app"
      }
    }
  },
  action: async (inputs, outputs) => {
    return outputs.success.render();
  }
};
