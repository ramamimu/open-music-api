const AlbumHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "album",
  version: "1.0.0",
  register: async (server, params) => {
    const albumHandler = new AlbumHandler(params);
    server.route(routes(albumHandler));
  },
};
