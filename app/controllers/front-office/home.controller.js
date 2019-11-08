var moment = require("moment");
module.exports = {
  inputs: {},
  outputs: {
    success: {
      render: {
        path: "front-office/landing_page/home"
      }
    }
  },
  action: async (inputs, outputs) => {
    if (inputs.req.me !== null) {
      return outputs.success.render({
        user_name: inputs.req.me.user_name
      });
    } else {
      return outputs.success.render({
        user_name: null
      });
    }
  }
};
