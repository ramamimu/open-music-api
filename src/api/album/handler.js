const ClientError = require("../../exceptions/ClientError");

class AlbumHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postAlbumHandler = this.postAlbumHandler.bind(this);
    this.getAlbumByIdHandler = this.getAlbumByIdHandler.bind(this);
    this.putAlbumByIdHandler = this.putAlbumByIdHandler.bind(this);
    this.deleteAlbumByIdHandler = this.deleteAlbumByIdHandler.bind(this);
  }

  async postAlbumHandler(request, h) {
    try {
      this._validator.validateAlbumPayload(request.payload);
      const { name, year } = request.payload;
      const albumId = this._service.addAlbum({ name, year });

      return h
        .response({
          status: "success",
          data: {
            albumId,
          },
        })
        .code(201);
    } catch (error) {
      if (error instanceof ClientError) {
        return h
          .response({
            status: "fail",
            message: error.message,
          })
          .code(error.statusCode);
      }
      return h
        .response({
          status: "error",
          message: "Maaf, terjadi kegagalan pada server kami.",
        })
        .code(500);
    }
  }
  async getAlbumByIdHandler(request, h) {
    const { id } = request.params;
    const album = this._service.getAlbumById(id);

    return h
      .response({
        status: "success",
        data: {
          album,
        },
      })
      .code(200);
  }
  async putAlbumByIdHandler(request, h) {
    try {
      this._validator.validateAlbumPayload(request.payload);
      const { id } = request.params;
      const { name, year } = request.payload;

      this._service.editAlbumById(id, { name, year });

      return h
        .response({
          status: "success",
          message: "success to edit note",
        })
        .code(200);
    } catch (error) {
      if (error instanceof ClientError) {
        return h
          .response({
            status: "fail",
            message: error.message,
          })
          .code(error.statusCode);
      }
      return h
        .response({
          status: "error",
          message: "Maaf, terjadi kegagalan pada server kami.",
        })
        .code(500);
    }
  }
  async deleteAlbumByIdHandler(request, h) {
    const { id } = request.params;
    this._service.deleteAlbumById(id);

    return h
      .response({
        status: "success",
        message: "success to delete album",
      })
      .code(200);
  }
}

module.exports = AlbumHandler;
