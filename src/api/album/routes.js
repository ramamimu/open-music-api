const method = require("../../types/ApiMethods");

const routes = (handler) => [
  {
    method: method.POST,
    path: "/albums",
    handler: (request, h) => handler.postAlbumHandler(request, h),
  },
  {
    method: method.GET,
    path: "/albums/{id}",
    handler: (request, h) => handler.getAlbumByIdHandler(request, h),
  },
  {
    method: method.PUT,
    path: "/albums/{id}",
    handler: (request, h) => handler.putAlbumByIdHandler(request, h),
  },
  {
    method: method.DELETE,
    path: "/albums/{id}",
    handler: (request, h) => handler.deleteAlbumByIdHandler(request, h),
  },
];

module.exports = routes;
