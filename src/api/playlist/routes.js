const method = require("../../types/ApiMethods");

const parentPath = "/playlists";

const routes = (handler) => [
  {
    method: method.POST,
    path: parentPath,
    handler: (request, h) => handler.postPlaylistHandler(request, h),
    options: {
      auth: "musicapp_jwt",
    },
  },
  {
    method: method.GET,
    path: parentPath,
    handler: (request, h) => handler.getPlaylistHandler(request, h),
    options: {
      auth: "musicapp_jwt",
    },
  },
  {
    method: method.DELETE,
    path: parentPath + "/{id}",
    handler: (request, h) => handler.deletePlaylistByIdHandler(request, h),
    options: {
      auth: "musicapp_jwt",
    },
  },
  {
    method: method.POST,
    path: parentPath + "/{id}/songs",
    handler: (request, h) => handler.postPlaylistSongsByIdHandler(request, h),
    options: {
      auth: "musicapp_jwt",
    },
  },
  {
    method: method.GET,
    path: parentPath + "/{id}/songs",
    handler: (request, h) => handler.getPlaylistSongsByIdHandler(request, h),
    options: {
      auth: "musicapp_jwt",
    },
  },
  {
    method: method.DELETE,
    path: parentPath + "/{id}/songs",
    handler: (request, h) => handler.deletePlaylistSongsByIdHandler(request, h),
    options: {
      auth: "musicapp_jwt",
    },
  },
];

module.exports = routes;
