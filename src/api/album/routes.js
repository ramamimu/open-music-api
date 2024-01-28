const method = require("../../types/ApiMethods");

const routes = (handler) => [
  {
    method: method.POST,
    path: "/albums",
    handler: handler.postAlbumHandler,
  },
  {
    method: method.GET,
    path: "/albums/{id}",
    handler: handler.getAlbumByIdHandler,
  },
  {
    method: method.PUT,
    path: "/albums/{id}",
    handler: handler.putAlbumByIdHandler,
  },
  {
    method: method.DELETE,
    path: "/albums/{id}",
    handler: handler.deleteAlbumByIdHandler,
  },
];

module.exports = routes;
