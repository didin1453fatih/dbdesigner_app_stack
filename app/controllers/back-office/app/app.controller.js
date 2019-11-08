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
    // return outputs.success.render();
    return outputs.res.sendFile('C:/Users/galih/Documents/learning/VUE design/graphich-model-app-stack/assets/dist/index.html')
  }
};
