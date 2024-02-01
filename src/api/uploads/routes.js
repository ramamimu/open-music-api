const path = require("path");
const method = require("../../types/ApiMethods");

const routes = () => [
  {
    method: method.GET,
    path: "/upload/{params*}",
    handler: {
      directory: {
        path: path.resolve(__dirname, "file"),
      },
    },
  },
];

module.exports = routes;
