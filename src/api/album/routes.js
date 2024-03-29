const method = require("../../types/ApiMethods");

// @arrow-functions is used for prevent repeating use this due to scope issue
// if do not apply bind in that class, the scope of this will through out of the instance class
// this happen because the initiation on the index.js calling with another function so the level of `this` variable will change
// e.g server.route(routes(songhandler));
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
  {
    method: method.POST,
    path: "/albums/{id}/covers",
    handler: (request, h) => handler.postAlbumCoversByIdHandler(request, h),
    options: {
      payload: {
        allow: "multipart/form-data",
        multipart: true,
        output: "stream",
        maxBytes: "512000",
      },
    },
  },
  {
    method: method.POST,
    path: "/albums/{id}/likes",
    handler: (request, h) => handler.postAlbumLikesByIdHandler(request, h),
    options: {
      auth: "musicapp_jwt",
    },
  },
  {
    method: method.DELETE,
    path: "/albums/{id}/likes",
    handler: (request, h) => handler.deleteAlbumLikesByIdHandler(request, h),
    options: {
      auth: "musicapp_jwt",
    },
  },
  {
    method: method.GET,
    path: "/albums/{id}/likes",
    handler: (request, h) => handler.getAlbumLikesByIdHandler(request, h),
  },
];

module.exports = routes;
