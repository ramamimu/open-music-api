const method = require("../../types/ApiMethods");

const routes = (handler) => [
  {
    method: method.POST,
    path: "/songs",
    handler: (request, h) => handler.postSongHandler(request, h),
  },
  {
    method: method.GET,
    path: "/songs",
    handler: (request, h) => handler.getAllSongHandler(request, h),
  },
  {
    method: method.GET,
    path: "/songs/{id}",
    handler: (request, h) => handler.getSongByIdHandler(request, h),
  },
  {
    method: method.PUT,
    path: "/songs/{id}",
    handler: (request, h) => handler.putSongByIdHandler(request, h),
  },
  {
    method: method.DELETE,
    path: "/songs/{id}",
    handler: (request, h) => handler.deleteSongByIdHandler(request, h),
  },
];

module.exports = routes;
