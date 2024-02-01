const ExportPlaylistsHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "export",
  version: "1.0.0",
  register: async (server, params) => {
    const exportPlaylists = new ExportPlaylistsHandler(params);
    server.route(routes(exportPlaylists));
  },
};
