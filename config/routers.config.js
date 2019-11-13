module.exports = {
  
  /**
   * Front office
   */
  "GET /auth": {
    action: "front-office/authController.js",
    policies: ["user"]
  },
  // VIEW SYSTEM

  "POST /front-office/api/v1/forgot-password-api": {
    action: "front-office/forgetPasswordAPI"
  },  
  "POST /front-office/api/v1/emailConfirmation": {
    action: "front-office/emailConfirmation"
  },
  "GET /reset-password": {
    action: "front-office/resetPasswordView"
  },
  "POST /front-office/api/v1/reset-password": {
    action: "front-office/resetPassword"
  },
  "POST /front-office/api/account/registration": {
    action: "front-office/registrationAPI"
  },  
  "POST /front-office/api/v1/account/login": {
    action: "front-office/login"
  },
  "GET /shared": {
    action: "front-office/sharedRedirect"
  },
  /**
   * Back office
   */
  "POST /back-office/api/v1/project/create": {
    action: "back-office/project/create",
    policies: ["user"]
  },

  "GET /back-office/api/v1/project/read": {
    action: "back-office/project/read",
    policies: ["user"]
  },
  "GET /back-office/api/v1/project/readByUUID": {
    action: "back-office/project/loadProjectByUUID",
    policies: ["publicAuth"]
  },
  // deprecated api for next feature
  // "GET /back-office/api/v1/project/readOne": {
  //   action: "back-office/project/readOne",
  //   policies: ["user"]
  // },
  "GET /back-office/api/v1/project/delete": {
    action: "back-office/project/delete",
    policies: ["user"]
  },
  "POST /back-office/api/v1/project/changeShareStatus": {
    action: "back-office/project/changeShareStatus",
    policies: ["user"]
  },
  "POST /back-office/api/v1/project/save": {
    action: "back-office/project/saveProject",
    policies: ["user"]
  },
  "POST /back-office/api/v1/project/update": {
    action: "back-office/project/update",
    policies: ["user"]
  },
  "GET /back-office/api/v1/fork/readOriginInfo": {
    action: "back-office/fork/readOriginInfo",
    policies: ["user"]
  },
  "POST /back-office/api/v1/fork/execute": {
    action: "back-office/fork/execute",
    policies: ["user"]
  },
  // Deprecated
  // "POST /front-office/api/v1/project/readOneUUID": {
  //   action: "front-office/readProjectOneByUUID",
  //   policies: ["publicAuth"]
  // },
  "POST /back-office/api/v1/account/update": {
    action: "back-office/account/update",
    policies: ["user"]
  },
  "GET /back-office/api/v1/account/read": {
    action: "back-office/account/read",
    policies: ["user"]
  },
  "POST /back-office/api/v1/account/changePassword": {
    action: "back-office/account/changePassword",
    policies: ["user"]
  },
  "GET /back-office/api/v1/account/logout": {
    action: "back-office/account/logout",
    policies: ["user"]
  },
  // Deprecated
  // "POST /back-office/api/v1/project/share/change": {
  //   action: "back-office/project/share/change",
  //   policies: ["user"]
  // },
  // "GET /back-office/api/v1/project/share/read": {
  //   action: "back-office/project/share/read",
  //   policies: ["user"]
  // },
  "GET /back-office/api/v1/account/resendVerification": {
    action: "back-office/account/resendVerification",
    policies: ["user"]
  },
  "GET /": {
    action: "back-office/app/app"
  }
};
