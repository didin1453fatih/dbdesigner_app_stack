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
    // 'C:/Users/galih/Documents/learning/VUE design/graphich-model-app-stack/assets/dist/index.html'
    return outputs.res.sendFile(Mukmin.getPath('assets/index.html'))
  }
};
