const method = require("../../types/ApiMethods");

const routes = (handler) => [
  {
    method: method.POST,
    path: "/export/playlists/{id}",
    handler: (request, h) => handler.postExportPlaylistsByIdHandler(request, h),
    options: {
      auth: "musicapp_jwt",
    },
  },
];

module.exports = routes;
