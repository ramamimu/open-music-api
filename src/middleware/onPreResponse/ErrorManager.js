const ClientError = require("../../exceptions/ClientError");
const NotFoundError = require("../../exceptions/NotFoundError");

module.exports = (response, h) => {
  if (response instanceof ClientError || response instanceof NotFoundError) {
    return h
      .response({
        status: "fail",
        message: response.message,
      })
      .code(response.statusCode);
  }

  // keep the original error status when > 500
  if (!response.isServer) {
    return h.continue;
  }

  return h
    .response({
      status: "error",
      message: "Maaf, terjadi kegagalan pada server kami.",
    })
    .code(500);
};
