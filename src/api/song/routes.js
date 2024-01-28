const method = require("../../types/ApiMethods");

const routes = (handler) => [
  {
    method: method.POST,
    path: "/songs",
    handler: handler.postSongHandler,
  },
  {
    method: method.GET,
    path: "/songs",
    handler: handler.getAllSongHandler,
  },
  {
    method: method.GET,
    path: "/songs/{id}",
    handler: handler.getSongByIdHandler,
  },
  {
    method: method.PUT,
    path: "/songs/{id}",
    handler: handler.putSongByIdHandler,
  },
  {
    method: method.DELETE,
    path: "/songs/{id}",
    handler: handler.deleteSongByIdHandler,
  },
];

module.exports = routes;
