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
    }
  },
  action: async (inputs, outputs) => {
    var me = inputs.req.me;
    outputs.success.ok({
      id: me.id,
      user_name: me.user_name,
      email: me.email,
      complete_name: me.complete_name,
      verified: me.verified,
      status: me.status,
      gender: me.gender,
      facebook_account: me.facebook_account,
      github_account: me.github_account,
      twitter_account: me.twitter_account,
      created: me.created,
      updated: me.updated
    });
  }
};
