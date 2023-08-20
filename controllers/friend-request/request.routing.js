const { get } = require("./get.action.js");
const { create } = require("./create.action.js");
const { accept,reject } = require("./accept.action.js");

module.exports = {
  "/": {
    post: {
      action: create,
      level: "public",
    },
    put: {
      action: accept,
      level: "public",
    },
  },
 "/reject":{
	put:{
		action:reject,
		level:"public",
	},
   },
  "/:id": {
    get: {
      action: get,
      level: "public",
    },
  },
};
