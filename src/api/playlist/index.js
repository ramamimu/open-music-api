const PlaylistsHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "playlist",
  version: "1.0.0",
  register: async (server, params) => {
    const playlistHandler = new PlaylistsHandler(params);
    server.route(routes(playlistHandler));
  },
};
